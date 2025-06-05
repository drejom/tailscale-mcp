import { TailscaleDevice, TailscaleAPIResponse, TailscaleConfig } from './types.js';
export declare class TailscaleAPI {
    private client;
    private tailnet;
    constructor(config: TailscaleConfig);
    /**
     * Handle API response and convert to standardized format
     */
    private handleResponse;
    /**
     * Handle API errors and convert to standardized format
     */
    private handleError;
    /**
     * List all devices in the tailnet
     */
    listDevices(): Promise<TailscaleAPIResponse<TailscaleDevice[]>>;
    /**
     * Get a specific device by ID
     */
    getDevice(deviceId: string): Promise<TailscaleAPIResponse<TailscaleDevice>>;
    /**
     * Authorize a device
     */
    authorizeDevice(deviceId: string): Promise<TailscaleAPIResponse<void>>;
    /**
     * Deauthorize a device
     */
    deauthorizeDevice(deviceId: string): Promise<TailscaleAPIResponse<void>>;
    /**
     * Delete a device
     */
    deleteDevice(deviceId: string): Promise<TailscaleAPIResponse<void>>;
    /**
     * Expire device key
     */
    expireDeviceKey(deviceId: string): Promise<TailscaleAPIResponse<void>>;
    /**
     * Enable device routes
     */
    enableDeviceRoutes(deviceId: string, routes: string[]): Promise<TailscaleAPIResponse<void>>;
    /**
     * Disable device routes
     */
    disableDeviceRoutes(deviceId: string, routes: string[]): Promise<TailscaleAPIResponse<void>>;
    /**
     * Get tailnet information
     */
    getTailnetInfo(): Promise<TailscaleAPIResponse<any>>;
    /**
     * Test API connectivity
     */
    testConnection(): Promise<TailscaleAPIResponse<{
        status: string;
    }>>;
    /**
     * Get ACL configuration
     */
    getACL(): Promise<TailscaleAPIResponse<string>>;
    /**
     * Update ACL configuration
     */
    updateACL(aclConfig: string): Promise<TailscaleAPIResponse<void>>;
    /**
     * Validate ACL configuration
     */
    validateACL(aclConfig: string): Promise<TailscaleAPIResponse<any>>;
    /**
     * Get DNS nameservers
     */
    getDNSNameservers(): Promise<TailscaleAPIResponse<{
        dns: string[];
    }>>;
    /**
     * Set DNS nameservers
     */
    setDNSNameservers(nameservers: string[]): Promise<TailscaleAPIResponse<void>>;
    /**
     * Get DNS preferences
     */
    getDNSPreferences(): Promise<TailscaleAPIResponse<{
        magicDNS: boolean;
    }>>;
    /**
     * Set DNS preferences
     */
    setDNSPreferences(magicDNS: boolean): Promise<TailscaleAPIResponse<void>>;
    /**
     * Get DNS search paths
     */
    getDNSSearchPaths(): Promise<TailscaleAPIResponse<{
        searchPaths: string[];
    }>>;
    /**
     * Set DNS search paths
     */
    setDNSSearchPaths(searchPaths: string[]): Promise<TailscaleAPIResponse<void>>;
    /**
     * List auth keys
     */
    listAuthKeys(): Promise<TailscaleAPIResponse<{
        keys: any[];
    }>>;
    /**
     * Create auth key
     */
    createAuthKey(keyConfig: any): Promise<TailscaleAPIResponse<any>>;
    /**
     * Delete auth key
     */
    deleteAuthKey(keyId: string): Promise<TailscaleAPIResponse<void>>;
    /**
     * Get detailed tailnet information
     */
    getDetailedTailnetInfo(): Promise<TailscaleAPIResponse<any>>;
}
export declare function createTailscaleAPI(config?: TailscaleConfig): TailscaleAPI;
//# sourceMappingURL=tailscale-api.d.ts.map