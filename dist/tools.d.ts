import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
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
    deviceAction(args: any): Promise<CallToolResult>;
    /**
     * Manage device routes
     */
    manageRoutes(args: any): Promise<CallToolResult>;
    /**
     * Connect to Tailscale network
     */
    connectNetwork(args: any): Promise<CallToolResult>;
    /**
     * Disconnect from Tailscale network
     */
    disconnectNetwork(): Promise<CallToolResult>;
    /**
     * Ping a peer
     */
    pingPeer(args: any): Promise<CallToolResult>;
    /**
     * Get Tailscale version
     */
    getVersion(): Promise<CallToolResult>;
    /**
     * Manage ACL configuration
     */
    manageACL(args: any): Promise<CallToolResult>;
    /**
     * Manage DNS configuration
     */
    manageDNS(args: any): Promise<CallToolResult>;
    /**
     * Manage authentication keys
     */
    manageKeys(args: any): Promise<CallToolResult>;
    /**
     * Get detailed tailnet information
     */
    getTailnetInfo(args: any): Promise<CallToolResult>;
    /**
     * Manage file sharing settings
     */
    manageFileSharing(args: any): Promise<CallToolResult>;
    /**
     * Manage exit nodes
     */
    manageExitNodes(args: any): Promise<CallToolResult>;
    /**
     * Manage network lock (key authority)
     */
    manageNetworkLock(args: any): Promise<CallToolResult>;
    /**
     * Manage webhooks
     */
    manageWebhooks(args: any): Promise<CallToolResult>;
    /**
     * Manage policy files and ACL testing
     */
    managePolicyFile(args: any): Promise<CallToolResult>;
}
//# sourceMappingURL=tools.d.ts.map