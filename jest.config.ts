import type { Config } from "jest";
import baseConfig from "./jest.config.base";

/**
 * Main Jest configuration for running all tests.
 * Extends the base configuration with settings for running both unit and integration tests.
 */
export default async (): Promise<Config> => {
  return {
    ...baseConfig,
    silent: true,
    coverageDirectory: "coverage",
    // Include both src and test directories in roots
    roots: ["<rootDir>/src", "<rootDir>/src/__test__"],
    // Match all test files (unit and integration)
    testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  };
};
