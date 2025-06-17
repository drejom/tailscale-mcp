/** @type {import('jest').Config} */
export default {
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

  // Basic setup files
  setupFilesAfterEnv: ["<rootDir>/src/__test__/setup.ts"],

  // Default timeout
  testTimeout: 5000,

  // Coverage collection
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/index.ts"],

  // Only match unit tests, exclude integration and e2e tests
  testMatch: [
    "**/__tests__/**/*.ts",
    "**/?(*.)+(spec|test).ts",
    "!**/*.integration.test.ts", // Exclude integration tests
    "!**/*.e2e.test.ts", // Exclude end-to-end tests
  ],
};
