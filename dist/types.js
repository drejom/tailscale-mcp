"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIError = exports.TailscaleError = exports.RouteActionRequestSchema = exports.NetworkStatusRequestSchema = exports.DeviceActionRequestSchema = exports.ListDevicesRequestSchema = exports.TailscaleCLIStatusSchema = exports.TailscaleNetworkStatusSchema = exports.TailscaleDeviceSchema = void 0;
const zod_1 = require("zod");
// Tailscale Device Schema
exports.TailscaleDeviceSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    hostname: zod_1.z.string(),
    clientVersion: zod_1.z.string(),
    updateAvailable: zod_1.z.boolean(),
    os: zod_1.z.string(),
    created: zod_1.z.string(),
    lastSeen: zod_1.z.string(),
    keyExpiryDisabled: zod_1.z.boolean(),
    expires: zod_1.z.string(),
    authorized: zod_1.z.boolean(),
    isExternal: zod_1.z.boolean(),
    machineKey: zod_1.z.string(),
    nodeKey: zod_1.z.string(),
    blocksIncomingConnections: zod_1.z.boolean(),
    enabledRoutes: zod_1.z.array(zod_1.z.string()),
    advertisedRoutes: zod_1.z.array(zod_1.z.string()),
    clientConnectivity: zod_1.z.object({
        endpoints: zod_1.z.array(zod_1.z.string()),
        derp: zod_1.z.string(),
        mappingVariesByDestIP: zod_1.z.boolean(),
        latency: zod_1.z.record(zod_1.z.number()).optional(),
        clientSupports: zod_1.z.object({
            hairPinning: zod_1.z.boolean(),
            ipv6: zod_1.z.boolean(),
            pcp: zod_1.z.boolean(),
            pmp: zod_1.z.boolean(),
            udp: zod_1.z.boolean(),
            upnp: zod_1.z.boolean()
        })
    }),
    addresses: zod_1.z.array(zod_1.z.string()),
    user: zod_1.z.string(),
    tags: zod_1.z.array(zod_1.z.string()).optional()
});
exports.TailscaleNetworkStatusSchema = zod_1.z.object({
    self: exports.TailscaleDeviceSchema,
    magicDNSSuffix: zod_1.z.string(),
    magicDNSEnabled: zod_1.z.boolean(),
    domainName: zod_1.z.string(),
    currentTailnet: zod_1.z.object({
        name: zod_1.z.string(),
        magicDNSSuffix: zod_1.z.string(),
        magicDNSEnabled: zod_1.z.boolean()
    }),
    peers: zod_1.z.array(exports.TailscaleDeviceSchema)
});
exports.TailscaleCLIStatusSchema = zod_1.z.object({
    version: zod_1.z.string(),
    tun: zod_1.z.boolean(),
    backendState: zod_1.z.string(),
    authURL: zod_1.z.string().optional(),
    tailscaleIPs: zod_1.z.array(zod_1.z.string()),
    self: zod_1.z.object({
        id: zod_1.z.string(),
        publicKey: zod_1.z.string(),
        hostName: zod_1.z.string(),
        dnsName: zod_1.z.string(),
        os: zod_1.z.string(),
        userID: zod_1.z.number(),
        tailscaleIPs: zod_1.z.array(zod_1.z.string()),
        capabilities: zod_1.z.array(zod_1.z.string()).optional()
    }),
    peers: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        publicKey: zod_1.z.string(),
        hostName: zod_1.z.string(),
        dnsName: zod_1.z.string(),
        os: zod_1.z.string(),
        userID: zod_1.z.number(),
        tailscaleIPs: zod_1.z.array(zod_1.z.string()),
        connType: zod_1.z.string().optional(),
        derp: zod_1.z.string().optional(),
        lastWrite: zod_1.z.string().optional(),
        lastSeen: zod_1.z.string().optional(),
        online: zod_1.z.boolean().optional(),
        exitNode: zod_1.z.boolean().optional(),
        exitNodeOption: zod_1.z.boolean().optional(),
        active: zod_1.z.boolean().optional()
    })).optional()
});
// Tool request/response schemas
exports.ListDevicesRequestSchema = zod_1.z.object({
    includeRoutes: zod_1.z.boolean().optional().default(false)
});
exports.DeviceActionRequestSchema = zod_1.z.object({
    deviceId: zod_1.z.string(),
    action: zod_1.z.enum(['authorize', 'deauthorize', 'delete', 'expire-key'])
});
exports.NetworkStatusRequestSchema = zod_1.z.object({
    format: zod_1.z.enum(['json', 'summary']).optional().default('json')
});
exports.RouteActionRequestSchema = zod_1.z.object({
    deviceId: zod_1.z.string(),
    routes: zod_1.z.array(zod_1.z.string()),
    action: zod_1.z.enum(['enable', 'disable'])
});
// Error types
class TailscaleError extends Error {
    code;
    statusCode;
    constructor(message, code, statusCode) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.name = 'TailscaleError';
    }
}
exports.TailscaleError = TailscaleError;
class CLIError extends Error {
    stderr;
    exitCode;
    constructor(message, stderr, exitCode) {
        super(message);
        this.stderr = stderr;
        this.exitCode = exitCode;
        this.name = 'CLIError';
    }
}
exports.CLIError = CLIError;
//# sourceMappingURL=types.js.map