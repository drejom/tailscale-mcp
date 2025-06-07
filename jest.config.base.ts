import type { Config } from "jest";

/**
 * Base Jest configuration containing common settings shared across all test configurations.
 * This configuration is extended by specific test configurations (unit, integration, etc.)
 * to avoid duplication and ensure consistency.
 */
const baseConfig: Config = {
  // TypeScript and ESM support
  extensionsToTreatAsEsm: [".ts"],
  preset: "ts-jest/presets/default-esm",

  // Test environment
  testEnvironment: "node",

  // Coverage configuration
  coverageReporters: ["text", "lcov", "html"],

  // Module resolution
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  // TypeScript transformation
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },

  // Common roots
  roots: ["<rootDir>/src"],

  // Basic setup files (can be extended by specific configs)
  setupFilesAfterEnv: ["<rootDir>/src/__test__/setup.ts"],

  // Default timeout (can be overridden)
  testTimeout: 5000,

  // Base coverage collection (can be extended/overridden)
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/index.ts"],
};

export default baseConfig;
