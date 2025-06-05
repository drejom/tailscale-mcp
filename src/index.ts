import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { createTailscaleAPI } from './tailscale-api.js';
import { TailscaleCLI } from './tailscale-cli.js';
import { TailscaleTools } from './tools.js';
import { logger } from './logger.js';

class TailscaleMCPServer {
  private server: Server;
  private tools: TailscaleTools;

  constructor() {
    this.server = new Server(
      {
        name: 'tailscale-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize Tailscale integrations
    const api = createTailscaleAPI();
    const cli = new TailscaleCLI();
    this.tools = new TailscaleTools(api, cli);

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'list_devices',
            description: 'List all devices in the Tailscale network',
            inputSchema: {
              type: 'object',
              properties: {
                includeRoutes: {
                  type: 'boolean',
                  description: 'Include route information for each device',
                  default: false
                }
              }
            }
          },
          {
            name: 'get_network_status',
            description: 'Get current network status from Tailscale CLI',
            inputSchema: {
              type: 'object',
              properties: {
                format: {
                  type: 'string',
                  enum: ['json', 'summary'],
                  description: 'Output format (json or summary)',
                  default: 'json'
                }
              }
            }
          },
          {
            name: 'device_action',
            description: 'Perform actions on a specific device',
            inputSchema: {
              type: 'object',
              properties: {
                deviceId: {
                  type: 'string',
                  description: 'The ID of the device to act on'
                },
                action: {
                  type: 'string',
                  enum: ['authorize', 'deauthorize', 'delete', 'expire-key'],
                  description: 'The action to perform on the device'
                }
              },
              required: ['deviceId', 'action']
            }
          },
          {
            name: 'manage_routes',
            description: 'Enable or disable routes for a device',
            inputSchema: {
              type: 'object',
              properties: {
                deviceId: {
                  type: 'string',
                  description: 'The ID of the device'
                },
                routes: {
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  description: 'Array of CIDR routes to manage'
                },
                action: {
                  type: 'string',
                  enum: ['enable', 'disable'],
                  description: 'Whether to enable or disable the routes'
                }
              },
              required: ['deviceId', 'routes', 'action']
            }
          },
          {
            name: 'connect_network',
            description: 'Connect to the Tailscale network',
            inputSchema: {
              type: 'object',
              properties: {
                acceptRoutes: {
                  type: 'boolean',
                  description: 'Accept subnet routes from other devices',
                  default: false
                },
                acceptDNS: {
                  type: 'boolean',
                  description: 'Accept DNS configuration from the network',
                  default: false
                },
                hostname: {
                  type: 'string',
                  description: 'Set a custom hostname for this device'
                },
                advertiseRoutes: {
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  description: 'CIDR routes to advertise to other devices'
                },
                authKey: {
                  type: 'string',
                  description: 'Authentication key for unattended setup'
                },
                loginServer: {
                  type: 'string',
                  description: 'Custom coordination server URL'
                }
              }
            }
          },
          {
            name: 'disconnect_network',
            description: 'Disconnect from the Tailscale network',
            inputSchema: {
              type: 'object'
            }
          },
          {
            name: 'ping_peer',
            description: 'Ping a peer device',
            inputSchema: {
              type: 'object',
              properties: {
                target: {
                  type: 'string',
                  description: 'Hostname or IP address of the target device'
                },
                count: {
                  type: 'number',
                  description: 'Number of ping packets to send',
                  default: 4
                }
              },
              required: ['target']
            }
          },
          {
            name: 'get_version',
            description: 'Get Tailscale version information',
            inputSchema: {
              type: 'object'
            }
          },
          {
            name: 'manage_acl',
            description: 'Manage Tailscale Access Control Lists (ACLs)',
            inputSchema: {
              type: 'object',
              properties: {
                operation: {
                  type: 'string',
                  enum: ['get', 'update', 'validate'],
                  description: 'ACL operation to perform'
                },
                aclConfig: {
                  type: 'object',
                  description: 'ACL configuration (required for update/validate operations)',
                  properties: {
                    groups: {
                      type: 'object',
                      description: 'User groups definition'
                    },
                    tagOwners: {
                      type: 'object',
                      description: 'Tag ownership mapping'
                    },
                    acls: {
                      type: 'array',
                      description: 'Access control rules',
                      items: {
                        type: 'object',
                        properties: {
                          action: {
                            type: 'string',
                            enum: ['accept', 'drop']
                          },
                          src: {
                            type: 'array',
                            items: { type: 'string' }
                          },
                          dst: {
                            type: 'array',
                            items: { type: 'string' }
                          }
                        }
                      }
                    }
                  }
                }
              },
              required: ['operation']
            }
          },
          {
            name: 'manage_dns',
            description: 'Manage Tailscale DNS configuration',
            inputSchema: {
              type: 'object',
              properties: {
                operation: {
                  type: 'string',
                  enum: ['get_nameservers', 'set_nameservers', 'get_preferences', 'set_preferences', 'get_searchpaths', 'set_searchpaths'],
                  description: 'DNS operation to perform'
                },
                nameservers: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'DNS nameservers (for set_nameservers operation)'
                },
                magicDNS: {
                  type: 'boolean',
                  description: 'Enable/disable MagicDNS (for set_preferences operation)'
                },
                searchPaths: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'DNS search paths (for set_searchpaths operation)'
                }
              },
              required: ['operation']
            }
          },
          {
            name: 'manage_keys',
            description: 'Manage Tailscale authentication keys',
            inputSchema: {
              type: 'object',
              properties: {
                operation: {
                  type: 'string',
                  enum: ['list', 'create', 'delete'],
                  description: 'Key management operation'
                },
                keyId: {
                  type: 'string',
                  description: 'Authentication key ID (for delete operation)'
                },
                keyConfig: {
                  type: 'object',
                  description: 'Key configuration (for create operation)',
                  properties: {
                    capabilities: {
                      type: 'object',
                      properties: {
                        devices: {
                          type: 'object',
                          properties: {
                            create: {
                              type: 'object',
                              properties: {
                                reusable: { type: 'boolean' },
                                ephemeral: { type: 'boolean' },
                                preauthorized: { type: 'boolean' },
                                tags: {
                                  type: 'array',
                                  items: { type: 'string' }
                                }
                              }
                            }
                          }
                        }
                      }
                    },
                    expirySeconds: { type: 'number' },
                    description: { type: 'string' }
                  }
                }
              },
              required: ['operation']
            }
          },
          {
            name: 'get_tailnet_info',
            description: 'Get detailed Tailscale network information',
            inputSchema: {
              type: 'object',
              properties: {
                includeDetails: {
                  type: 'boolean',
                  description: 'Include advanced configuration details',
                  default: false
                }
              }
            }
          }
        ]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;
        logger.info(`Executing tool: ${name}`, args);

        let result: CallToolResult;

        switch (name) {
          case 'list_devices':
            result = await this.tools.listDevices(args || {});
            break;
          
          case 'get_network_status':
            result = await this.tools.getNetworkStatus(args || {});
            break;
          
          case 'device_action':
            result = await this.tools.deviceAction(args || {});
            break;
          
          case 'manage_routes':
            result = await this.tools.manageRoutes(args || {});
            break;
          
          case 'connect_network':
            result = await this.tools.connectNetwork(args || {});
            break;
          
          case 'disconnect_network':
            result = await this.tools.disconnectNetwork();
            break;
          
          case 'ping_peer':
            result = await this.tools.pingPeer(args || {});
            break;
          
          case 'get_version':
            result = await this.tools.getVersion();
            break;
          
          case 'manage_acl':
            result = await this.tools.manageACL(args || {});
            break;
          
          case 'manage_dns':
            result = await this.tools.manageDNS(args || {});
            break;
          
          case 'manage_keys':
            result = await this.tools.manageKeys(args || {});
            break;
          
          case 'get_tailnet_info':
            result = await this.tools.getTailnetInfo(args || {});
            break;
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }

        return result;
      } catch (error: any) {
        logger.error('Tool execution error:', error);
        return {
          content: [{
            type: 'text',
            text: `Error executing tool: ${error.message}`
          }],
          isError: true
        };
      }
    });
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    logger.info('Tailscale MCP Server started');
  }
}

// Start the server
async function main() {
  try {
    const server = new TailscaleMCPServer();
    await server.start();
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Start the server if this file is run directly
main().catch((error) => {
  logger.error('Unhandled error:', error);
  process.exit(1);
});

export { TailscaleMCPServer };
