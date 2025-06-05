import axios from 'axios';
import { TailscaleDeviceSchema } from './types.js';
import { logger } from './logger.js';
export class TailscaleAPI {
    client;
    tailnet;
    constructor(config) {
        const apiKey = config.apiKey || process.env.TAILSCALE_API_KEY;
        const tailnet = config.tailnet || process.env.TAILSCALE_TAILNET || '-';
        if (!apiKey) {
            logger.warn('No Tailscale API key provided. API operations will fail until TAILSCALE_API_KEY is set.');
        }
        this.tailnet = tailnet;
        this.client = axios.create({
            baseURL: 'https://api.tailscale.com/api/v2',
            headers: {
                'Authorization': apiKey ? `Bearer ${apiKey}` : '',
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });
        // Add request/response interceptors for logging
        this.client.interceptors.request.use((config) => {
            logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
            return config;
        }, (error) => {
            logger.error('API Request Error:', error);
            return Promise.reject(error);
        });
        this.client.interceptors.response.use((response) => {
            logger.debug(`API Response: ${response.status} ${response.config.url}`);
            return response;
        }, (error) => {
            logger.error('API Response Error:', {
                url: error.config?.url,
                status: error.response?.status,
                data: error.response?.data
            });
            return Promise.reject(error);
        });
    }
    /**
     * Handle API response and convert to standardized format
     */
    handleResponse(response) {
        return {
            success: true,
            data: response.data,
            statusCode: response.status
        };
    }
    /**
     * Handle API errors and convert to standardized format
     */
    handleError(error) {
        if (error.response) {
            // API returned an error response
            const status = error.response.status;
            const message = error.response.data?.message || error.response.data?.error || `HTTP ${status}`;
            return {
                success: false,
                error: message,
                statusCode: status
            };
        }
        else if (error.request) {
            // Network error
            return {
                success: false,
                error: 'Network error: Unable to connect to Tailscale API'
            };
        }
        else {
            // Other error
            return {
                success: false,
                error: error.message || 'Unknown error occurred'
            };
        }
    }
    /**
     * List all devices in the tailnet
     */
    async listDevices() {
        try {
            const response = await this.client.get(`/tailnet/${this.tailnet}/devices`);
            // Validate and parse devices
            const devices = response.data.devices?.map((device) => {
                try {
                    return TailscaleDeviceSchema.parse(device);
                }
                catch (parseError) {
                    logger.warn('Failed to parse device:', { device, error: parseError });
                    return null;
                }
            }).filter((device) => device !== null) || [];
            return this.handleResponse({ ...response, data: devices });
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    /**
     * Get a specific device by ID
     */
    async getDevice(deviceId) {
        try {
            const response = await this.client.get(`/device/${deviceId}`);
            const device = TailscaleDeviceSchema.parse(response.data);
            return this.handleResponse({ ...response, data: device });
        }
        catch (error) {
            if (error.name === 'ZodError') {
                return {
                    success: false,
                    error: 'Invalid device data received from API'
                };
            }
            return this.handleError(error);
        }
    }
    /**
     * Authorize a device
     */
    async authorizeDevice(deviceId) {
        try {
            const response = await this.client.post(`/device/${deviceId}/authorized`, {
                authorized: true
            });
            return this.handleResponse(response);
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    /**
     * Deauthorize a device
     */
    async deauthorizeDevice(deviceId) {
        try {
            const response = await this.client.post(`/device/${deviceId}/authorized`, {
                authorized: false
            });
            return this.handleResponse(response);
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    /**
     * Delete a device
     */
    async deleteDevice(deviceId) {
        try {
            const response = await this.client.delete(`/device/${deviceId}`);
            return this.handleResponse(response);
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    /**
     * Expire device key
     */
    async expireDeviceKey(deviceId) {
        try {
            const response = await this.client.post(`/device/${deviceId}/expire`);
            return this.handleResponse(response);
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    /**
     * Enable device routes
     */
    async enableDeviceRoutes(deviceId, routes) {
        try {
            const response = await this.client.post(`/device/${deviceId}/routes`, {
                routes: routes
            });
            return this.handleResponse(response);
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    /**
     * Disable device routes
     */
    async disableDeviceRoutes(deviceId, routes) {
        try {
            const response = await this.client.delete(`/device/${deviceId}/routes`, {
                data: { routes: routes }
            });
            return this.handleResponse(response);
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    /**
     * Get tailnet information
     */
    async getTailnetInfo() {
        try {
            const response = await this.client.get(`/tailnet/${this.tailnet}`);
            return this.handleResponse(response);
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    /**
     * Test API connectivity
     */
    async testConnection() {
        try {
            const response = await this.client.get(`/tailnet/${this.tailnet}`);
            return this.handleResponse({
                ...response,
                data: { status: 'connected' }
            });
        }
        catch (error) {
            return this.handleError(error);
        }
    }
}
// Export factory function for creating API instances
export function createTailscaleAPI(config = {}) {
    return new TailscaleAPI(config);
}
//# sourceMappingURL=tailscale-api.js.map