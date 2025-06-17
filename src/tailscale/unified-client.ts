import { logger } from "../logger.js";
import { TailscaleAPI } from "./tailscale-api.js";
import { TailscaleCLI } from "./tailscale-cli.js";
import type {
  TailscaleConfig,
  TailscaleAPIResponse,
  CLIResponse,
  TailscaleDevice,
  TailscaleCLIStatus,
} from "../types.js";

export type TransportMode = "stdio" | "http";

export interface UnifiedClientConfig extends TailscaleConfig {
  transportMode: TransportMode;
  preferAPI?: boolean; // Default: false for stdio, true for http
}

/**
 * Unified response type that normalizes API and CLI responses
 */
export interface UnifiedResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  source: "api" | "cli";
  statusCode?: number;
}

/**
 * Unified Tailscale client that intelligently chooses between API and CLI
 * based on transport mode, availability, and configuration preferences.
 */
export class UnifiedTailscaleClient {
  private api: TailscaleAPI;
  private cli: TailscaleCLI;
  private config: UnifiedClientConfig;
  private apiAvailable: boolean = false;
  private cliAvailable: boolean = false;

  constructor(config: UnifiedClientConfig) {
    this.config = {
      preferAPI: config.transportMode === "http",
      ...config,
    };

    this.api = new TailscaleAPI({
      apiKey: config.apiKey,
      tailnet: config.tailnet,
    });

    this.cli = new TailscaleCLI(config.cliPath);
  }

  /**
   * Initialize the client by checking availability of API and CLI
   */
  async initialize(): Promise<void> {
    logger.debug("Initializing unified Tailscale client...");

    // Check API availability
    try {
      const apiTest = await this.api.testConnection();
      this.apiAvailable = apiTest.success;
      if (this.apiAvailable) {
        logger.debug("Tailscale API is available");
      } else {
        logger.debug("Tailscale API is not available:", apiTest.error);
      }
    } catch (error) {
      logger.debug("Tailscale API test failed:", error);
      this.apiAvailable = false;
    }

    // Check CLI availability
    try {
      this.cliAvailable = await this.cli.isAvailable();
      if (this.cliAvailable) {
        logger.debug("Tailscale CLI is available");
      } else {
        logger.debug("Tailscale CLI is not available");
      }
    } catch (error) {
      logger.debug("Tailscale CLI test failed:", error);
      this.cliAvailable = false;
    }

    logger.debug(
      `Client initialized - API: ${this.apiAvailable}, CLI: ${this.cliAvailable}, Mode: ${this.config.transportMode}, Prefer API: ${this.config.preferAPI}`,
    );
  }

  /**
   * Determine which client to use for a given operation
   */
  private shouldUseAPI(_operation: string): boolean {
    // If API is not available, use CLI
    if (!this.apiAvailable) {
      return false;
    }

    // If CLI is not available, use API
    if (!this.cliAvailable) {
      return true;
    }

    // Both are available, use preference
    return this.config.preferAPI || false;
  }

  /**
   * Convert API response to unified format
   */
  private normalizeAPIResponse<T>(
    response: TailscaleAPIResponse<T>,
  ): UnifiedResponse<T> {
    return {
      source: "api",
      success: response.success,
      data: response.data,
      error: response.error,
      statusCode: response.statusCode,
    };
  }

  /**
   * Convert CLI response to unified format
   */
  private normalizeCLIResponse<T>(
    response: CLIResponse<T>,
  ): UnifiedResponse<T> {
    return {
      success: response.success,
      data: response.data,
      error: response.error || response.stderr,
      source: "cli",
    };
  }

  /**
   * Get network status - available in both API and CLI
   */
  async getStatus(): Promise<UnifiedResponse<TailscaleCLIStatus | unknown>> {
    if (this.shouldUseAPI("getStatus")) {
      const response = await this.api.getTailnetInfo();
      return this.normalizeAPIResponse(response);
    }

    const response = await this.cli.getStatus();
    return this.normalizeCLIResponse(response);
  }

  /**
   * List devices - available in both API and CLI
   */
  async listDevices(): Promise<UnifiedResponse<TailscaleDevice[] | string[]>> {
    if (this.shouldUseAPI("listDevices")) {
      const response = await this.api.listDevices();
      return this.normalizeAPIResponse(response);
    }

    const response = await this.cli.listDevices();
    return this.normalizeCLIResponse(response);
  }

  /**
   * Get version - available in both API and CLI
   */
  async getVersion(): Promise<
    UnifiedResponse<string | { version: string; apiVersion: string }>
  > {
    if (this.shouldUseAPI("getVersion")) {
      const response = await this.api.getVersion();
      return this.normalizeAPIResponse(response);
    } else {
      if (!this.cliAvailable) {
        return {
          success: false,
          error: "Version information is not available",
          source: "cli",
        };
      }
      const response = await this.cli.version();
      return this.normalizeCLIResponse(response);
    }
  }

  /**
   * Ping peer - CLI only
   */
  async ping(target: string, count?: number): Promise<UnifiedResponse<string>> {
    if (!this.cliAvailable) {
      return {
        success: false,
        error: "Ping is only available via CLI",
        source: "cli",
      };
    }

    const response = await this.cli.ping(target, count);
    return this.normalizeCLIResponse(response);
  }

  /**
   * Connect to network - available in both API and CLI (CLI preferred)
   */
  async connect(
    options: {
      loginServer?: string;
      acceptRoutes?: boolean;
      acceptDns?: boolean;
      hostname?: string;
      advertiseRoutes?: string[];
      authKey?: string;
    } = {},
  ): Promise<UnifiedResponse<string | { message: string }>> {
    if (this.cliAvailable) {
      const response = await this.cli.connect(options);
      return this.normalizeCLIResponse(response);
    } else if (this.apiAvailable) {
      const response = await this.api.connect();
      return this.normalizeAPIResponse(response);
    } else {
      return {
        success: false,
        error:
          "Network connection is not available - neither CLI nor API is available",
        source: "cli",
      };
    }
  }

  /**
   * Disconnect from network - available in both API and CLI (CLI preferred)
   */
  async disconnect(): Promise<UnifiedResponse<string | { message: string }>> {
    if (this.cliAvailable) {
      const response = await this.cli.disconnect();
      return this.normalizeCLIResponse(response);
    } else if (this.apiAvailable) {
      const response = await this.api.disconnect();
      return this.normalizeAPIResponse(response);
    } else {
      return {
        success: false,
        error:
          "Network disconnection is not available - neither CLI nor API is available",
        source: "cli",
      };
    }
  }

  /**
   * Connect to network (alias for connect)
   * @deprecated Use connect() instead
   */
  async up(
    options: {
      loginServer?: string;
      acceptRoutes?: boolean;
      acceptDns?: boolean;
      hostname?: string;
      advertiseRoutes?: string[];
      authKey?: string;
    } = {},
  ): Promise<UnifiedResponse<string | { message: string }>> {
    return this.connect(options);
  }

  /**
   * Disconnect from network (alias for disconnect)
   * @deprecated Use disconnect() instead
   */
  async down(): Promise<UnifiedResponse<string | { message: string }>> {
    return this.disconnect();
  }

  /**
   * Get device information - API only
   */
  async getDevice(deviceId: string): Promise<UnifiedResponse<TailscaleDevice>> {
    if (!this.apiAvailable) {
      return {
        success: false,
        error: "Device details are only available via API",
        source: "api",
      };
    }

    const response = await this.api.getDevice(deviceId);
    return this.normalizeAPIResponse(response);
  }

  /**
   * Authorize device - API only
   */
  async authorizeDevice(deviceId: string): Promise<UnifiedResponse<void>> {
    if (!this.apiAvailable) {
      return {
        success: false,
        error: "Device authorization is only available via API",
        source: "api",
      };
    }

    const response = await this.api.authorizeDevice(deviceId);
    return this.normalizeAPIResponse(response);
  }

  /**
   * Deauthorize device - API only
   */
  async deauthorizeDevice(deviceId: string): Promise<UnifiedResponse<void>> {
    if (!this.apiAvailable) {
      return {
        success: false,
        error: "Device deauthorization is only available via API",
        source: "api",
      };
    }

    const response = await this.api.deauthorizeDevice(deviceId);
    return this.normalizeAPIResponse(response);
  }

  /**
   * Delete device - API only
   */
  async deleteDevice(deviceId: string): Promise<UnifiedResponse<void>> {
    if (!this.apiAvailable) {
      return {
        success: false,
        error: "Device deletion is only available via API",
        source: "api",
      };
    }

    const response = await this.api.deleteDevice(deviceId);
    return this.normalizeAPIResponse(response);
  }

  /**
   * Expire device key - API only
   */
  async expireDeviceKey(deviceId: string): Promise<UnifiedResponse<void>> {
    if (!this.apiAvailable) {
      return {
        success: false,
        error: "Device key expiration is only available via API",
        source: "api",
      };
    }

    const response = await this.api.expireDeviceKey(deviceId);
    return this.normalizeAPIResponse(response);
  }

  /**
   * Enable device routes - API only
   */
  async enableDeviceRoutes(
    deviceId: string,
    routes: string[],
  ): Promise<UnifiedResponse<void>> {
    if (!this.apiAvailable) {
      return {
        success: false,
        error: "Route management is only available via API",
        source: "api",
      };
    }

    const response = await this.api.enableDeviceRoutes(deviceId, routes);
    return this.normalizeAPIResponse(response);
  }

  /**
   * Disable device routes - API only
   */
  async disableDeviceRoutes(
    deviceId: string,
    routes: string[],
  ): Promise<UnifiedResponse<void>> {
    if (!this.apiAvailable) {
      return {
        success: false,
        error: "Route management is only available via API",
        source: "api",
      };
    }

    const response = await this.api.disableDeviceRoutes(deviceId, routes);
    return this.normalizeAPIResponse(response);
  }

  /**
   * Set exit node - CLI only
   */
  async setExitNode(nodeId?: string): Promise<UnifiedResponse<string>> {
    if (!this.cliAvailable) {
      return {
        success: false,
        error: "Exit node configuration is only available via CLI",
        source: "cli",
      };
    }

    const response = await this.cli.setExitNode(nodeId);
    return this.normalizeCLIResponse(response);
  }

  /**
   * Set shields up mode - CLI only
   */
  async setShieldsUp(enabled: boolean): Promise<UnifiedResponse<string>> {
    if (!this.cliAvailable) {
      return {
        success: false,
        error: "Shields up configuration is only available via CLI",
        source: "cli",
      };
    }

    const response = await this.cli.setShieldsUp(enabled);
    return this.normalizeCLIResponse(response);
  }

  /**
   * Get ACL configuration - API only
   */
  async getACL(): Promise<UnifiedResponse<string>> {
    if (!this.apiAvailable) {
      return {
        success: false,
        error: "ACL management is only available via API",
        source: "api",
      };
    }

    const response = await this.api.getACL();
    return this.normalizeAPIResponse(response);
  }

  /**
   * Update ACL configuration - API only
   */
  async updateACL(aclConfig: string): Promise<UnifiedResponse<void>> {
    if (!this.apiAvailable) {
      return {
        success: false,
        error: "ACL management is only available via API",
        source: "api",
      };
    }

    const response = await this.api.updateACL(aclConfig);
    return this.normalizeAPIResponse(response);
  }

  /**
   * Get DNS nameservers - API only
   */
  async getDNSNameservers(): Promise<UnifiedResponse<{ dns: string[] }>> {
    if (!this.apiAvailable) {
      return {
        success: false,
        error: "DNS management is only available via API",
        source: "api",
      };
    }

    const response = await this.api.getDNSNameservers();
    return this.normalizeAPIResponse(response);
  }

  /**
   * Set DNS nameservers - API only
   */
  async setDNSNameservers(
    nameservers: string[],
  ): Promise<UnifiedResponse<void>> {
    if (!this.apiAvailable) {
      return {
        success: false,
        error: "DNS management is only available via API",
        source: "api",
      };
    }

    const response = await this.api.setDNSNameservers(nameservers);
    return this.normalizeAPIResponse(response);
  }

  /**
   * Get available capabilities based on current configuration
   */
  getCapabilities(): {
    api: boolean;
    cli: boolean;
    features: {
      getStatus: boolean;
      listDevices: boolean;
      getVersion: boolean;
      ping: boolean;
      connect: boolean;
      disconnect: boolean;
      deviceManagement: boolean;
      aclManagement: boolean;
      dnsManagement: boolean;
      keyManagement: boolean;
      routeManagement: boolean;
      exitNodeManagement: boolean;
    };
  } {
    return {
      api: this.apiAvailable,
      cli: this.cliAvailable,
      features: {
        getStatus: this.apiAvailable || this.cliAvailable,
        listDevices: this.apiAvailable || this.cliAvailable,
        getVersion: this.cliAvailable,
        ping: this.cliAvailable,
        connect: this.cliAvailable,
        disconnect: this.cliAvailable,
        deviceManagement: this.apiAvailable,
        aclManagement: this.apiAvailable,
        dnsManagement: this.apiAvailable,
        keyManagement: this.apiAvailable,
        routeManagement: this.apiAvailable,
        exitNodeManagement: this.cliAvailable,
      },
    };
  }
}
