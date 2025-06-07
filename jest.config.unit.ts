import type { Config } from "jest";
import baseConfig from "./jest.config.base";

/**
 * Jest configuration for unit tests only.
 * Extends the base configuration with unit-test-specific settings.
 * Excludes integration and e2e tests for faster execution.
 */
export default async (): Promise<Config> => {
  return {
    ...baseConfig,
    displayName: "Unit Tests",
    // Extend base coverage collection to exclude integration test files
    collectCoverageFrom: [
      ...baseConfig.collectCoverageFrom!,
      "!src/**/*.integration.test.ts",
      "!src/**/*.e2e.test.ts",
      "!src/__test__/setup.integration.ts",
    ],
    coverageDirectory: "coverage/unit",
    // Only match unit tests, exclude integration and e2e tests
    testMatch: [
      "**/__tests__/**/*.ts",
      "**/?(*.)+(spec|test).ts",
      "!**/*.integration.test.ts", // Exclude integration tests
      "!**/*.e2e.test.ts", // Exclude end-to-end tests
    ],
  };
};
