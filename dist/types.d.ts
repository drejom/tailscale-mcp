import { z } from 'zod';
export declare const TailscaleDeviceSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    hostname: z.ZodString;
    clientVersion: z.ZodString;
    updateAvailable: z.ZodBoolean;
    os: z.ZodString;
    created: z.ZodString;
    lastSeen: z.ZodString;
    keyExpiryDisabled: z.ZodBoolean;
    expires: z.ZodString;
    authorized: z.ZodBoolean;
    isExternal: z.ZodBoolean;
    machineKey: z.ZodString;
    nodeKey: z.ZodString;
    blocksIncomingConnections: z.ZodBoolean;
    enabledRoutes: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    advertisedRoutes: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    clientConnectivity: z.ZodOptional<z.ZodObject<{
        endpoints: z.ZodArray<z.ZodString, "many">;
        derp: z.ZodString;
        mappingVariesByDestIP: z.ZodBoolean;
        latency: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        clientSupports: z.ZodObject<{
            hairPinning: z.ZodBoolean;
            ipv6: z.ZodBoolean;
            pcp: z.ZodBoolean;
            pmp: z.ZodBoolean;
            udp: z.ZodBoolean;
            upnp: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            hairPinning: boolean;
            ipv6: boolean;
            pcp: boolean;
            pmp: boolean;
            udp: boolean;
            upnp: boolean;
        }, {
            hairPinning: boolean;
            ipv6: boolean;
            pcp: boolean;
            pmp: boolean;
            udp: boolean;
            upnp: boolean;
        }>;
    }, "strip", z.ZodTypeAny, {
        endpoints: string[];
        derp: string;
        mappingVariesByDestIP: boolean;
        clientSupports: {
            hairPinning: boolean;
            ipv6: boolean;
            pcp: boolean;
            pmp: boolean;
            udp: boolean;
            upnp: boolean;
        };
        latency?: Record<string, number> | undefined;
    }, {
        endpoints: string[];
        derp: string;
        mappingVariesByDestIP: boolean;
        clientSupports: {
            hairPinning: boolean;
            ipv6: boolean;
            pcp: boolean;
            pmp: boolean;
            udp: boolean;
            upnp: boolean;
        };
        latency?: Record<string, number> | undefined;
    }>>;
    addresses: z.ZodArray<z.ZodString, "many">;
    user: z.ZodString;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    hostname: string;
    clientVersion: string;
    updateAvailable: boolean;
    os: string;
    created: string;
    lastSeen: string;
    keyExpiryDisabled: boolean;
    expires: string;
    authorized: boolean;
    isExternal: boolean;
    machineKey: string;
    nodeKey: string;
    blocksIncomingConnections: boolean;
    enabledRoutes: string[];
    advertisedRoutes: string[];
    addresses: string[];
    user: string;
    clientConnectivity?: {
        endpoints: string[];
        derp: string;
        mappingVariesByDestIP: boolean;
        clientSupports: {
            hairPinning: boolean;
            ipv6: boolean;
            pcp: boolean;
            pmp: boolean;
            udp: boolean;
            upnp: boolean;
        };
        latency?: Record<string, number> | undefined;
    } | undefined;
    tags?: string[] | undefined;
}, {
    id: string;
    name: string;
    hostname: string;
    clientVersion: string;
    updateAvailable: boolean;
    os: string;
    created: string;
    lastSeen: string;
    keyExpiryDisabled: boolean;
    expires: string;
    authorized: boolean;
    isExternal: boolean;
    machineKey: string;
    nodeKey: string;
    blocksIncomingConnections: boolean;
    addresses: string[];
    user: string;
    enabledRoutes?: string[] | undefined;
    advertisedRoutes?: string[] | undefined;
    clientConnectivity?: {
        endpoints: string[];
        derp: string;
        mappingVariesByDestIP: boolean;
        clientSupports: {
            hairPinning: boolean;
            ipv6: boolean;
            pcp: boolean;
            pmp: boolean;
            udp: boolean;
            upnp: boolean;
        };
        latency?: Record<string, number> | undefined;
    } | undefined;
    tags?: string[] | undefined;
}>;
export declare const TailscaleNetworkStatusSchema: z.ZodObject<{
    self: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        hostname: z.ZodString;
        clientVersion: z.ZodString;
        updateAvailable: z.ZodBoolean;
        os: z.ZodString;
        created: z.ZodString;
        lastSeen: z.ZodString;
        keyExpiryDisabled: z.ZodBoolean;
        expires: z.ZodString;
        authorized: z.ZodBoolean;
        isExternal: z.ZodBoolean;
        machineKey: z.ZodString;
        nodeKey: z.ZodString;
        blocksIncomingConnections: z.ZodBoolean;
        enabledRoutes: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        advertisedRoutes: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        clientConnectivity: z.ZodOptional<z.ZodObject<{
            endpoints: z.ZodArray<z.ZodString, "many">;
            derp: z.ZodString;
            mappingVariesByDestIP: z.ZodBoolean;
            latency: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
            clientSupports: z.ZodObject<{
                hairPinning: z.ZodBoolean;
                ipv6: z.ZodBoolean;
                pcp: z.ZodBoolean;
                pmp: z.ZodBoolean;
                udp: z.ZodBoolean;
                upnp: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                hairPinning: boolean;
                ipv6: boolean;
                pcp: boolean;
                pmp: boolean;
                udp: boolean;
                upnp: boolean;
            }, {
                hairPinning: boolean;
                ipv6: boolean;
                pcp: boolean;
                pmp: boolean;
                udp: boolean;
                upnp: boolean;
            }>;
        }, "strip", z.ZodTypeAny, {
            endpoints: string[];
            derp: string;
            mappingVariesByDestIP: boolean;
            clientSupports: {
                hairPinning: boolean;
                ipv6: boolean;
                pcp: boolean;
                pmp: boolean;
                udp: boolean;
                upnp: boolean;
            };
            latency?: Record<string, number> | undefined;
        }, {
            endpoints: string[];
            derp: string;
            mappingVariesByDestIP: boolean;
            clientSupports: {
                hairPinning: boolean;
                ipv6: boolean;
                pcp: boolean;
                pmp: boolean;
                udp: boolean;
                upnp: boolean;
            };
            latency?: Record<string, number> | undefined;
        }>>;
        addresses: z.ZodArray<z.ZodString, "many">;
        user: z.ZodString;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        hostname: string;
        clientVersion: string;
        updateAvailable: boolean;
        os: string;
        created: string;
        lastSeen: string;
        keyExpiryDisabled: boolean;
        expires: string;
        authorized: boolean;
        isExternal: boolean;
        machineKey: string;
        nodeKey: string;
        blocksIncomingConnections: boolean;
        enabledRoutes: string[];
        advertisedRoutes: string[];
        addresses: string[];
        user: string;
        clientConnectivity?: {
            endpoints: string[];
            derp: string;
            mappingVariesByDestIP: boolean;
            clientSupports: {
                hairPinning: boolean;
                ipv6: boolean;
                pcp: boolean;
                pmp: boolean;
                udp: boolean;
                upnp: boolean;
            };
            latency?: Record<string, number> | undefined;
        } | undefined;
        tags?: string[] | undefined;
    }, {
        id: string;
        name: string;
        hostname: string;
        clientVersion: string;
        updateAvailable: boolean;
        os: string;
        created: string;
        lastSeen: string;
        keyExpiryDisabled: boolean;
        expires: string;
        authorized: boolean;
        isExternal: boolean;
        machineKey: string;
        nodeKey: string;
        blocksIncomingConnections: boolean;
        addresses: string[];
        user: string;
        enabledRoutes?: string[] | undefined;
        advertisedRoutes?: string[] | undefined;
        clientConnectivity?: {
            endpoints: string[];
            derp: string;
            mappingVariesByDestIP: boolean;
            clientSupports: {
                hairPinning: boolean;
                ipv6: boolean;
                pcp: boolean;
                pmp: boolean;
                udp: boolean;
                upnp: boolean;
            };
            latency?: Record<string, number> | undefined;
        } | undefined;
        tags?: string[] | undefined;
    }>;
    magicDNSSuffix: z.ZodString;
    magicDNSEnabled: z.ZodBoolean;
    domainName: z.ZodString;
    currentTailnet: z.ZodObject<{
        name: z.ZodString;
        magicDNSSuffix: z.ZodString;
        magicDNSEnabled: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        name: string;
        magicDNSSuffix: string;
        magicDNSEnabled: boolean;
    }, {
        name: string;
        magicDNSSuffix: string;
        magicDNSEnabled: boolean;
    }>;
    peers: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        hostname: z.ZodString;
        clientVersion: z.ZodString;
        updateAvailable: z.ZodBoolean;
        os: z.ZodString;
        created: z.ZodString;
        lastSeen: z.ZodString;
        keyExpiryDisabled: z.ZodBoolean;
        expires: z.ZodString;
        authorized: z.ZodBoolean;
        isExternal: z.ZodBoolean;
        machineKey: z.ZodString;
        nodeKey: z.ZodString;
        blocksIncomingConnections: z.ZodBoolean;
        enabledRoutes: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        advertisedRoutes: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        clientConnectivity: z.ZodOptional<z.ZodObject<{
            endpoints: z.ZodArray<z.ZodString, "many">;
            derp: z.ZodString;
            mappingVariesByDestIP: z.ZodBoolean;
            latency: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
            clientSupports: z.ZodObject<{
                hairPinning: z.ZodBoolean;
                ipv6: z.ZodBoolean;
                pcp: z.ZodBoolean;
                pmp: z.ZodBoolean;
                udp: z.ZodBoolean;
                upnp: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                hairPinning: boolean;
                ipv6: boolean;
                pcp: boolean;
                pmp: boolean;
                udp: boolean;
                upnp: boolean;
            }, {
                hairPinning: boolean;
                ipv6: boolean;
                pcp: boolean;
                pmp: boolean;
                udp: boolean;
                upnp: boolean;
            }>;
        }, "strip", z.ZodTypeAny, {
            endpoints: string[];
            derp: string;
            mappingVariesByDestIP: boolean;
            clientSupports: {
                hairPinning: boolean;
                ipv6: boolean;
                pcp: boolean;
                pmp: boolean;
                udp: boolean;
                upnp: boolean;
            };
            latency?: Record<string, number> | undefined;
        }, {
            endpoints: string[];
            derp: string;
            mappingVariesByDestIP: boolean;
            clientSupports: {
                hairPinning: boolean;
                ipv6: boolean;
                pcp: boolean;
                pmp: boolean;
                udp: boolean;
                upnp: boolean;
            };
            latency?: Record<string, number> | undefined;
        }>>;
        addresses: z.ZodArray<z.ZodString, "many">;
        user: z.ZodString;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        hostname: string;
        clientVersion: string;
        updateAvailable: boolean;
        os: string;
        created: string;
        lastSeen: string;
        keyExpiryDisabled: boolean;
        expires: string;
        authorized: boolean;
        isExternal: boolean;
        machineKey: string;
        nodeKey: string;
        blocksIncomingConnections: boolean;
        enabledRoutes: string[];
        advertisedRoutes: string[];
        addresses: string[];
        user: string;
        clientConnectivity?: {
            endpoints: string[];
            derp: string;
            mappingVariesByDestIP: boolean;
            clientSupports: {
                hairPinning: boolean;
                ipv6: boolean;
                pcp: boolean;
                pmp: boolean;
                udp: boolean;
                upnp: boolean;
            };
            latency?: Record<string, number> | undefined;
        } | undefined;
        tags?: string[] | undefined;
    }, {
        id: string;
        name: string;
        hostname: string;
        clientVersion: string;
        updateAvailable: boolean;
        os: string;
        created: string;
        lastSeen: string;
        keyExpiryDisabled: boolean;
        expires: string;
        authorized: boolean;
        isExternal: boolean;
        machineKey: string;
        nodeKey: string;
        blocksIncomingConnections: boolean;
        addresses: string[];
        user: string;
        enabledRoutes?: string[] | undefined;
        advertisedRoutes?: string[] | undefined;
        clientConnectivity?: {
            endpoints: string[];
            derp: string;
            mappingVariesByDestIP: boolean;
            clientSupports: {
                hairPinning: boolean;
                ipv6: boolean;
                pcp: boolean;
                pmp: boolean;
                udp: boolean;
                upnp: boolean;
            };
            latency?: Record<string, number> | undefined;
        } | undefined;
        tags?: string[] | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    self: {
        id: string;
        name: string;
        hostname: string;
        clientVersion: string;
        updateAvailable: boolean;
        os: string;
        created: string;
        lastSeen: string;
        keyExpiryDisabled: boolean;
        expires: string;
        authorized: boolean;
        isExternal: boolean;
        machineKey: string;
        nodeKey: string;
        blocksIncomingConnections: boolean;
        enabledRoutes: string[];
        advertisedRoutes: string[];
        addresses: string[];
        user: string;
        clientConnectivity?: {
            endpoints: string[];
            derp: string;
            mappingVariesByDestIP: boolean;
            clientSupports: {
                hairPinning: boolean;
                ipv6: boolean;
                pcp: boolean;
                pmp: boolean;
                udp: boolean;
                upnp: boolean;
            };
            latency?: Record<string, number> | undefined;
        } | undefined;
        tags?: string[] | undefined;
    };
    magicDNSSuffix: string;
    magicDNSEnabled: boolean;
    domainName: string;
    currentTailnet: {
        name: string;
        magicDNSSuffix: string;
        magicDNSEnabled: boolean;
    };
    peers: {
        id: string;
        name: string;
        hostname: string;
        clientVersion: string;
        updateAvailable: boolean;
        os: string;
        created: string;
        lastSeen: string;
        keyExpiryDisabled: boolean;
        expires: string;
        authorized: boolean;
        isExternal: boolean;
        machineKey: string;
        nodeKey: string;
        blocksIncomingConnections: boolean;
        enabledRoutes: string[];
        advertisedRoutes: string[];
        addresses: string[];
        user: string;
        clientConnectivity?: {
            endpoints: string[];
            derp: string;
            mappingVariesByDestIP: boolean;
            clientSupports: {
                hairPinning: boolean;
                ipv6: boolean;
                pcp: boolean;
                pmp: boolean;
                udp: boolean;
                upnp: boolean;
            };
            latency?: Record<string, number> | undefined;
        } | undefined;
        tags?: string[] | undefined;
    }[];
}, {
    self: {
        id: string;
        name: string;
        hostname: string;
        clientVersion: string;
        updateAvailable: boolean;
        os: string;
        created: string;
        lastSeen: string;
        keyExpiryDisabled: boolean;
        expires: string;
        authorized: boolean;
        isExternal: boolean;
        machineKey: string;
        nodeKey: string;
        blocksIncomingConnections: boolean;
        addresses: string[];
        user: string;
        enabledRoutes?: string[] | undefined;
        advertisedRoutes?: string[] | undefined;
        clientConnectivity?: {
            endpoints: string[];
            derp: string;
            mappingVariesByDestIP: boolean;
            clientSupports: {
                hairPinning: boolean;
                ipv6: boolean;
                pcp: boolean;
                pmp: boolean;
                udp: boolean;
                upnp: boolean;
            };
            latency?: Record<string, number> | undefined;
        } | undefined;
        tags?: string[] | undefined;
    };
    magicDNSSuffix: string;
    magicDNSEnabled: boolean;
    domainName: string;
    currentTailnet: {
        name: string;
        magicDNSSuffix: string;
        magicDNSEnabled: boolean;
    };
    peers: {
        id: string;
        name: string;
        hostname: string;
        clientVersion: string;
        updateAvailable: boolean;
        os: string;
        created: string;
        lastSeen: string;
        keyExpiryDisabled: boolean;
        expires: string;
        authorized: boolean;
        isExternal: boolean;
        machineKey: string;
        nodeKey: string;
        blocksIncomingConnections: boolean;
        addresses: string[];
        user: string;
        enabledRoutes?: string[] | undefined;
        advertisedRoutes?: string[] | undefined;
        clientConnectivity?: {
            endpoints: string[];
            derp: string;
            mappingVariesByDestIP: boolean;
            clientSupports: {
                hairPinning: boolean;
                ipv6: boolean;
                pcp: boolean;
                pmp: boolean;
                udp: boolean;
                upnp: boolean;
            };
            latency?: Record<string, number> | undefined;
        } | undefined;
        tags?: string[] | undefined;
    }[];
}>;
export declare const TailscaleCLIStatusSchema: z.ZodObject<{
    version: z.ZodString;
    tun: z.ZodBoolean;
    backendState: z.ZodString;
    authURL: z.ZodOptional<z.ZodString>;
    tailscaleIPs: z.ZodArray<z.ZodString, "many">;
    self: z.ZodObject<{
        id: z.ZodString;
        publicKey: z.ZodString;
        hostName: z.ZodString;
        dnsName: z.ZodString;
        os: z.ZodString;
        userID: z.ZodNumber;
        tailscaleIPs: z.ZodArray<z.ZodString, "many">;
        capabilities: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        os: string;
        tailscaleIPs: string[];
        publicKey: string;
        hostName: string;
        dnsName: string;
        userID: number;
        capabilities?: string[] | undefined;
    }, {
        id: string;
        os: string;
        tailscaleIPs: string[];
        publicKey: string;
        hostName: string;
        dnsName: string;
        userID: number;
        capabilities?: string[] | undefined;
    }>;
    peers: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        publicKey: z.ZodString;
        hostName: z.ZodString;
        dnsName: z.ZodString;
        os: z.ZodString;
        userID: z.ZodNumber;
        tailscaleIPs: z.ZodArray<z.ZodString, "many">;
        connType: z.ZodOptional<z.ZodString>;
        derp: z.ZodOptional<z.ZodString>;
        lastWrite: z.ZodOptional<z.ZodString>;
        lastSeen: z.ZodOptional<z.ZodString>;
        online: z.ZodOptional<z.ZodBoolean>;
        exitNode: z.ZodOptional<z.ZodBoolean>;
        exitNodeOption: z.ZodOptional<z.ZodBoolean>;
        active: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        os: string;
        tailscaleIPs: string[];
        publicKey: string;
        hostName: string;
        dnsName: string;
        userID: number;
        lastSeen?: string | undefined;
        derp?: string | undefined;
        connType?: string | undefined;
        lastWrite?: string | undefined;
        online?: boolean | undefined;
        exitNode?: boolean | undefined;
        exitNodeOption?: boolean | undefined;
        active?: boolean | undefined;
    }, {
        id: string;
        os: string;
        tailscaleIPs: string[];
        publicKey: string;
        hostName: string;
        dnsName: string;
        userID: number;
        lastSeen?: string | undefined;
        derp?: string | undefined;
        connType?: string | undefined;
        lastWrite?: string | undefined;
        online?: boolean | undefined;
        exitNode?: boolean | undefined;
        exitNodeOption?: boolean | undefined;
        active?: boolean | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    self: {
        id: string;
        os: string;
        tailscaleIPs: string[];
        publicKey: string;
        hostName: string;
        dnsName: string;
        userID: number;
        capabilities?: string[] | undefined;
    };
    version: string;
    tun: boolean;
    backendState: string;
    tailscaleIPs: string[];
    peers?: {
        id: string;
        os: string;
        tailscaleIPs: string[];
        publicKey: string;
        hostName: string;
        dnsName: string;
        userID: number;
        lastSeen?: string | undefined;
        derp?: string | undefined;
        connType?: string | undefined;
        lastWrite?: string | undefined;
        online?: boolean | undefined;
        exitNode?: boolean | undefined;
        exitNodeOption?: boolean | undefined;
        active?: boolean | undefined;
    }[] | undefined;
    authURL?: string | undefined;
}, {
    self: {
        id: string;
        os: string;
        tailscaleIPs: string[];
        publicKey: string;
        hostName: string;
        dnsName: string;
        userID: number;
        capabilities?: string[] | undefined;
    };
    version: string;
    tun: boolean;
    backendState: string;
    tailscaleIPs: string[];
    peers?: {
        id: string;
        os: string;
        tailscaleIPs: string[];
        publicKey: string;
        hostName: string;
        dnsName: string;
        userID: number;
        lastSeen?: string | undefined;
        derp?: string | undefined;
        connType?: string | undefined;
        lastWrite?: string | undefined;
        online?: boolean | undefined;
        exitNode?: boolean | undefined;
        exitNodeOption?: boolean | undefined;
        active?: boolean | undefined;
    }[] | undefined;
    authURL?: string | undefined;
}>;
export declare const ListDevicesRequestSchema: z.ZodObject<{
    includeRoutes: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    includeRoutes: boolean;
}, {
    includeRoutes?: boolean | undefined;
}>;
export declare const DeviceActionRequestSchema: z.ZodObject<{
    deviceId: z.ZodString;
    action: z.ZodEnum<["authorize", "deauthorize", "delete", "expire-key"]>;
}, "strip", z.ZodTypeAny, {
    deviceId: string;
    action: "authorize" | "deauthorize" | "delete" | "expire-key";
}, {
    deviceId: string;
    action: "authorize" | "deauthorize" | "delete" | "expire-key";
}>;
export declare const NetworkStatusRequestSchema: z.ZodObject<{
    format: z.ZodDefault<z.ZodOptional<z.ZodEnum<["json", "summary"]>>>;
}, "strip", z.ZodTypeAny, {
    format: "json" | "summary";
}, {
    format?: "json" | "summary" | undefined;
}>;
export declare const RouteActionRequestSchema: z.ZodObject<{
    deviceId: z.ZodString;
    routes: z.ZodArray<z.ZodString, "many">;
    action: z.ZodEnum<["enable", "disable"]>;
}, "strip", z.ZodTypeAny, {
    deviceId: string;
    action: "enable" | "disable";
    routes: string[];
}, {
    deviceId: string;
    action: "enable" | "disable";
    routes: string[];
}>;
export type TailscaleDevice = z.infer<typeof TailscaleDeviceSchema>;
export type TailscaleNetworkStatus = z.infer<typeof TailscaleNetworkStatusSchema>;
export type TailscaleCLIStatus = z.infer<typeof TailscaleCLIStatusSchema>;
export type ListDevicesRequest = z.infer<typeof ListDevicesRequestSchema>;
export type DeviceActionRequest = z.infer<typeof DeviceActionRequestSchema>;
export type NetworkStatusRequest = z.infer<typeof NetworkStatusRequestSchema>;
export type RouteActionRequest = z.infer<typeof RouteActionRequestSchema>;
export interface TailscaleAPIResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    statusCode?: number;
}
export interface CLIResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    stderr?: string;
}
export interface ToolResult {
    content: Array<{
        type: 'text';
        text: string;
    }>;
    isError?: boolean;
}
export interface TailscaleConfig {
    apiKey?: string;
    tailnet?: string;
    cliPath?: string;
}
export declare class TailscaleError extends Error {
    readonly code?: string | undefined;
    readonly statusCode?: number | undefined;
    constructor(message: string, code?: string | undefined, statusCode?: number | undefined);
}
export declare class CLIError extends Error {
    readonly stderr?: string | undefined;
    readonly exitCode?: number | undefined;
    constructor(message: string, stderr?: string | undefined, exitCode?: number | undefined);
}
//# sourceMappingURL=types.d.ts.map