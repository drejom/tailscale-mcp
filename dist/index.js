import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { createTailscaleAPI } from './tailscale-api.js';
import { TailscaleCLI } from './tailscale-cli.js';
import { TailscaleTools } from './tools.js';
import { logger } from './logger.js';
class TailscaleMCPServer {
    server;
    tools;
    constructor() {
        this.server = new Server({
            name: 'tailscale-mcp-server',
            version: '1.0.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        // Initialize Tailscale integrations
        const api = createTailscaleAPI();
        const cli = new TailscaleCLI();
        this.tools = new TailscaleTools(api, cli);
        this.setupHandlers();
    }
    setupHandlers() {
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
                    },
                    {
                        name: 'manage_file_sharing',
                        description: 'Manage Tailscale file sharing settings',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                operation: {
                                    type: 'string',
                                    enum: ['get_status', 'enable', 'disable'],
                                    description: 'File sharing operation to perform'
                                },
                                deviceId: {
                                    type: 'string',
                                    description: 'Device ID (for device-specific operations)'
                                }
                            },
                            required: ['operation']
                        }
                    },
                    {
                        name: 'manage_exit_nodes',
                        description: 'Manage Tailscale exit nodes and routing',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                operation: {
                                    type: 'string',
                                    enum: ['list', 'set', 'clear', 'advertise', 'stop_advertising'],
                                    description: 'Exit node operation to perform'
                                },
                                deviceId: {
                                    type: 'string',
                                    description: 'Device ID for exit node operations'
                                },
                                routes: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    description: 'Routes to advertise (e.g., ["0.0.0.0/0", "::/0"] for full exit node)'
                                }
                            },
                            required: ['operation']
                        }
                    },
                    {
                        name: 'manage_network_lock',
                        description: 'Manage Tailscale network lock (key authority) for enhanced security',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                operation: {
                                    type: 'string',
                                    enum: ['status', 'enable', 'disable', 'add_key', 'remove_key', 'list_keys'],
                                    description: 'Network lock operation to perform'
                                },
                                publicKey: {
                                    type: 'string',
                                    description: 'Public key for add/remove operations'
                                },
                                keyId: {
                                    type: 'string',
                                    description: 'Key ID for remove operations'
                                }
                            },
                            required: ['operation']
                        }
                    },
                    {
                        name: 'manage_webhooks',
                        description: 'Manage Tailscale webhooks for event notifications',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                operation: {
                                    type: 'string',
                                    enum: ['list', 'create', 'delete', 'test'],
                                    description: 'Webhook operation to perform'
                                },
                                webhookId: {
                                    type: 'string',
                                    description: 'Webhook ID for delete/test operations'
                                },
                                config: {
                                    type: 'object',
                                    description: 'Webhook configuration for create operation',
                                    properties: {
                                        endpointUrl: { type: 'string' },
                                        secret: { type: 'string' },
                                        events: {
                                            type: 'array',
                                            items: { type: 'string' }
                                        },
                                        description: { type: 'string' }
                                    }
                                }
                            },
                            required: ['operation']
                        }
                    },
                    {
                        name: 'manage_policy_file',
                        description: 'Manage policy files and test ACL access rules',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                operation: {
                                    type: 'string',
                                    enum: ['get', 'update', 'test_access'],
                                    description: 'Policy file operation to perform'
                                },
                                policy: {
                                    type: 'string',
                                    description: 'Policy content (HuJSON format) for update operation'
                                },
                                testRequest: {
                                    type: 'object',
                                    description: 'Access test parameters for test_access operation',
                                    properties: {
                                        src: { type: 'string' },
                                        dst: { type: 'string' },
                                        proto: { type: 'string' }
                                    }
                                }
                            },
                            required: ['operation']
                        }
                    },
                    {
                        name: 'manage_device_tags',
                        description: 'Manage device tags for organization and ACL targeting',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                operation: {
                                    type: 'string',
                                    enum: ['get_tags', 'set_tags', 'add_tags', 'remove_tags'],
                                    description: 'Device tagging operation to perform'
                                },
                                deviceId: {
                                    type: 'string',
                                    description: 'Device ID for tagging operations'
                                },
                                tags: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    description: 'Array of tags to manage (e.g., ["tag:server", "tag:production"])'
                                }
                            },
                            required: ['operation', 'deviceId']
                        }
                    },
                    {
                        name: 'manage_ssh',
                        description: 'Manage SSH access settings and configurations',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                operation: {
                                    type: 'string',
                                    enum: ['get_ssh_settings', 'update_ssh_settings'],
                                    description: 'SSH management operation to perform'
                                },
                                sshSettings: {
                                    type: 'object',
                                    description: 'SSH configuration settings for update operation',
                                    properties: {
                                        enabled: { type: 'boolean' },
                                        checkPeriod: { type: 'string' }
                                    }
                                }
                            },
                            required: ['operation']
                        }
                    },
                    {
                        name: 'get_network_stats',
                        description: 'Get network and device statistics and monitoring data',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                operation: {
                                    type: 'string',
                                    enum: ['get_network_overview', 'get_device_stats'],
                                    description: 'Statistics operation to perform'
                                },
                                deviceId: {
                                    type: 'string',
                                    description: 'Device ID for device-specific statistics'
                                },
                                timeRange: {
                                    type: 'string',
                                    enum: ['1h', '24h', '7d', '30d'],
                                    description: 'Time range for statistics'
                                }
                            },
                            required: ['operation']
                        }
                    },
                    {
                        name: 'manage_users',
                        description: 'Manage tailnet users and their permissions',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                operation: {
                                    type: 'string',
                                    enum: ['list_users', 'get_user', 'update_user_role'],
                                    description: 'User management operation to perform'
                                },
                                userId: {
                                    type: 'string',
                                    description: 'User ID for specific user operations'
                                },
                                role: {
                                    type: 'string',
                                    enum: ['admin', 'user', 'auditor'],
                                    description: 'User role for role update operations'
                                }
                            },
                            required: ['operation']
                        }
                    },
                    {
                        name: 'manage_device_posture',
                        description: 'Manage device posture and compliance policies',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                operation: {
                                    type: 'string',
                                    enum: ['get_posture', 'set_posture_policy', 'check_compliance'],
                                    description: 'Device posture operation to perform'
                                },
                                deviceId: {
                                    type: 'string',
                                    description: 'Device ID for posture operations'
                                },
                                policy: {
                                    type: 'object',
                                    description: 'Posture policy configuration',
                                    properties: {
                                        requireUpdate: { type: 'boolean' },
                                        allowedOSVersions: {
                                            type: 'array',
                                            items: { type: 'string' }
                                        },
                                        requiredSoftware: {
                                            type: 'array',
                                            items: { type: 'string' }
                                        }
                                    }
                                }
                            },
                            required: ['operation']
                        }
                    },
                    {
                        name: 'manage_logging',
                        description: 'Manage logging configuration and audit capabilities',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                operation: {
                                    type: 'string',
                                    enum: ['get_log_config', 'set_log_level', 'get_audit_logs'],
                                    description: 'Logging operation to perform'
                                },
                                logLevel: {
                                    type: 'string',
                                    enum: ['debug', 'info', 'warn', 'error'],
                                    description: 'Log level for set_log_level operation'
                                },
                                component: {
                                    type: 'string',
                                    description: 'Specific component for targeted logging'
                                }
                            },
                            required: ['operation']
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
                let result;
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
                    case 'manage_file_sharing':
                        result = await this.tools.manageFileSharing(args || {});
                        break;
                    case 'manage_exit_nodes':
                        result = await this.tools.manageExitNodes(args || {});
                        break;
                    case 'manage_network_lock':
                        result = await this.tools.manageNetworkLock(args || {});
                        break;
                    case 'manage_webhooks':
                        result = await this.tools.manageWebhooks(args || {});
                        break;
                    case 'manage_policy_file':
                        result = await this.tools.managePolicyFile(args || {});
                        break;
                    case 'manage_device_tags':
                        result = await this.tools.manageDeviceTags(args || {});
                        break;
                    case 'manage_ssh':
                        result = await this.tools.manageSSH(args || {});
                        break;
                    case 'get_network_stats':
                        result = await this.tools.getNetworkStats(args || {});
                        break;
                    case 'manage_users':
                        result = await this.tools.manageUsers(args || {});
                        break;
                    case 'manage_device_posture':
                        result = await this.tools.manageDevicePosture(args || {});
                        break;
                    case 'manage_logging':
                        result = await this.tools.manageLogging(args || {});
                        break;
                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }
                return result;
            }
            catch (error) {
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
    async start() {
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
    }
    catch (error) {
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
//# sourceMappingURL=index.js.map