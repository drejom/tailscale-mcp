import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  TailscaleDevice,
  TailscaleDeviceSchema,
  TailscaleAPIResponse,
  TailscaleError,
  TailscaleConfig,
} from "../types";
import { logger } from "../logger";

export class TailscaleAPI {
  private client: AxiosInstance;
  private tailnet: string;

  constructor(config: TailscaleConfig = {}) {
    const apiKey = config.apiKey || process.env.TAILSCALE_API_KEY;
    const tailnet = config.tailnet || process.env.TAILSCALE_TAILNET || "-";

    if (!apiKey) {
      logger.warn(
        "No Tailscale API key provided. API operations will fail until TAILSCALE_API_KEY is set."
      );
    }

    this.tailnet = tailnet;
    this.client = axios.create({
      timeout: 30000,
      baseURL: "https://api.tailscale.com/api/v2",
      headers: {
        Authorization: apiKey ? `Bearer ${apiKey}` : "",
        "Content-Type": "application/json",
      },
    });

    // Add request/response interceptors for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(
          `API Request: ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
      },
      (error) => {
        logger.error("API Request Error:", {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          message: error.message,
        });
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        logger.debug(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        logger.error("API Response Error:", {
          url: error.config?.url,
          status: error.response?.status,
          data: error.response?.data,
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Handle API response and convert to standardized format
   */
  private handleResponse<T>(
    response: AxiosResponse<T>
  ): TailscaleAPIResponse<T> {
    return {
      success: true,
      data: response.data,
      statusCode: response.status,
    };
  }

  /**
   * Handle API errors and convert to standardized format
   */
  private handleError(error: any): TailscaleAPIResponse<never> {
    if (error.response) {
      // API returned an error response
      const status = error.response.status;
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        `HTTP ${status}`;

      return {
        success: false,
        error: message,
        statusCode: status,
      };
    } else if (error.request) {
      // Network error
      return {
        success: false,
        error: "Network error: Unable to connect to Tailscale API",
        statusCode: 0,
      };
    } else {
      return {
        success: false,
        error: error.message || "Unknown error occurred",
      };
    }
  }

  /**
   * List all devices in the tailnet
   */
  async listDevices(): Promise<TailscaleAPIResponse<TailscaleDevice[]>> {
    try {
      const response = await this.client.get(
        `/tailnet/${this.tailnet}/devices`
      );

      // Validate and parse devices
      const devices = response.data.devices
        ?.map((device: any) => {
          try {
            return TailscaleDeviceSchema.parse(device);
          } catch (parseError) {
            logger.warn("Failed to parse device:", {
              device,
              error: parseError,
            });
            return null;
          }
        })
        .filter(
          (d: TailscaleDevice | null): d is TailscaleDevice => d !== null
        );

      return this.handleResponse<TailscaleDevice[]>({
        data: devices,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config: response.config,
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get a specific device by ID
   */
  async getDevice(
    deviceId: string
  ): Promise<TailscaleAPIResponse<TailscaleDevice>> {
    try {
      const response = await this.client.get(`/device/${deviceId}`);
      const device = TailscaleDeviceSchema.parse(response.data);

      return this.handleResponse({ ...response, data: device });
    } catch (error) {
      if ((error as any).name === "ZodError") {
        return {
          success: false,
          error: "Invalid device data received from API",
        };
      }
      return this.handleError(error);
    }
  }

  /**
   * Authorize a device
   */
  async authorizeDevice(deviceId: string): Promise<TailscaleAPIResponse<void>> {
    try {
      const response = await this.client.post(
        `/device/${deviceId}/authorized`,
        {
          authorized: true,
        }
      );

      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Deauthorize a device
   */
  async deauthorizeDevice(
    deviceId: string
  ): Promise<TailscaleAPIResponse<void>> {
    try {
      const response = await this.client.post(
        `/device/${deviceId}/authorized`,
        {
          authorized: false,
        }
      );

      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Delete a device
   */
  async deleteDevice(deviceId: string): Promise<TailscaleAPIResponse<void>> {
    try {
      const response = await this.client.delete(`/device/${deviceId}`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Expire device key
   */
  async expireDeviceKey(deviceId: string): Promise<TailscaleAPIResponse<void>> {
    try {
      const response = await this.client.post(`/device/${deviceId}/expire`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Enable device routes
   */
  async enableDeviceRoutes(
    deviceId: string,
    routes: string[]
  ): Promise<TailscaleAPIResponse<void>> {
    try {
      const response = await this.client.post(`/device/${deviceId}/routes`, {
        routes: routes,
      });

      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Disable device routes
   */
  async disableDeviceRoutes(
    deviceId: string,
    routes: string[]
  ): Promise<TailscaleAPIResponse<void>> {
    try {
      const response = await this.client.delete(`/device/${deviceId}/routes`, {
        data: { routes: routes },
      });

      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get tailnet information
   */
  async getTailnetInfo(): Promise<TailscaleAPIResponse<any>> {
    try {
      const response = await this.client.get(`/tailnet/${this.tailnet}`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Test API connectivity
   */
  async testConnection(): Promise<TailscaleAPIResponse<{ status: string }>> {
    try {
      const response = await this.client.get(`/tailnet/${this.tailnet}`);
      return this.handleResponse({
        ...response,
        data: { status: "connected" },
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get ACL configuration
   */
  async getACL(): Promise<TailscaleAPIResponse<string>> {
    try {
      const response = await this.client.get(`/tailnet/${this.tailnet}/acl`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Update ACL configuration
   */
  async updateACL(aclConfig: string): Promise<TailscaleAPIResponse<void>> {
    try {
      const response = await this.client.post(
        `/tailnet/${this.tailnet}/acl`,
        aclConfig,
        {
          headers: {
            "Content-Type": "application/hujson",
          },
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Validate ACL configuration
   */
  async validateACL(aclConfig: string): Promise<TailscaleAPIResponse<any>> {
    try {
      const response = await this.client.post(
        `/tailnet/${this.tailnet}/acl/validate`,
        aclConfig,
        {
          headers: {
            "Content-Type": "application/hujson",
          },
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get DNS nameservers
   */
  async getDNSNameservers(): Promise<TailscaleAPIResponse<{ dns: string[] }>> {
    try {
      const response = await this.client.get(
        `/tailnet/${this.tailnet}/dns/nameservers`
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Set DNS nameservers
   */
  async setDNSNameservers(
    nameservers: string[]
  ): Promise<TailscaleAPIResponse<void>> {
    try {
      const response = await this.client.post(
        `/tailnet/${this.tailnet}/dns/nameservers`,
        {
          dns: nameservers,
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get DNS preferences
   */
  async getDNSPreferences(): Promise<
    TailscaleAPIResponse<{ magicDNS: boolean }>
  > {
    try {
      const response = await this.client.get(
        `/tailnet/${this.tailnet}/dns/preferences`
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Set DNS preferences
   */
  async setDNSPreferences(
    magicDNS: boolean
  ): Promise<TailscaleAPIResponse<void>> {
    try {
      const response = await this.client.post(
        `/tailnet/${this.tailnet}/dns/preferences`,
        {
          magicDNS,
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get DNS search paths
   */
  async getDNSSearchPaths(): Promise<
    TailscaleAPIResponse<{ searchPaths: string[] }>
  > {
    try {
      const response = await this.client.get(
        `/tailnet/${this.tailnet}/dns/searchpaths`
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Set DNS search paths
   */
  async setDNSSearchPaths(
    searchPaths: string[]
  ): Promise<TailscaleAPIResponse<void>> {
    try {
      const response = await this.client.post(
        `/tailnet/${this.tailnet}/dns/searchpaths`,
        {
          searchPaths,
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * List auth keys
   */
  async listAuthKeys(): Promise<TailscaleAPIResponse<{ keys: any[] }>> {
    try {
      const response = await this.client.get(`/tailnet/${this.tailnet}/keys`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Create auth key
   */
  async createAuthKey(keyConfig: any): Promise<TailscaleAPIResponse<any>> {
    try {
      const response = await this.client.post(
        `/tailnet/${this.tailnet}/keys`,
        keyConfig
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Delete auth key
   */
  async deleteAuthKey(keyId: string): Promise<TailscaleAPIResponse<void>> {
    try {
      const response = await this.client.delete(
        `/tailnet/${this.tailnet}/keys/${keyId}`
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get detailed tailnet information
   */
  async getDetailedTailnetInfo(): Promise<TailscaleAPIResponse<any>> {
    try {
      const response = await this.client.get(`/tailnet/${this.tailnet}`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get file sharing status for tailnet
   */
  async getFileSharingStatus(): Promise<
    TailscaleAPIResponse<{ fileSharing: boolean }>
  > {
    try {
      const response = await this.client.get(
        `/tailnet/${this.tailnet}/settings`
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Set file sharing status for tailnet
   */
  async setFileSharingStatus(
    enabled: boolean
  ): Promise<TailscaleAPIResponse<void>> {
    try {
      const response = await this.client.post(
        `/tailnet/${this.tailnet}/settings`,
        {
          fileSharing: enabled,
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Set device as exit node
   */
  async setDeviceExitNode(
    deviceId: string,
    routes: string[]
  ): Promise<TailscaleAPIResponse<void>> {
    try {
      const response = await this.client.post(`/device/${deviceId}/routes`, {
        routes: routes,
      });
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get device routes (including exit node status)
   */
  async getDeviceRoutes(deviceId: string): Promise<TailscaleAPIResponse<any>> {
    try {
      const response = await this.client.get(`/device/${deviceId}/routes`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get network lock status
   */
  async getNetworkLockStatus(): Promise<TailscaleAPIResponse<any>> {
    try {
      const response = await this.client.get(
        `/tailnet/${this.tailnet}/network-lock`
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Enable network lock
   */
  async enableNetworkLock(): Promise<TailscaleAPIResponse<any>> {
    try {
      const response = await this.client.post(
        `/tailnet/${this.tailnet}/network-lock`
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Disable network lock
   */
  async disableNetworkLock(): Promise<TailscaleAPIResponse<void>> {
    try {
      const response = await this.client.delete(
        `/tailnet/${this.tailnet}/network-lock`
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * List webhooks
   */
  async listWebhooks(): Promise<TailscaleAPIResponse<{ webhooks: any[] }>> {
    try {
      const response = await this.client.get(
        `/tailnet/${this.tailnet}/webhooks`
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Create webhook
   */
  async createWebhook(config: any): Promise<TailscaleAPIResponse<any>> {
    try {
      const response = await this.client.post(
        `/tailnet/${this.tailnet}/webhooks`,
        config
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Delete webhook
   */
  async deleteWebhook(webhookId: string): Promise<TailscaleAPIResponse<void>> {
    try {
      const response = await this.client.delete(
        `/tailnet/${this.tailnet}/webhooks/${webhookId}`
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Test webhook
   */
  async testWebhook(webhookId: string): Promise<TailscaleAPIResponse<any>> {
    try {
      const response = await this.client.post(
        `/tailnet/${this.tailnet}/webhooks/${webhookId}/test`
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get policy file (ACL in HuJSON format)
   */
  async getPolicyFile(): Promise<TailscaleAPIResponse<string>> {
    try {
      const response = await this.client.get(`/tailnet/${this.tailnet}/acl`, {
        headers: {
          Accept: "application/hujson",
        },
      });
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Test ACL access
   */
  async testACLAccess(
    src: string,
    dst: string,
    proto?: string
  ): Promise<TailscaleAPIResponse<any>> {
    try {
      const params = new URLSearchParams({
        src,
        dst,
        ...(proto && { proto }),
      });

      const response = await this.client.get(
        `/tailnet/${this.tailnet}/acl/test?${params}`
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get device tags
   */
  async getDeviceTags(
    deviceId: string
  ): Promise<TailscaleAPIResponse<{ tags: string[] }>> {
    try {
      const response = await this.client.get(`/device/${deviceId}`);
      const device = response.data;
      return this.handleResponse({
        ...response,
        data: { tags: device.tags || [] },
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Set device tags
   */
  async setDeviceTags(
    deviceId: string,
    tags: string[]
  ): Promise<TailscaleAPIResponse<void>> {
    try {
      const response = await this.client.post(`/device/${deviceId}/tags`, {
        tags: tags,
      });
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get SSH settings for tailnet
   */
  async getSSHSettings(): Promise<TailscaleAPIResponse<any>> {
    try {
      const response = await this.client.get(`/tailnet/${this.tailnet}/ssh`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Update SSH settings
   */
  async updateSSHSettings(settings: any): Promise<TailscaleAPIResponse<void>> {
    try {
      const response = await this.client.post(
        `/tailnet/${this.tailnet}/ssh`,
        settings
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get network statistics
   */
  async getNetworkStats(): Promise<TailscaleAPIResponse<any>> {
    try {
      const response = await this.client.get(`/tailnet/${this.tailnet}/stats`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get device statistics
   */
  async getDeviceStats(deviceId: string): Promise<TailscaleAPIResponse<any>> {
    try {
      const response = await this.client.get(`/device/${deviceId}/stats`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get user list
   */
  async getUsers(): Promise<TailscaleAPIResponse<{ users: any[] }>> {
    try {
      const response = await this.client.get(`/tailnet/${this.tailnet}/users`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get specific user
   */
  async getUser(userId: string): Promise<TailscaleAPIResponse<any>> {
    try {
      const response = await this.client.get(
        `/tailnet/${this.tailnet}/users/${userId}`
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Update user role
   */
  async updateUserRole(
    userId: string,
    role: string
  ): Promise<TailscaleAPIResponse<void>> {
    try {
      const response = await this.client.post(
        `/tailnet/${this.tailnet}/users/${userId}`,
        {
          role: role,
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get audit logs
   */
  async getAuditLogs(): Promise<TailscaleAPIResponse<{ logs: any[] }>> {
    try {
      const response = await this.client.get(`/tailnet/${this.tailnet}/logs`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get device posture information
   */
  async getDevicePosture(deviceId: string): Promise<TailscaleAPIResponse<any>> {
    try {
      const response = await this.client.get(`/device/${deviceId}/posture`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Set device posture policy
   */
  async setDevicePosturePolicy(
    policy: any
  ): Promise<TailscaleAPIResponse<void>> {
    try {
      const response = await this.client.post(
        `/tailnet/${this.tailnet}/posture-policy`,
        policy
      );
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

// Export factory function for creating API instances
export function createTailscaleAPI(config: TailscaleConfig = {}): TailscaleAPI {
  return new TailscaleAPI(config);
}
