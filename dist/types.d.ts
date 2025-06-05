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
export declare const ACLRuleSchema: z.ZodObject<{
    action: z.ZodEnum<["accept", "drop"]>;
    src: z.ZodArray<z.ZodString, "many">;
    dst: z.ZodArray<z.ZodString, "many">;
    proto: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "accept" | "drop";
    src: string[];
    dst: string[];
    proto?: string | undefined;
}, {
    action: "accept" | "drop";
    src: string[];
    dst: string[];
    proto?: string | undefined;
}>;
export declare const ACLConfigSchema: z.ZodObject<{
    groups: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>>;
    tagOwners: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>>;
    acls: z.ZodArray<z.ZodObject<{
        action: z.ZodEnum<["accept", "drop"]>;
        src: z.ZodArray<z.ZodString, "many">;
        dst: z.ZodArray<z.ZodString, "many">;
        proto: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        action: "accept" | "drop";
        src: string[];
        dst: string[];
        proto?: string | undefined;
    }, {
        action: "accept" | "drop";
        src: string[];
        dst: string[];
        proto?: string | undefined;
    }>, "many">;
    tests: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    ssh: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
}, "strip", z.ZodTypeAny, {
    acls: {
        action: "accept" | "drop";
        src: string[];
        dst: string[];
        proto?: string | undefined;
    }[];
    groups?: Record<string, string[]> | undefined;
    tagOwners?: Record<string, string[]> | undefined;
    tests?: any[] | undefined;
    ssh?: any[] | undefined;
}, {
    acls: {
        action: "accept" | "drop";
        src: string[];
        dst: string[];
        proto?: string | undefined;
    }[];
    groups?: Record<string, string[]> | undefined;
    tagOwners?: Record<string, string[]> | undefined;
    tests?: any[] | undefined;
    ssh?: any[] | undefined;
}>;
export declare const DNSConfigSchema: z.ZodObject<{
    dns: z.ZodArray<z.ZodString, "many">;
    magicDNS: z.ZodOptional<z.ZodBoolean>;
    nameservers: z.ZodOptional<z.ZodObject<{
        global: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        restricted: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>>;
    }, "strip", z.ZodTypeAny, {
        global?: string[] | undefined;
        restricted?: Record<string, string[]> | undefined;
    }, {
        global?: string[] | undefined;
        restricted?: Record<string, string[]> | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    dns: string[];
    magicDNS?: boolean | undefined;
    nameservers?: {
        global?: string[] | undefined;
        restricted?: Record<string, string[]> | undefined;
    } | undefined;
}, {
    dns: string[];
    magicDNS?: boolean | undefined;
    nameservers?: {
        global?: string[] | undefined;
        restricted?: Record<string, string[]> | undefined;
    } | undefined;
}>;
export declare const SearchPathSchema: z.ZodObject<{
    searchPaths: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    searchPaths: string[];
}, {
    searchPaths: string[];
}>;
export declare const AuthKeySchema: z.ZodObject<{
    id: z.ZodString;
    key: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    created: z.ZodString;
    expires: z.ZodString;
    revoked: z.ZodBoolean;
    capabilities: z.ZodObject<{
        devices: z.ZodObject<{
            create: z.ZodObject<{
                reusable: z.ZodBoolean;
                ephemeral: z.ZodBoolean;
                preauthorized: z.ZodBoolean;
                tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            }, "strip", z.ZodTypeAny, {
                reusable: boolean;
                ephemeral: boolean;
                preauthorized: boolean;
                tags?: string[] | undefined;
            }, {
                reusable: boolean;
                ephemeral: boolean;
                preauthorized: boolean;
                tags?: string[] | undefined;
            }>;
        }, "strip", z.ZodTypeAny, {
            create: {
                reusable: boolean;
                ephemeral: boolean;
                preauthorized: boolean;
                tags?: string[] | undefined;
            };
        }, {
            create: {
                reusable: boolean;
                ephemeral: boolean;
                preauthorized: boolean;
                tags?: string[] | undefined;
            };
        }>;
    }, "strip", z.ZodTypeAny, {
        devices: {
            create: {
                reusable: boolean;
                ephemeral: boolean;
                preauthorized: boolean;
                tags?: string[] | undefined;
            };
        };
    }, {
        devices: {
            create: {
                reusable: boolean;
                ephemeral: boolean;
                preauthorized: boolean;
                tags?: string[] | undefined;
            };
        };
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    created: string;
    expires: string;
    capabilities: {
        devices: {
            create: {
                reusable: boolean;
                ephemeral: boolean;
                preauthorized: boolean;
                tags?: string[] | undefined;
            };
        };
    };
    key: string;
    revoked: boolean;
    description?: string | undefined;
}, {
    id: string;
    created: string;
    expires: string;
    capabilities: {
        devices: {
            create: {
                reusable: boolean;
                ephemeral: boolean;
                preauthorized: boolean;
                tags?: string[] | undefined;
            };
        };
    };
    key: string;
    revoked: boolean;
    description?: string | undefined;
}>;
export declare const CreateAuthKeyRequestSchema: z.ZodObject<{
    capabilities: z.ZodObject<{
        devices: z.ZodObject<{
            create: z.ZodObject<{
                reusable: z.ZodOptional<z.ZodBoolean>;
                ephemeral: z.ZodOptional<z.ZodBoolean>;
                preauthorized: z.ZodOptional<z.ZodBoolean>;
                tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            }, "strip", z.ZodTypeAny, {
                tags?: string[] | undefined;
                reusable?: boolean | undefined;
                ephemeral?: boolean | undefined;
                preauthorized?: boolean | undefined;
            }, {
                tags?: string[] | undefined;
                reusable?: boolean | undefined;
                ephemeral?: boolean | undefined;
                preauthorized?: boolean | undefined;
            }>;
        }, "strip", z.ZodTypeAny, {
            create: {
                tags?: string[] | undefined;
                reusable?: boolean | undefined;
                ephemeral?: boolean | undefined;
                preauthorized?: boolean | undefined;
            };
        }, {
            create: {
                tags?: string[] | undefined;
                reusable?: boolean | undefined;
                ephemeral?: boolean | undefined;
                preauthorized?: boolean | undefined;
            };
        }>;
    }, "strip", z.ZodTypeAny, {
        devices: {
            create: {
                tags?: string[] | undefined;
                reusable?: boolean | undefined;
                ephemeral?: boolean | undefined;
                preauthorized?: boolean | undefined;
            };
        };
    }, {
        devices: {
            create: {
                tags?: string[] | undefined;
                reusable?: boolean | undefined;
                ephemeral?: boolean | undefined;
                preauthorized?: boolean | undefined;
            };
        };
    }>;
    expirySeconds: z.ZodOptional<z.ZodNumber>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    capabilities: {
        devices: {
            create: {
                tags?: string[] | undefined;
                reusable?: boolean | undefined;
                ephemeral?: boolean | undefined;
                preauthorized?: boolean | undefined;
            };
        };
    };
    description?: string | undefined;
    expirySeconds?: number | undefined;
}, {
    capabilities: {
        devices: {
            create: {
                tags?: string[] | undefined;
                reusable?: boolean | undefined;
                ephemeral?: boolean | undefined;
                preauthorized?: boolean | undefined;
            };
        };
    };
    description?: string | undefined;
    expirySeconds?: number | undefined;
}>;
export declare const ACLRequestSchema: z.ZodObject<{
    operation: z.ZodEnum<["get", "update", "validate"]>;
    aclConfig: z.ZodOptional<z.ZodObject<{
        groups: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>>;
        tagOwners: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>>;
        acls: z.ZodArray<z.ZodObject<{
            action: z.ZodEnum<["accept", "drop"]>;
            src: z.ZodArray<z.ZodString, "many">;
            dst: z.ZodArray<z.ZodString, "many">;
            proto: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            action: "accept" | "drop";
            src: string[];
            dst: string[];
            proto?: string | undefined;
        }, {
            action: "accept" | "drop";
            src: string[];
            dst: string[];
            proto?: string | undefined;
        }>, "many">;
        tests: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
        ssh: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    }, "strip", z.ZodTypeAny, {
        acls: {
            action: "accept" | "drop";
            src: string[];
            dst: string[];
            proto?: string | undefined;
        }[];
        groups?: Record<string, string[]> | undefined;
        tagOwners?: Record<string, string[]> | undefined;
        tests?: any[] | undefined;
        ssh?: any[] | undefined;
    }, {
        acls: {
            action: "accept" | "drop";
            src: string[];
            dst: string[];
            proto?: string | undefined;
        }[];
        groups?: Record<string, string[]> | undefined;
        tagOwners?: Record<string, string[]> | undefined;
        tests?: any[] | undefined;
        ssh?: any[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    operation: "get" | "update" | "validate";
    aclConfig?: {
        acls: {
            action: "accept" | "drop";
            src: string[];
            dst: string[];
            proto?: string | undefined;
        }[];
        groups?: Record<string, string[]> | undefined;
        tagOwners?: Record<string, string[]> | undefined;
        tests?: any[] | undefined;
        ssh?: any[] | undefined;
    } | undefined;
}, {
    operation: "get" | "update" | "validate";
    aclConfig?: {
        acls: {
            action: "accept" | "drop";
            src: string[];
            dst: string[];
            proto?: string | undefined;
        }[];
        groups?: Record<string, string[]> | undefined;
        tagOwners?: Record<string, string[]> | undefined;
        tests?: any[] | undefined;
        ssh?: any[] | undefined;
    } | undefined;
}>;
export declare const DNSRequestSchema: z.ZodObject<{
    operation: z.ZodEnum<["get_nameservers", "set_nameservers", "get_preferences", "set_preferences", "get_searchpaths", "set_searchpaths"]>;
    nameservers: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    magicDNS: z.ZodOptional<z.ZodBoolean>;
    searchPaths: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    operation: "get_nameservers" | "set_nameservers" | "get_preferences" | "set_preferences" | "get_searchpaths" | "set_searchpaths";
    magicDNS?: boolean | undefined;
    nameservers?: string[] | undefined;
    searchPaths?: string[] | undefined;
}, {
    operation: "get_nameservers" | "set_nameservers" | "get_preferences" | "set_preferences" | "get_searchpaths" | "set_searchpaths";
    magicDNS?: boolean | undefined;
    nameservers?: string[] | undefined;
    searchPaths?: string[] | undefined;
}>;
export declare const KeyManagementRequestSchema: z.ZodObject<{
    operation: z.ZodEnum<["list", "create", "delete"]>;
    keyId: z.ZodOptional<z.ZodString>;
    keyConfig: z.ZodOptional<z.ZodObject<{
        capabilities: z.ZodObject<{
            devices: z.ZodObject<{
                create: z.ZodObject<{
                    reusable: z.ZodOptional<z.ZodBoolean>;
                    ephemeral: z.ZodOptional<z.ZodBoolean>;
                    preauthorized: z.ZodOptional<z.ZodBoolean>;
                    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                }, "strip", z.ZodTypeAny, {
                    tags?: string[] | undefined;
                    reusable?: boolean | undefined;
                    ephemeral?: boolean | undefined;
                    preauthorized?: boolean | undefined;
                }, {
                    tags?: string[] | undefined;
                    reusable?: boolean | undefined;
                    ephemeral?: boolean | undefined;
                    preauthorized?: boolean | undefined;
                }>;
            }, "strip", z.ZodTypeAny, {
                create: {
                    tags?: string[] | undefined;
                    reusable?: boolean | undefined;
                    ephemeral?: boolean | undefined;
                    preauthorized?: boolean | undefined;
                };
            }, {
                create: {
                    tags?: string[] | undefined;
                    reusable?: boolean | undefined;
                    ephemeral?: boolean | undefined;
                    preauthorized?: boolean | undefined;
                };
            }>;
        }, "strip", z.ZodTypeAny, {
            devices: {
                create: {
                    tags?: string[] | undefined;
                    reusable?: boolean | undefined;
                    ephemeral?: boolean | undefined;
                    preauthorized?: boolean | undefined;
                };
            };
        }, {
            devices: {
                create: {
                    tags?: string[] | undefined;
                    reusable?: boolean | undefined;
                    ephemeral?: boolean | undefined;
                    preauthorized?: boolean | undefined;
                };
            };
        }>;
        expirySeconds: z.ZodOptional<z.ZodNumber>;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        capabilities: {
            devices: {
                create: {
                    tags?: string[] | undefined;
                    reusable?: boolean | undefined;
                    ephemeral?: boolean | undefined;
                    preauthorized?: boolean | undefined;
                };
            };
        };
        description?: string | undefined;
        expirySeconds?: number | undefined;
    }, {
        capabilities: {
            devices: {
                create: {
                    tags?: string[] | undefined;
                    reusable?: boolean | undefined;
                    ephemeral?: boolean | undefined;
                    preauthorized?: boolean | undefined;
                };
            };
        };
        description?: string | undefined;
        expirySeconds?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    operation: "delete" | "create" | "list";
    keyId?: string | undefined;
    keyConfig?: {
        capabilities: {
            devices: {
                create: {
                    tags?: string[] | undefined;
                    reusable?: boolean | undefined;
                    ephemeral?: boolean | undefined;
                    preauthorized?: boolean | undefined;
                };
            };
        };
        description?: string | undefined;
        expirySeconds?: number | undefined;
    } | undefined;
}, {
    operation: "delete" | "create" | "list";
    keyId?: string | undefined;
    keyConfig?: {
        capabilities: {
            devices: {
                create: {
                    tags?: string[] | undefined;
                    reusable?: boolean | undefined;
                    ephemeral?: boolean | undefined;
                    preauthorized?: boolean | undefined;
                };
            };
        };
        description?: string | undefined;
        expirySeconds?: number | undefined;
    } | undefined;
}>;
export declare const TailnetInfoRequestSchema: z.ZodObject<{
    includeDetails: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    includeDetails?: boolean | undefined;
}, {
    includeDetails?: boolean | undefined;
}>;
export type ACLRule = z.infer<typeof ACLRuleSchema>;
export type ACLConfig = z.infer<typeof ACLConfigSchema>;
export type DNSConfig = z.infer<typeof DNSConfigSchema>;
export type SearchPath = z.infer<typeof SearchPathSchema>;
export type AuthKey = z.infer<typeof AuthKeySchema>;
export type CreateAuthKeyRequest = z.infer<typeof CreateAuthKeyRequestSchema>;
export type ACLRequest = z.infer<typeof ACLRequestSchema>;
export type DNSRequest = z.infer<typeof DNSRequestSchema>;
export type KeyManagementRequest = z.infer<typeof KeyManagementRequestSchema>;
export type TailnetInfoRequest = z.infer<typeof TailnetInfoRequestSchema>;
export declare const FileSharingRequestSchema: z.ZodObject<{
    operation: z.ZodEnum<["get_status", "enable", "disable"]>;
    deviceId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    operation: "enable" | "disable" | "get_status";
    deviceId?: string | undefined;
}, {
    operation: "enable" | "disable" | "get_status";
    deviceId?: string | undefined;
}>;
export declare const ExitNodeRequestSchema: z.ZodObject<{
    operation: z.ZodEnum<["list", "set", "clear", "advertise", "stop_advertising"]>;
    deviceId: z.ZodOptional<z.ZodString>;
    routes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    operation: "set" | "list" | "clear" | "advertise" | "stop_advertising";
    deviceId?: string | undefined;
    routes?: string[] | undefined;
}, {
    operation: "set" | "list" | "clear" | "advertise" | "stop_advertising";
    deviceId?: string | undefined;
    routes?: string[] | undefined;
}>;
export declare const NetworkLockRequestSchema: z.ZodObject<{
    operation: z.ZodEnum<["status", "enable", "disable", "add_key", "remove_key", "list_keys"]>;
    publicKey: z.ZodOptional<z.ZodString>;
    keyId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    operation: "status" | "enable" | "disable" | "add_key" | "remove_key" | "list_keys";
    publicKey?: string | undefined;
    keyId?: string | undefined;
}, {
    operation: "status" | "enable" | "disable" | "add_key" | "remove_key" | "list_keys";
    publicKey?: string | undefined;
    keyId?: string | undefined;
}>;
export declare const SubnetRouterRequestSchema: z.ZodObject<{
    operation: z.ZodEnum<["list_routes", "advertise_routes", "accept_routes", "remove_routes"]>;
    deviceId: z.ZodOptional<z.ZodString>;
    routes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    operation: "list_routes" | "advertise_routes" | "accept_routes" | "remove_routes";
    deviceId?: string | undefined;
    routes?: string[] | undefined;
}, {
    operation: "list_routes" | "advertise_routes" | "accept_routes" | "remove_routes";
    deviceId?: string | undefined;
    routes?: string[] | undefined;
}>;
export declare const WebhookRequestSchema: z.ZodObject<{
    operation: z.ZodEnum<["list", "create", "delete", "test"]>;
    webhookId: z.ZodOptional<z.ZodString>;
    config: z.ZodOptional<z.ZodObject<{
        endpointUrl: z.ZodString;
        secret: z.ZodOptional<z.ZodString>;
        events: z.ZodArray<z.ZodString, "many">;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        endpointUrl: string;
        events: string[];
        description?: string | undefined;
        secret?: string | undefined;
    }, {
        endpointUrl: string;
        events: string[];
        description?: string | undefined;
        secret?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    operation: "delete" | "create" | "list" | "test";
    webhookId?: string | undefined;
    config?: {
        endpointUrl: string;
        events: string[];
        description?: string | undefined;
        secret?: string | undefined;
    } | undefined;
}, {
    operation: "delete" | "create" | "list" | "test";
    webhookId?: string | undefined;
    config?: {
        endpointUrl: string;
        events: string[];
        description?: string | undefined;
        secret?: string | undefined;
    } | undefined;
}>;
export declare const PolicyFileRequestSchema: z.ZodObject<{
    operation: z.ZodEnum<["get", "update", "test_access"]>;
    policy: z.ZodOptional<z.ZodString>;
    testRequest: z.ZodOptional<z.ZodObject<{
        src: z.ZodString;
        dst: z.ZodString;
        proto: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        src: string;
        dst: string;
        proto?: string | undefined;
    }, {
        src: string;
        dst: string;
        proto?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    operation: "get" | "update" | "test_access";
    policy?: string | undefined;
    testRequest?: {
        src: string;
        dst: string;
        proto?: string | undefined;
    } | undefined;
}, {
    operation: "get" | "update" | "test_access";
    policy?: string | undefined;
    testRequest?: {
        src: string;
        dst: string;
        proto?: string | undefined;
    } | undefined;
}>;
export type FileSharingRequest = z.infer<typeof FileSharingRequestSchema>;
export type ExitNodeRequest = z.infer<typeof ExitNodeRequestSchema>;
export type NetworkLockRequest = z.infer<typeof NetworkLockRequestSchema>;
export type SubnetRouterRequest = z.infer<typeof SubnetRouterRequestSchema>;
export type WebhookRequest = z.infer<typeof WebhookRequestSchema>;
export type PolicyFileRequest = z.infer<typeof PolicyFileRequestSchema>;
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