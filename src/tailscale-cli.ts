import { exec } from 'child_process';
import { promisify } from 'util';
import { TailscaleCLIStatus, TailscaleCLIStatusSchema, CLIResponse } from './types.js';
import { logger } from './logger.js';

const execAsync = promisify(exec);

export class TailscaleCLI {
  private cliPath: string;

  constructor(cliPath: string = 'tailscale') {
    this.cliPath = cliPath;
  }

  /**
   * Execute a Tailscale CLI command
   */
  private async executeCommand(args: string[]): Promise<CLIResponse<string>> {
    try {
      logger.debug(`Executing: ${this.cliPath} ${args.join(' ')}`);
      
      const { stdout, stderr } = await execAsync(`${this.cliPath} ${args.join(' ')}`);
      
      if (stderr && stderr.trim()) {
        logger.warn('CLI stderr:', stderr);
      }

      return {
        success: true,
        data: stdout.trim(),
        stderr: stderr?.trim()
      };
    } catch (error: any) {
      logger.error('CLI command failed:', error);
      
      return {
        success: false,
        error: error.message,
        stderr: error.stderr
      };
    }
  }

  /**
   * Get Tailscale status
   */
  async getStatus(): Promise<CLIResponse<TailscaleCLIStatus>> {
    const result = await this.executeCommand(['status', '--json']);
    
    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Unknown error',
        stderr: result.stderr
      };
    }

    try {
      const statusData = JSON.parse(result.data!);
      const validatedStatus = TailscaleCLIStatusSchema.parse(statusData);
      
      return {
        success: true,
        data: validatedStatus
      };
    } catch (error: any) {
      logger.error('Failed to parse status JSON:', error);
      return {
        success: false,
        error: `Failed to parse status data: ${error.message}`
      };
    }
  }

  /**
   * Get list of peers
   */
  async listPeers(): Promise<CLIResponse<string[]>> {
    const statusResult = await this.getStatus();
    
    if (!statusResult.success) {
      return {
        success: false,
        error: statusResult.error || 'Unknown error',
        stderr: statusResult.stderr
      };
    }

    const peers = statusResult.data!.peers?.map(peer => peer.hostName) || [];
    
    return {
      success: true,
      data: peers
    };
  }

  /**
   * Connect to Tailscale network
   */
  async up(options: {
    loginServer?: string;
    acceptRoutes?: boolean;
    acceptDns?: boolean;
    hostname?: string;
    advertiseRoutes?: string[];
    authKey?: string;
  } = {}): Promise<CLIResponse<string>> {
    const args = ['up'];
    
    if (options.loginServer) {
      args.push('--login-server', options.loginServer);
    }
    
    if (options.acceptRoutes) {
      args.push('--accept-routes');
    }
    
    if (options.acceptDns) {
      args.push('--accept-dns');
    }
    
    if (options.hostname) {
      args.push('--hostname', options.hostname);
    }
    
    if (options.advertiseRoutes && options.advertiseRoutes.length > 0) {
      args.push('--advertise-routes', options.advertiseRoutes.join(','));
    }
    
    if (options.authKey) {
      args.push('--authkey', options.authKey);
    }

    return await this.executeCommand(args);
  }

  /**
   * Disconnect from Tailscale network
   */
  async down(): Promise<CLIResponse<string>> {
    return await this.executeCommand(['down']);
  }

  /**
   * Ping a peer
   */
  async ping(target: string, count: number = 4): Promise<CLIResponse<string>> {
    return await this.executeCommand(['ping', target, '-c', count.toString()]);
  }

  /**
   * Get network check information
   */
  async netcheck(): Promise<CLIResponse<string>> {
    return await this.executeCommand(['netcheck']);
  }

  /**
   * Get version information
   */
  async version(): Promise<CLIResponse<string>> {
    return await this.executeCommand(['version']);
  }

  /**
   * Logout from Tailscale
   */
  async logout(): Promise<CLIResponse<string>> {
    return await this.executeCommand(['logout']);
  }

  /**
   * Set exit node
   */
  async setExitNode(nodeId?: string): Promise<CLIResponse<string>> {
    const args = ['set', '--exit-node'];
    
    if (nodeId) {
      args.push(nodeId);
    } else {
      args.push('');  // Clear exit node
    }

    return await this.executeCommand(args);
  }

  /**
   * Enable/disable shields up mode
   */
  async setShieldsUp(enabled: boolean): Promise<CLIResponse<string>> {
    return await this.executeCommand(['set', '--shields-up', enabled ? 'true' : 'false']);
  }

  /**
   * Check if CLI is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const result = await this.executeCommand(['version']);
      return result.success;
    } catch {
      return false;
    }
  }
}

// Export default instance
export const tailscaleCLI = new TailscaleCLI();
