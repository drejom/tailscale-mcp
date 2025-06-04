import { TailscaleCLIStatus, CLIResponse } from './types.js';
export declare class TailscaleCLI {
    private cliPath;
    constructor(cliPath?: string);
    /**
     * Execute a Tailscale CLI command
     */
    private executeCommand;
    /**
     * Get Tailscale status
     */
    getStatus(): Promise<CLIResponse<TailscaleCLIStatus>>;
    /**
     * Get list of peers
     */
    listPeers(): Promise<CLIResponse<string[]>>;
    /**
     * Connect to Tailscale network
     */
    up(options?: {
        loginServer?: string;
        acceptRoutes?: boolean;
        acceptDns?: boolean;
        hostname?: string;
        advertiseRoutes?: string[];
        authKey?: string;
    }): Promise<CLIResponse<string>>;
    /**
     * Disconnect from Tailscale network
     */
    down(): Promise<CLIResponse<string>>;
    /**
     * Ping a peer
     */
    ping(target: string, count?: number): Promise<CLIResponse<string>>;
    /**
     * Get network check information
     */
    netcheck(): Promise<CLIResponse<string>>;
    /**
     * Get version information
     */
    version(): Promise<CLIResponse<string>>;
    /**
     * Logout from Tailscale
     */
    logout(): Promise<CLIResponse<string>>;
    /**
     * Set exit node
     */
    setExitNode(nodeId?: string): Promise<CLIResponse<string>>;
    /**
     * Enable/disable shields up mode
     */
    setShieldsUp(enabled: boolean): Promise<CLIResponse<string>>;
    /**
     * Check if CLI is available
     */
    isAvailable(): Promise<boolean>;
}
export declare const tailscaleCLI: TailscaleCLI;
//# sourceMappingURL=tailscale-cli.d.ts.map