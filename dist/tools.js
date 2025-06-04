"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TailscaleTools = void 0;
const types_js_1 = require("./types.js");
const logger_js_1 = require("./logger.js");
class TailscaleTools {
    constructor(api, cli) {
        this.api = api;
        this.cli = cli;
    }
    /**
     * List all devices in the tailnet
     */
    async listDevices(args) {
        try {
            const request = types_js_1.ListDevicesRequestSchema.parse(args);
            logger_js_1.logger.info('Listing devices with options:', request);
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
            const devices = result.data;
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
        }
        catch (error) {
            logger_js_1.logger.error('Error listing devices:', error);
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
    async getNetworkStatus(args) {
        try {
            const request = types_js_1.NetworkStatusRequestSchema.parse(args);
            logger_js_1.logger.info('Getting network status with format:', request.format);
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
            const status = result.data;
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
            }
            else {
                // JSON format
                return {
                    content: [{
                            type: 'text',
                            text: JSON.stringify(status, null, 2)
                        }]
                };
            }
        }
        catch (error) {
            logger_js_1.logger.error('Error getting network status:', error);
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
    async deviceAction(args) {
        try {
            const request = types_js_1.DeviceActionRequestSchema.parse(args);
            logger_js_1.logger.info('Performing device action:', request);
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
        }
        catch (error) {
            logger_js_1.logger.error('Error performing device action:', error);
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
    async manageRoutes(args) {
        try {
            const request = types_js_1.RouteActionRequestSchema.parse(args);
            logger_js_1.logger.info('Managing routes:', request);
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
        }
        catch (error) {
            logger_js_1.logger.error('Error managing routes:', error);
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
    async connectNetwork(args) {
        try {
            const options = {
                acceptRoutes: args.acceptRoutes || false,
                acceptDns: args.acceptDNS || false,
                hostname: args.hostname,
                advertiseRoutes: args.advertiseRoutes || [],
                authKey: args.authKey,
                loginServer: args.loginServer
            };
            logger_js_1.logger.info('Connecting to Tailscale network with options:', options);
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
        }
        catch (error) {
            logger_js_1.logger.error('Error connecting to network:', error);
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
    async disconnectNetwork() {
        try {
            logger_js_1.logger.info('Disconnecting from Tailscale network');
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
        }
        catch (error) {
            logger_js_1.logger.error('Error disconnecting from network:', error);
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
    async pingPeer(args) {
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
            logger_js_1.logger.info(`Pinging ${target} (${count} packets)`);
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
        }
        catch (error) {
            logger_js_1.logger.error('Error pinging peer:', error);
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
    async getVersion() {
        try {
            logger_js_1.logger.info('Getting Tailscale version');
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
        }
        catch (error) {
            logger_js_1.logger.error('Error getting version:', error);
            return {
                content: [{
                        type: 'text',
                        text: `Error getting version: ${error.message}`
                    }],
                isError: true
            };
        }
    }
}
exports.TailscaleTools = TailscaleTools;
//# sourceMappingURL=tools.js.map