import { 
  ListDevicesRequestSchema,
  DeviceActionRequestSchema,
  NetworkStatusRequestSchema,
  RouteActionRequestSchema,
  ACLRequestSchema,
  DNSRequestSchema,
  KeyManagementRequestSchema,
  TailnetInfoRequestSchema,
  FileSharingRequestSchema,
  ExitNodeRequestSchema,
  NetworkLockRequestSchema,
  SubnetRouterRequestSchema,
  WebhookRequestSchema,
  PolicyFileRequestSchema
} from './types.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { TailscaleAPI } from './tailscale-api.js';
import { TailscaleCLI } from './tailscale-cli.js';
import { logger } from './logger.js';

export class TailscaleTools {
  constructor(
    private api: TailscaleAPI,
    private cli: TailscaleCLI
  ) {}

  /**
   * List all devices in the tailnet
   */
  async listDevices(args: any): Promise<CallToolResult> {
    try {
      const request = ListDevicesRequestSchema.parse(args);
      logger.info('Listing devices with options:', request);

      const result = await this.api.listDevices();
      
      if (!result.success) {
        return {
          content: [{
            type: 'text',
            text: `Failed to list devices: ${result.error}`
          }],
          isError: true
        };
      }

      const devices = result.data!;
      let output = `Found ${devices.length} devices:\n\n`;

      for (const device of devices) {
        output += `**${device.name}** (${device.hostname})\n`;
        output += `  - ID: ${device.id}\n`;
        output += `  - OS: ${device.os}\n`;
        output += `  - Addresses: ${device.addresses.join(', ')}\n`;
        output += `  - Authorized: ${device.authorized ? '✅' : '❌'}\n`;
        output += `  - Last seen: ${device.lastSeen}\n`;
        output += `  - Client version: ${device.clientVersion}\n`;
        
        if (request.includeRoutes && device.advertisedRoutes.length > 0) {
          output += `  - Advertised routes: ${device.advertisedRoutes.join(', ')}\n`;
          output += `  - Enabled routes: ${device.enabledRoutes.join(', ')}\n`;
        }
        
        output += '\n';
      }

      return {
        content: [{
          type: 'text',
          text: output
        }]
      };
    } catch (error: any) {
      logger.error('Error listing devices:', error);
      return {
        content: [{
          type: 'text',
          text: `Error listing devices: ${error.message}`
        }],
        isError: true
      };
    }
  }

  /**
   * Get network status from CLI
   */
  async getNetworkStatus(args: any): Promise<CallToolResult> {
    try {
      const request = NetworkStatusRequestSchema.parse(args);
      logger.info('Getting network status with format:', request.format);

      const result = await this.cli.getStatus();
      
      if (!result.success) {
        return {
          content: [{
            type: 'text',
            text: `Failed to get network status: ${result.error}`
          }],
          isError: true
        };
      }

      const status = result.data!;
      
      if (request.format === 'summary') {
        let output = `**Tailscale Network Status**\n\n`;
        output += `Version: ${status.version}\n`;
        output += `Backend state: ${status.backendState}\n`;
        output += `TUN interface: ${status.tun ? 'Active' : 'Inactive'}\n`;
        output += `Tailscale IPs: ${status.tailscaleIPs.join(', ')}\n\n`;
        
        output += `**This device:**\n`;
        output += `  - Hostname: ${status.self.hostName}\n`;
        output += `  - DNS name: ${status.self.dnsName}\n`;
        output += `  - OS: ${status.self.os}\n`;
        output += `  - IPs: ${status.self.tailscaleIPs.join(', ')}\n\n`;
        
        if (status.peers && status.peers.length > 0) {
          output += `**Connected peers (${status.peers.length}):**\n`;
          for (const peer of status.peers) {
            const onlineStatus = peer.online ? '🟢' : '🔴';
            output += `  ${onlineStatus} ${peer.hostName} (${peer.dnsName})\n`;
            output += `    - OS: ${peer.os}\n`;
            output += `    - IPs: ${peer.tailscaleIPs.join(', ')}\n`;
            if (peer.lastSeen) {
              output += `    - Last seen: ${peer.lastSeen}\n`;
            }
            if (peer.exitNode) {
              output += `    - Exit node: Yes\n`;
            }
          }
        }

        return {
          content: [{
            type: 'text',
            text: output
          }]
        };
      } else {
        // JSON format
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(status, null, 2)
          }]
        };
      }
    } catch (error: any) {
      logger.error('Error getting network status:', error);
      return {
        content: [{
          type: 'text',
          text: `Error getting network status: ${error.message}`
        }],
        isError: true
      };
    }
  }

  /**
   * Perform device actions
   */
  async deviceAction(args: any): Promise<CallToolResult> {
    try {
      const request = DeviceActionRequestSchema.parse(args);
      logger.info('Performing device action:', request);

      let result;
      let actionName;

      switch (request.action) {
        case 'authorize':
          result = await this.api.authorizeDevice(request.deviceId);
          actionName = 'authorize';
          break;
        case 'deauthorize':
          result = await this.api.deauthorizeDevice(request.deviceId);
          actionName = 'deauthorize';
          break;
        case 'delete':
          result = await this.api.deleteDevice(request.deviceId);
          actionName = 'delete';
          break;
        case 'expire-key':
          result = await this.api.expireDeviceKey(request.deviceId);
          actionName = 'expire key for';
          break;
        default:
          return {
            content: [{
              type: 'text',
              text: `Unknown action: ${request.action}`
            }],
            isError: true
          };
      }

      if (!result.success) {
        return {
          content: [{
            type: 'text',
            text: `Failed to ${actionName} device ${request.deviceId}: ${result.error}`
          }],
          isError: true
        };
      }

      return {
        content: [{
          type: 'text',
          text: `Successfully ${actionName}d device ${request.deviceId}`
        }]
      };
    } catch (error: any) {
      logger.error('Error performing device action:', error);
      return {
        content: [{
          type: 'text',
          text: `Error performing device action: ${error.message}`
        }],
        isError: true
      };
    }
  }

  /**
   * Manage device routes
   */
  async manageRoutes(args: any): Promise<CallToolResult> {
    try {
      const request = RouteActionRequestSchema.parse(args);
      logger.info('Managing routes:', request);

      let result;
      let actionName;

      switch (request.action) {
        case 'enable':
          result = await this.api.enableDeviceRoutes(request.deviceId, request.routes);
          actionName = 'enable';
          break;
        case 'disable':
          result = await this.api.disableDeviceRoutes(request.deviceId, request.routes);
          actionName = 'disable';
          break;
        default:
          return {
            content: [{
              type: 'text',
              text: `Unknown route action: ${request.action}`
            }],
            isError: true
          };
      }

      if (!result.success) {
        return {
          content: [{
            type: 'text',
            text: `Failed to ${actionName} routes for device ${request.deviceId}: ${result.error}`
          }],
          isError: true
        };
      }

      return {
        content: [{
          type: 'text',
          text: `Successfully ${actionName}d routes [${request.routes.join(', ')}] for device ${request.deviceId}`
        }]
      };
    } catch (error: any) {
      logger.error('Error managing routes:', error);
      return {
        content: [{
          type: 'text',
          text: `Error managing routes: ${error.message}`
        }],
        isError: true
      };
    }
  }

  /**
   * Connect to Tailscale network
   */
  async connectNetwork(args: any): Promise<CallToolResult> {
    try {
      const options = {
        acceptRoutes: args.acceptRoutes || false,
        acceptDns: args.acceptDNS || false,
        hostname: args.hostname,
        advertiseRoutes: args.advertiseRoutes || [],
        authKey: args.authKey,
        loginServer: args.loginServer
      };

      logger.info('Connecting to Tailscale network with options:', options);

      const result = await this.cli.up(options);
      
      if (!result.success) {
        return {
          content: [{
            type: 'text',
            text: `Failed to connect to Tailscale: ${result.error}\n${result.stderr || ''}`
          }],
          isError: true
        };
      }

      return {
        content: [{
          type: 'text',
          text: `Successfully connected to Tailscale network\n\n${result.data}`
        }]
      };
    } catch (error: any) {
      logger.error('Error connecting to network:', error);
      return {
        content: [{
          type: 'text',
          text: `Error connecting to network: ${error.message}`
        }],
        isError: true
      };
    }
  }

  /**
   * Disconnect from Tailscale network
   */
  async disconnectNetwork(): Promise<CallToolResult> {
    try {
      logger.info('Disconnecting from Tailscale network');

      const result = await this.cli.down();
      
      if (!result.success) {
        return {
          content: [{
            type: 'text',
            text: `Failed to disconnect from Tailscale: ${result.error}\n${result.stderr || ''}`
          }],
          isError: true
        };
      }

      return {
        content: [{
          type: 'text',
          text: `Successfully disconnected from Tailscale network\n\n${result.data}`
        }]
      };
    } catch (error: any) {
      logger.error('Error disconnecting from network:', error);
      return {
        content: [{
          type: 'text',
          text: `Error disconnecting from network: ${error.message}`
        }],
        isError: true
      };
    }
  }

  /**
   * Ping a peer
   */
  async pingPeer(args: any): Promise<CallToolResult> {
    try {
      const target = args.target;
      const count = args.count || 4;

      if (!target) {
        return {
          content: [{
            type: 'text',
            text: 'Target hostname or IP is required for ping'
          }],
          isError: true
        };
      }

      logger.info(`Pinging ${target} (${count} packets)`);

      const result = await this.cli.ping(target, count);
      
      if (!result.success) {
        return {
          content: [{
            type: 'text',
            text: `Failed to ping ${target}: ${result.error}\n${result.stderr || ''}`
          }],
          isError: true
        };
      }

      return {
        content: [{
          type: 'text',
          text: `Ping results for ${target}:\n\n${result.data}`
        }]
      };
    } catch (error: any) {
      logger.error('Error pinging peer:', error);
      return {
        content: [{
          type: 'text',
          text: `Error pinging peer: ${error.message}`
        }],
        isError: true
      };
    }
  }

  /**
   * Get Tailscale version
   */
  async getVersion(): Promise<CallToolResult> {
    try {
      logger.info('Getting Tailscale version');

      const result = await this.cli.version();
      
      if (!result.success) {
        return {
          content: [{
            type: 'text',
            text: `Failed to get version: ${result.error}`
          }],
          isError: true
        };
      }

      return {
        content: [{
          type: 'text',
          text: `Tailscale version information:\n\n${result.data}`
        }]
      };
    } catch (error: any) {
      logger.error('Error getting version:', error);
      return {
        content: [{
          type: 'text',
          text: `Error getting version: ${error.message}`
        }],
        isError: true
      };
    }
  }

  /**
   * Manage ACL configuration
   */
  async manageACL(args: any): Promise<CallToolResult> {
    try {
      const validatedArgs = ACLRequestSchema.parse(args);
      logger.info('Managing ACL configuration:', validatedArgs);

      switch (validatedArgs.operation) {
        case 'get': {
          const result = await this.api.getACL();
          if (!result.success) {
            return {
              content: [{ type: 'text', text: `Failed to get ACL: ${result.error}` }],
              isError: true
            };
          }
          return {
            content: [{ type: 'text', text: `Current ACL configuration:\n\n${typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)}` }]
          };
        }

        case 'update': {
          if (!validatedArgs.aclConfig) {
            return {
              content: [{ type: 'text', text: 'ACL configuration is required for update operation' }],
              isError: true
            };
          }
          
          const aclString = JSON.stringify(validatedArgs.aclConfig, null, 2);
          const result = await this.api.updateACL(aclString);
          
          if (!result.success) {
            return {
              content: [{ type: 'text', text: `Failed to update ACL: ${result.error}` }],
              isError: true
            };
          }
          
          return {
            content: [{ type: 'text', text: 'ACL configuration updated successfully' }]
          };
        }

        case 'validate': {
          if (!validatedArgs.aclConfig) {
            return {
              content: [{ type: 'text', text: 'ACL configuration is required for validation' }],
              isError: true
            };
          }
          
          const aclString = JSON.stringify(validatedArgs.aclConfig, null, 2);
          const result = await this.api.validateACL(aclString);
          
          if (!result.success) {
            return {
              content: [{ type: 'text', text: `ACL validation failed: ${result.error}` }],
              isError: true
            };
          }
          
          return {
            content: [{ type: 'text', text: 'ACL configuration is valid' }]
          };
        }

        default:
          return {
            content: [{ type: 'text', text: 'Invalid ACL operation. Use: get, update, or validate' }],
            isError: true
          };
      }
    } catch (error: any) {
      logger.error('Error managing ACL:', error);
      return {
        content: [{ type: 'text', text: `Error managing ACL: ${error.message}` }],
        isError: true
      };
    }
  }

  /**
   * Manage DNS configuration
   */
  async manageDNS(args: any): Promise<CallToolResult> {
    try {
      const validatedArgs = DNSRequestSchema.parse(args);
      logger.info('Managing DNS configuration:', validatedArgs);

      switch (validatedArgs.operation) {
        case 'get_nameservers': {
          const result = await this.api.getDNSNameservers();
          if (!result.success) {
            return {
              content: [{ type: 'text', text: `Failed to get DNS nameservers: ${result.error}` }],
              isError: true
            };
          }
          
          const nameservers = result.data?.dns || [];
          return {
            content: [{ 
              type: 'text', 
              text: `DNS Nameservers:\n${nameservers.length > 0 ? nameservers.map(ns => `  - ${ns}`).join('\n') : '  No custom nameservers configured'}` 
            }]
          };
        }

        case 'set_nameservers': {
          if (!validatedArgs.nameservers) {
            return {
              content: [{ type: 'text', text: 'Nameservers array is required for set_nameservers operation' }],
              isError: true
            };
          }
          
          const result = await this.api.setDNSNameservers(validatedArgs.nameservers);
          if (!result.success) {
            return {
              content: [{ type: 'text', text: `Failed to set DNS nameservers: ${result.error}` }],
              isError: true
            };
          }
          
          return {
            content: [{ type: 'text', text: `DNS nameservers updated to: ${validatedArgs.nameservers.join(', ')}` }]
          };
        }

        case 'get_preferences': {
          const result = await this.api.getDNSPreferences();
          if (!result.success) {
            return {
              content: [{ type: 'text', text: `Failed to get DNS preferences: ${result.error}` }],
              isError: true
            };
          }
          
          return {
            content: [{ 
              type: 'text', 
              text: `DNS Preferences:\n  MagicDNS: ${result.data?.magicDNS ? 'Enabled' : 'Disabled'}` 
            }]
          };
        }

        case 'set_preferences': {
          if (validatedArgs.magicDNS === undefined) {
            return {
              content: [{ type: 'text', text: 'magicDNS boolean is required for set_preferences operation' }],
              isError: true
            };
          }
          
          const result = await this.api.setDNSPreferences(validatedArgs.magicDNS);
          if (!result.success) {
            return {
              content: [{ type: 'text', text: `Failed to set DNS preferences: ${result.error}` }],
              isError: true
            };
          }
          
          return {
            content: [{ type: 'text', text: `MagicDNS ${validatedArgs.magicDNS ? 'enabled' : 'disabled'}` }]
          };
        }

        case 'get_searchpaths': {
          const result = await this.api.getDNSSearchPaths();
          if (!result.success) {
            return {
              content: [{ type: 'text', text: `Failed to get DNS search paths: ${result.error}` }],
              isError: true
            };
          }
          
          const searchPaths = result.data?.searchPaths || [];
          return {
            content: [{ 
              type: 'text', 
              text: `DNS Search Paths:\n${searchPaths.length > 0 ? searchPaths.map(path => `  - ${path}`).join('\n') : '  No search paths configured'}` 
            }]
          };
        }

        case 'set_searchpaths': {
          if (!validatedArgs.searchPaths) {
            return {
              content: [{ type: 'text', text: 'searchPaths array is required for set_searchpaths operation' }],
              isError: true
            };
          }
          
          const result = await this.api.setDNSSearchPaths(validatedArgs.searchPaths);
          if (!result.success) {
            return {
              content: [{ type: 'text', text: `Failed to set DNS search paths: ${result.error}` }],
              isError: true
            };
          }
          
          return {
            content: [{ type: 'text', text: `DNS search paths updated to: ${validatedArgs.searchPaths.join(', ')}` }]
          };
        }

        default:
          return {
            content: [{ type: 'text', text: 'Invalid DNS operation. Use: get_nameservers, set_nameservers, get_preferences, set_preferences, get_searchpaths, set_searchpaths' }],
            isError: true
          };
      }
    } catch (error: any) {
      logger.error('Error managing DNS:', error);
      return {
        content: [{ type: 'text', text: `Error managing DNS: ${error.message}` }],
        isError: true
      };
    }
  }

  /**
   * Manage authentication keys
   */
  async manageKeys(args: any): Promise<CallToolResult> {
    try {
      const validatedArgs = KeyManagementRequestSchema.parse(args);
      logger.info('Managing authentication keys:', validatedArgs);

      switch (validatedArgs.operation) {
        case 'list': {
          const result = await this.api.listAuthKeys();
          if (!result.success) {
            return {
              content: [{ type: 'text', text: `Failed to list auth keys: ${result.error}` }],
              isError: true
            };
          }
          
          const keys = result.data?.keys || [];
          if (keys.length === 0) {
            return {
              content: [{ type: 'text', text: 'No authentication keys found' }]
            };
          }
          
          const keyList = keys.map((key: any, index: number) => {
            return `**Key ${index + 1}**
  - ID: ${key.id}
  - Description: ${key.description || 'No description'}
  - Created: ${key.created}
  - Expires: ${key.expires}
  - Revoked: ${key.revoked ? 'Yes' : 'No'}
  - Reusable: ${key.capabilities?.devices?.create?.reusable ? 'Yes' : 'No'}
  - Preauthorized: ${key.capabilities?.devices?.create?.preauthorized ? 'Yes' : 'No'}`;
          }).join('\n\n');
          
          return {
            content: [{ type: 'text', text: `Found ${keys.length} authentication keys:\n\n${keyList}` }]
          };
        }

        case 'create': {
          if (!validatedArgs.keyConfig) {
            return {
              content: [{ type: 'text', text: 'Key configuration is required for create operation' }],
              isError: true
            };
          }
          
          const result = await this.api.createAuthKey(validatedArgs.keyConfig);
          if (!result.success) {
            return {
              content: [{ type: 'text', text: `Failed to create auth key: ${result.error}` }],
              isError: true
            };
          }
          
          return {
            content: [{ 
              type: 'text', 
              text: `Authentication key created successfully:
  - ID: ${result.data?.id}
  - Key: ${result.data?.key}
  - Description: ${result.data?.description || 'No description'}`
            }]
          };
        }

        case 'delete': {
          if (!validatedArgs.keyId) {
            return {
              content: [{ type: 'text', text: 'Key ID is required for delete operation' }],
              isError: true
            };
          }
          
          const result = await this.api.deleteAuthKey(validatedArgs.keyId);
          if (!result.success) {
            return {
              content: [{ type: 'text', text: `Failed to delete auth key: ${result.error}` }],
              isError: true
            };
          }
          
          return {
            content: [{ type: 'text', text: `Authentication key ${validatedArgs.keyId} deleted successfully` }]
          };
        }

        default:
          return {
            content: [{ type: 'text', text: 'Invalid key operation. Use: list, create, or delete' }],
            isError: true
          };
      }
    } catch (error: any) {
      logger.error('Error managing keys:', error);
      return {
        content: [{ type: 'text', text: `Error managing keys: ${error.message}` }],
        isError: true
      };
    }
  }

  /**
   * Get detailed tailnet information
   */
  async getTailnetInfo(args: any): Promise<CallToolResult> {
    try {
      const validatedArgs = TailnetInfoRequestSchema.parse(args);
      logger.info('Getting tailnet information:', validatedArgs);

      const result = await this.api.getDetailedTailnetInfo();
      if (!result.success) {
        return {
          content: [{ type: 'text', text: `Failed to get tailnet info: ${result.error}` }],
          isError: true
        };
      }

      const info = result.data;
      const formattedInfo = `**Tailnet Information**

**Basic Details:**
  - Name: ${info?.name || 'Unknown'}
  - Organization: ${info?.organization || 'Unknown'}
  - Created: ${info?.created || 'Unknown'}

**Settings:**
  - DNS: ${info?.dns ? 'Configured' : 'Not configured'}
  - File sharing: ${info?.fileSharing ? 'Enabled' : 'Disabled'}
  - Service collection: ${info?.serviceCollection ? 'Enabled' : 'Disabled'}

**Security:**
  - Network lock: ${info?.networkLockEnabled ? 'Enabled' : 'Disabled'}
  - OIDC identity provider: ${info?.oidcIdentityProviderURL || 'Not configured'}

${validatedArgs.includeDetails ? `
**Advanced Details:**
  - Key expiry disabled: ${info?.keyExpiryDisabled ? 'Yes' : 'No'}
  - Machine authorization timeout: ${info?.machineAuthorizationTimeout || 'Default'}
  - Device approval required: ${info?.deviceApprovalRequired ? 'Yes' : 'No'}` : ''}`;

      return {
        content: [{ type: 'text', text: formattedInfo }]
      };
    } catch (error: any) {
      logger.error('Error getting tailnet info:', error);
      return {
        content: [{ type: 'text', text: `Error getting tailnet info: ${error.message}` }],
        isError: true
      };
    }
  }

  /**
   * Manage file sharing settings
   */
  async manageFileSharing(args: any): Promise<CallToolResult> {
    try {
      const validatedArgs = FileSharingRequestSchema.parse(args);
      logger.info('Managing file sharing:', validatedArgs);

      switch (validatedArgs.operation) {
        case 'get_status': {
          const result = await this.api.getFileSharingStatus();
          if (!result.success) {
            return {
              content: [{ type: 'text', text: `Failed to get file sharing status: ${result.error}` }],
              isError: true
            };
          }
          
          return {
            content: [{ 
              type: 'text', 
              text: `File Sharing Status: ${result.data?.fileSharing ? 'Enabled' : 'Disabled'}` 
            }]
          };
        }

        case 'enable': {
          const result = await this.api.setFileSharingStatus(true);
          if (!result.success) {
            return {
              content: [{ type: 'text', text: `Failed to enable file sharing: ${result.error}` }],
              isError: true
            };
          }
          
          return {
            content: [{ type: 'text', text: 'File sharing enabled successfully' }]
          };
        }

        case 'disable': {
          const result = await this.api.setFileSharingStatus(false);
          if (!result.success) {
            return {
              content: [{ type: 'text', text: `Failed to disable file sharing: ${result.error}` }],
              isError: true
            };
          }
          
          return {
            content: [{ type: 'text', text: 'File sharing disabled successfully' }]
          };
        }

        default:
          return {
            content: [{ type: 'text', text: 'Invalid file sharing operation. Use: get_status, enable, or disable' }],
            isError: true
          };
      }
    } catch (error: any) {
      logger.error('Error managing file sharing:', error);
      return {
        content: [{ type: 'text', text: `Error managing file sharing: ${error.message}` }],
        isError: true
      };
    }
  }

  /**
   * Manage exit nodes
   */
  async manageExitNodes(args: any): Promise<CallToolResult> {
    try {
      const validatedArgs = ExitNodeRequestSchema.parse(args);
      logger.info('Managing exit nodes:', validatedArgs);

      switch (validatedArgs.operation) {
        case 'list': {
          const devicesResult = await this.api.listDevices();
          if (!devicesResult.success) {
            return {
              content: [{ type: 'text', text: `Failed to list devices: ${devicesResult.error}` }],
              isError: true
            };
          }

          const devices = devicesResult.data || [];
          const exitNodes = devices.filter((device: any) => 
            device.advertisedRoutes?.includes('0.0.0.0/0') || 
            device.advertisedRoutes?.includes('::/0')
          );

          if (exitNodes.length === 0) {
            return {
              content: [{ type: 'text', text: 'No exit nodes found in the network' }]
            };
          }

          const exitNodeList = exitNodes.map((node: any) => {
            return `**${node.name}** (${node.hostname})
  - ID: ${node.id}
  - OS: ${node.os}
  - Routes: ${node.advertisedRoutes?.join(', ') || 'None'}
  - Status: ${node.authorized ? 'Authorized' : 'Unauthorized'}`;
          }).join('\n\n');

          return {
            content: [{ type: 'text', text: `Exit Nodes (${exitNodes.length}):\n\n${exitNodeList}` }]
          };
        }

        case 'advertise': {
          if (!validatedArgs.deviceId || !validatedArgs.routes) {
            return {
              content: [{ type: 'text', text: 'Device ID and routes are required for advertise operation' }],
              isError: true
            };
          }

          const result = await this.api.setDeviceExitNode(validatedArgs.deviceId, validatedArgs.routes);
          if (!result.success) {
            return {
              content: [{ type: 'text', text: `Failed to advertise exit node: ${result.error}` }],
              isError: true
            };
          }

          return {
            content: [{ type: 'text', text: `Device ${validatedArgs.deviceId} is now advertising routes: ${validatedArgs.routes.join(', ')}` }]
          };
        }

        case 'set': {
          const cliResult = await this.cli.setExitNode(validatedArgs.deviceId);
          if (!cliResult.success) {
            return {
              content: [{ type: 'text', text: `Failed to set exit node: ${cliResult.error}` }],
              isError: true
            };
          }

          return {
            content: [{ type: 'text', text: `Exit node set to: ${validatedArgs.deviceId || 'auto'}` }]
          };
        }

        case 'clear': {
          const cliResult = await this.cli.setExitNode();
          if (!cliResult.success) {
            return {
              content: [{ type: 'text', text: `Failed to clear exit node: ${cliResult.error}` }],
              isError: true
            };
          }

          return {
            content: [{ type: 'text', text: 'Exit node cleared successfully' }]
          };
        }

        default:
          return {
            content: [{ type: 'text', text: 'Invalid exit node operation. Use: list, set, clear, advertise' }],
            isError: true
          };
      }
    } catch (error: any) {
      logger.error('Error managing exit nodes:', error);
      return {
        content: [{ type: 'text', text: `Error managing exit nodes: ${error.message}` }],
        isError: true
      };
    }
  }

  /**
   * Manage network lock (key authority)
   */
  async manageNetworkLock(args: any): Promise<CallToolResult> {
    try {
      const validatedArgs = NetworkLockRequestSchema.parse(args);
      logger.info('Managing network lock:', validatedArgs);

      switch (validatedArgs.operation) {
        case 'status': {
          const result = await this.api.getNetworkLockStatus();
          if (!result.success) {
            return {
              content: [{ type: 'text', text: `Failed to get network lock status: ${result.error}` }],
              isError: true
            };
          }

          const status = result.data;
          return {
            content: [{ 
              type: 'text', 
              text: `Network Lock Status:
  - Enabled: ${status?.enabled ? 'Yes' : 'No'}
  - Node Key: ${status?.nodeKey || 'Not available'}
  - Trusted Keys: ${status?.trustedKeys?.length || 0}`
            }]
          };
        }

        case 'enable': {
          const result = await this.api.enableNetworkLock();
          if (!result.success) {
            return {
              content: [{ type: 'text', text: `Failed to enable network lock: ${result.error}` }],
              isError: true
            };
          }

          return {
            content: [{ 
              type: 'text', 
              text: `Network lock enabled successfully. Key: ${result.data?.key || 'Generated'}`
            }]
          };
        }

        case 'disable': {
          const result = await this.api.disableNetworkLock();
          if (!result.success) {
            return {
              content: [{ type: 'text', text: `Failed to disable network lock: ${result.error}` }],
              isError: true
            };
          }

          return {
            content: [{ type: 'text', text: 'Network lock disabled successfully' }]
          };
        }

        default:
          return {
            content: [{ type: 'text', text: 'Invalid network lock operation. Use: status, enable, or disable' }],
            isError: true
          };
      }
    } catch (error: any) {
      logger.error('Error managing network lock:', error);
      return {
        content: [{ type: 'text', text: `Error managing network lock: ${error.message}` }],
        isError: true
      };
    }
  }

  /**
   * Manage webhooks
   */
  async manageWebhooks(args: any): Promise<CallToolResult> {
    try {
      const validatedArgs = WebhookRequestSchema.parse(args);
      logger.info('Managing webhooks:', validatedArgs);

      switch (validatedArgs.operation) {
        case 'list': {
          const result = await this.api.listWebhooks();
          if (!result.success) {
            return {
              content: [{ type: 'text', text: `Failed to list webhooks: ${result.error}` }],
              isError: true
            };
          }

          const webhooks = result.data?.webhooks || [];
          if (webhooks.length === 0) {
            return {
              content: [{ type: 'text', text: 'No webhooks configured' }]
            };
          }

          const webhookList = webhooks.map((webhook: any, index: number) => {
            return `**Webhook ${index + 1}**
  - ID: ${webhook.id}
  - URL: ${webhook.endpointUrl}
  - Events: ${webhook.events?.join(', ') || 'None'}
  - Description: ${webhook.description || 'No description'}
  - Created: ${webhook.created}`;
          }).join('\n\n');

          return {
            content: [{ type: 'text', text: `Found ${webhooks.length} webhooks:\n\n${webhookList}` }]
          };
        }

        case 'create': {
          if (!validatedArgs.config) {
            return {
              content: [{ type: 'text', text: 'Webhook configuration is required for create operation' }],
              isError: true
            };
          }

          const result = await this.api.createWebhook(validatedArgs.config);
          if (!result.success) {
            return {
              content: [{ type: 'text', text: `Failed to create webhook: ${result.error}` }],
              isError: true
            };
          }

          return {
            content: [{ 
              type: 'text', 
              text: `Webhook created successfully:
  - ID: ${result.data?.id}
  - URL: ${result.data?.endpointUrl}
  - Events: ${result.data?.events?.join(', ')}`
            }]
          };
        }

        case 'delete': {
          if (!validatedArgs.webhookId) {
            return {
              content: [{ type: 'text', text: 'Webhook ID is required for delete operation' }],
              isError: true
            };
          }

          const result = await this.api.deleteWebhook(validatedArgs.webhookId);
          if (!result.success) {
            return {
              content: [{ type: 'text', text: `Failed to delete webhook: ${result.error}` }],
              isError: true
            };
          }

          return {
            content: [{ type: 'text', text: `Webhook ${validatedArgs.webhookId} deleted successfully` }]
          };
        }

        case 'test': {
          if (!validatedArgs.webhookId) {
            return {
              content: [{ type: 'text', text: 'Webhook ID is required for test operation' }],
              isError: true
            };
          }

          const result = await this.api.testWebhook(validatedArgs.webhookId);
          if (!result.success) {
            return {
              content: [{ type: 'text', text: `Failed to test webhook: ${result.error}` }],
              isError: true
            };
          }

          return {
            content: [{ type: 'text', text: `Webhook test successful. Response: ${JSON.stringify(result.data, null, 2)}` }]
          };
        }

        default:
          return {
            content: [{ type: 'text', text: 'Invalid webhook operation. Use: list, create, delete, or test' }],
            isError: true
          };
      }
    } catch (error: any) {
      logger.error('Error managing webhooks:', error);
      return {
        content: [{ type: 'text', text: `Error managing webhooks: ${error.message}` }],
        isError: true
      };
    }
  }

  /**
   * Manage policy files and ACL testing
   */
  async managePolicyFile(args: any): Promise<CallToolResult> {
    try {
      const validatedArgs = PolicyFileRequestSchema.parse(args);
      logger.info('Managing policy file:', validatedArgs);

      switch (validatedArgs.operation) {
        case 'get': {
          const result = await this.api.getPolicyFile();
          if (!result.success) {
            return {
              content: [{ type: 'text', text: `Failed to get policy file: ${result.error}` }],
              isError: true
            };
          }

          return {
            content: [{ type: 'text', text: `Policy File (HuJSON format):\n\n${result.data}` }]
          };
        }

        case 'test_access': {
          if (!validatedArgs.testRequest) {
            return {
              content: [{ type: 'text', text: 'Test request parameters are required for test_access operation' }],
              isError: true
            };
          }

          const { src, dst, proto } = validatedArgs.testRequest;
          const result = await this.api.testACLAccess(src, dst, proto);
          
          if (!result.success) {
            return {
              content: [{ type: 'text', text: `Failed to test ACL access: ${result.error}` }],
              isError: true
            };
          }

          const testResult = result.data;
          return {
            content: [{ 
              type: 'text', 
              text: `ACL Access Test Result:
  - Source: ${src}
  - Destination: ${dst}
  - Protocol: ${proto || 'any'}
  - Result: ${testResult?.allowed ? 'ALLOWED' : 'DENIED'}
  - Rule: ${testResult?.rule || 'No matching rule'}
  - Match: ${testResult?.match || 'N/A'}`
            }]
          };
        }

        default:
          return {
            content: [{ type: 'text', text: 'Invalid policy operation. Use: get or test_access' }],
            isError: true
          };
      }
    } catch (error: any) {
      logger.error('Error managing policy file:', error);
      return {
        content: [{ type: 'text', text: `Error managing policy file: ${error.message}` }],
        isError: true
      };
    }
  }
}
