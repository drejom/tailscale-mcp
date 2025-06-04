"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tailscaleCLI = exports.TailscaleCLI = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const types_js_1 = require("./types.js");
const logger_js_1 = require("./logger.js");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class TailscaleCLI {
    constructor(cliPath = 'tailscale') {
        this.cliPath = cliPath;
    }
    /**
     * Execute a Tailscale CLI command
     */
    async executeCommand(args) {
        try {
            logger_js_1.logger.debug(`Executing: ${this.cliPath} ${args.join(' ')}`);
            const { stdout, stderr } = await execAsync(`${this.cliPath} ${args.join(' ')}`);
            if (stderr && stderr.trim()) {
                logger_js_1.logger.warn('CLI stderr:', stderr);
            }
            return {
                success: true,
                data: stdout.trim(),
                stderr: stderr?.trim()
            };
        }
        catch (error) {
            logger_js_1.logger.error('CLI command failed:', error);
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
    async getStatus() {
        const result = await this.executeCommand(['status', '--json']);
        if (!result.success) {
            return {
                success: false,
                error: result.error,
                stderr: result.stderr
            };
        }
        try {
            const statusData = JSON.parse(result.data);
            const validatedStatus = types_js_1.TailscaleCLIStatusSchema.parse(statusData);
            return {
                success: true,
                data: validatedStatus
            };
        }
        catch (error) {
            logger_js_1.logger.error('Failed to parse status JSON:', error);
            return {
                success: false,
                error: `Failed to parse status data: ${error.message}`
            };
        }
    }
    /**
     * Get list of peers
     */
    async listPeers() {
        const statusResult = await this.getStatus();
        if (!statusResult.success) {
            return {
                success: false,
                error: statusResult.error,
                stderr: statusResult.stderr
            };
        }
        const peers = statusResult.data.peers?.map(peer => peer.hostName) || [];
        return {
            success: true,
            data: peers
        };
    }
    /**
     * Connect to Tailscale network
     */
    async up(options = {}) {
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
    async down() {
        return await this.executeCommand(['down']);
    }
    /**
     * Ping a peer
     */
    async ping(target, count = 4) {
        return await this.executeCommand(['ping', target, '-c', count.toString()]);
    }
    /**
     * Get network check information
     */
    async netcheck() {
        return await this.executeCommand(['netcheck']);
    }
    /**
     * Get version information
     */
    async version() {
        return await this.executeCommand(['version']);
    }
    /**
     * Logout from Tailscale
     */
    async logout() {
        return await this.executeCommand(['logout']);
    }
    /**
     * Set exit node
     */
    async setExitNode(nodeId) {
        const args = ['set', '--exit-node'];
        if (nodeId) {
            args.push(nodeId);
        }
        else {
            args.push(''); // Clear exit node
        }
        return await this.executeCommand(args);
    }
    /**
     * Enable/disable shields up mode
     */
    async setShieldsUp(enabled) {
        return await this.executeCommand(['set', '--shields-up', enabled ? 'true' : 'false']);
    }
    /**
     * Check if CLI is available
     */
    async isAvailable() {
        try {
            const result = await this.executeCommand(['version']);
            return result.success;
        }
        catch {
            return false;
        }
    }
}
exports.TailscaleCLI = TailscaleCLI;
// Export default instance
exports.tailscaleCLI = new TailscaleCLI();
//# sourceMappingURL=tailscale-cli.js.map