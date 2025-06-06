import { TailscaleCLIStatusSchema, TailscaleDeviceSchema } from "../src/types";

describe("Type Schemas", () => {
  describe("TailscaleCLIStatusSchema", () => {
    it("should validate a valid CLI status object", () => {
      const validStatus = {
        Version: "1.84.0",
        TUN: true,
        BackendState: "Running",
        AuthURL: "",
        TailscaleIPs: ["100.116.70.82"],
        Self: {
          ID: "test-id",
          PublicKey: "test-key",
          HostName: "test-host",
          DNSName: "test.tailnet.ts.net",
          OS: "darwin",
          UserID: 123,
          TailscaleIPs: ["100.116.70.82"],
        },
        Peer: {},
      };

      const result = TailscaleCLIStatusSchema.safeParse(validStatus);
      expect(result.success).toBe(true);
    });

    it("should reject invalid CLI status object", () => {
      const invalidStatus = {
        Version: "1.84.0",
        // Missing required fields
      };

      const result = TailscaleCLIStatusSchema.safeParse(invalidStatus);
      expect(result.success).toBe(false);
    });
  });

  describe("TailscaleDeviceSchema", () => {
    it("should validate a valid device object", () => {
      const validDevice = {
        id: "device-123",
        name: "test-device",
        hostname: "test-host",
        clientVersion: "1.84.0",
        os: "linux",
        addresses: ["100.71.164.75"],
        user: "test-user",
        created: "2024-01-01T00:00:00Z",
        lastSeen: "2024-01-01T12:00:00Z",
        authorized: true,
        isExternal: false,
        machineKey: "mkey:test",
        nodeKey: "nodekey:test",
        keyExpiryDisabled: false,
        expires: "2024-12-31T23:59:59Z",
        updateAvailable: false,
        blocksIncomingConnections: false,
      };

      const result = TailscaleDeviceSchema.safeParse(validDevice);
      expect(result.success).toBe(true);
    });

    it("should reject device object with missing required fields", () => {
      const invalidDevice = {
        id: "device-123",
        // Missing required fields like name, hostname, etc.
      };

      const result = TailscaleDeviceSchema.safeParse(invalidDevice);
      expect(result.success).toBe(false);
    });
  });
});
