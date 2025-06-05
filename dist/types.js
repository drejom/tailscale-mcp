import { z } from 'zod';
// Tailscale Device Schema
export const TailscaleDeviceSchema = z.object({
    id: z.string(),
    name: z.string(),
    hostname: z.string(),
    clientVersion: z.string(),
    updateAvailable: z.boolean(),
    os: z.string(),
    created: z.string(),
    lastSeen: z.string(),
    keyExpiryDisabled: z.boolean(),
    expires: z.string(),
    authorized: z.boolean(),
    isExternal: z.boolean(),
    machineKey: z.string(),
    nodeKey: z.string(),
    blocksIncomingConnections: z.boolean(),
    enabledRoutes: z.array(z.string()).optional().default([]),
    advertisedRoutes: z.array(z.string()).optional().default([]),
    clientConnectivity: z.object({
        endpoints: z.array(z.string()),
        derp: z.string(),
        mappingVariesByDestIP: z.boolean(),
        latency: z.record(z.number()).optional(),
        clientSupports: z.object({
            hairPinning: z.boolean(),
            ipv6: z.boolean(),
            pcp: z.boolean(),
            pmp: z.boolean(),
            udp: z.boolean(),
            upnp: z.boolean()
        })
    }).optional(),
    addresses: z.array(z.string()),
    user: z.string(),
    tags: z.array(z.string()).optional()
});
export const TailscaleNetworkStatusSchema = z.object({
    self: TailscaleDeviceSchema,
    magicDNSSuffix: z.string(),
    magicDNSEnabled: z.boolean(),
    domainName: z.string(),
    currentTailnet: z.object({
        name: z.string(),
        magicDNSSuffix: z.string(),
        magicDNSEnabled: z.boolean()
    }),
    peers: z.array(TailscaleDeviceSchema)
});
export const TailscaleCLIStatusSchema = z.object({
    version: z.string(),
    tun: z.boolean(),
    backendState: z.string(),
    authURL: z.string().optional(),
    tailscaleIPs: z.array(z.string()),
    self: z.object({
        id: z.string(),
        publicKey: z.string(),
        hostName: z.string(),
        dnsName: z.string(),
        os: z.string(),
        userID: z.number(),
        tailscaleIPs: z.array(z.string()),
        capabilities: z.array(z.string()).optional()
    }),
    peers: z.array(z.object({
        id: z.string(),
        publicKey: z.string(),
        hostName: z.string(),
        dnsName: z.string(),
        os: z.string(),
        userID: z.number(),
        tailscaleIPs: z.array(z.string()),
        connType: z.string().optional(),
        derp: z.string().optional(),
        lastWrite: z.string().optional(),
        lastSeen: z.string().optional(),
        online: z.boolean().optional(),
        exitNode: z.boolean().optional(),
        exitNodeOption: z.boolean().optional(),
        active: z.boolean().optional()
    })).optional()
});
// Tool request/response schemas
export const ListDevicesRequestSchema = z.object({
    includeRoutes: z.boolean().optional().default(false)
});
export const DeviceActionRequestSchema = z.object({
    deviceId: z.string(),
    action: z.enum(['authorize', 'deauthorize', 'delete', 'expire-key'])
});
export const NetworkStatusRequestSchema = z.object({
    format: z.enum(['json', 'summary']).optional().default('json')
});
export const RouteActionRequestSchema = z.object({
    deviceId: z.string(),
    routes: z.array(z.string()),
    action: z.enum(['enable', 'disable'])
});
// Error types
export class TailscaleError extends Error {
    code;
    statusCode;
    constructor(message, code, statusCode) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.name = 'TailscaleError';
    }
}
export class CLIError extends Error {
    stderr;
    exitCode;
    constructor(message, stderr, exitCode) {
        super(message);
        this.stderr = stderr;
        this.exitCode = exitCode;
        this.name = 'CLIError';
    }
}
//# sourceMappingURL=types.js.map