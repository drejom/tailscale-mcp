"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TailscaleMCPServer = void 0;
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const tailscale_api_js_1 = require("./tailscale-api.js");
const tailscale_cli_js_1 = require("./tailscale-cli.js");
const tools_js_1 = require("./tools.js");
const logger_js_1 = require("./logger.js");
class TailscaleMCPServer {
    constructor() {
        this.server = new index_js_1.Server({
            name: 'tailscale-mcp-server',
            version: '1.0.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        // Initialize Tailscale integrations
        const api = (0, tailscale_api_js_1.createTailscaleAPI)();
        const cli = new tailscale_cli_js_1.TailscaleCLI();
        this.tools = new tools_js_1.TailscaleTools(api, cli);
        this.setupHandlers();
    }
    setupHandlers() {
        // List available tools
        this.server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
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
                    }
                ]
            };
        });
        // Handle tool calls
        this.server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
            try {
                const { name, arguments: args } = request.params;
                logger_js_1.logger.info(`Executing tool: ${name}`, args);
                switch (name) {
                    case 'list_devices':
                        return await this.tools.listDevices(args || {});
                    case 'get_network_status':
                        return await this.tools.getNetworkStatus(args || {});
                    case 'device_action':
                        return await this.tools.deviceAction(args || {});
                    case 'manage_routes':
                        return await this.tools.manageRoutes(args || {});
                    case 'connect_network':
                        return await this.tools.connectNetwork(args || {});
                    case 'disconnect_network':
                        return await this.tools.disconnectNetwork();
                    case 'ping_peer':
                        return await this.tools.pingPeer(args || {});
                    case 'get_version':
                        return await this.tools.getVersion();
                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }
            }
            catch (error) {
                logger_js_1.logger.error('Tool execution error:', error);
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
        const transport = new stdio_js_1.StdioServerTransport();
        await this.server.connect(transport);
        logger_js_1.logger.info('Tailscale MCP Server started');
    }
}
exports.TailscaleMCPServer = TailscaleMCPServer;
// Start the server
async function main() {
    try {
        const server = new TailscaleMCPServer();
        await server.start();
    }
    catch (error) {
        logger_js_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
}
// Handle graceful shutdown
process.on('SIGINT', () => {
    logger_js_1.logger.info('Received SIGINT, shutting down gracefully...');
    process.exit(0);
});
process.on('SIGTERM', () => {
    logger_js_1.logger.info('Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});
// Start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch((error) => {
        logger_js_1.logger.error('Unhandled error:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=index.js.map