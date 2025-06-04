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
}
export declare function createTailscaleAPI(config?: TailscaleConfig): TailscaleAPI;
//# sourceMappingURL=tailscale-api.d.ts.map