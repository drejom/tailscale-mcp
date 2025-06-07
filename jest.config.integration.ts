import type { Config } from "jest";
import baseConfig from "./jest.config.base";

/**
 * Jest configuration for integration tests only.
 * Extends the base configuration with integration-test-specific settings.
 * Includes longer timeouts and serial execution to avoid conflicts.
 */
export default async (): Promise<Config> => {
  return {
    ...baseConfig,
    silent: true,
    displayName: "Integration Tests",
    coverageDirectory: "coverage/integration",
    // Extend setup files to include integration-specific setup
    setupFilesAfterEnv: [
      ...baseConfig.setupFilesAfterEnv!,
      "<rootDir>/src/__test__/setup.integration.ts",
    ],
    // Only match integration and e2e tests
    testMatch: [
      "**/*.integration.test.ts", // Only integration tests
      "**/*.e2e.test.ts", // End-to-end tests
    ],
    // Longer timeout for integration tests
    testTimeout: 30000,
    // Run tests serially to avoid conflicts with Tailscale state
    maxWorkers: 1,
  };
};
