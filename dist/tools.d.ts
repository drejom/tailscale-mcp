import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { TailscaleAPI } from './tailscale-api.js';
import { TailscaleCLI } from './tailscale-cli.js';
export declare class TailscaleTools {
    private api;
    private cli;
    constructor(api: TailscaleAPI, cli: TailscaleCLI);
    /**
     * List all devices in the tailnet
     */
    listDevices(args: any): Promise<CallToolResult>;
    /**
     * Get network status from CLI
     */
    getNetworkStatus(args: any): Promise<CallToolResult>;
    /**
     * Perform device actions
     */
    deviceAction(args: any): Promise<ToolResult>;
    /**
     * Manage device routes
     */
    manageRoutes(args: any): Promise<ToolResult>;
    /**
     * Connect to Tailscale network
     */
    connectNetwork(args: any): Promise<ToolResult>;
    /**
     * Disconnect from Tailscale network
     */
    disconnectNetwork(): Promise<ToolResult>;
    /**
     * Ping a peer
     */
    pingPeer(args: any): Promise<ToolResult>;
    /**
     * Get Tailscale version
     */
    getVersion(): Promise<ToolResult>;
}
//# sourceMappingURL=tools.d.ts.map