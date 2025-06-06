import type { Config } from "jest";

export default async (): Promise<Config> => {
  return {
    collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/index.ts"],
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov", "html"],
    extensionsToTreatAsEsm: [".ts"],
    preset: "ts-jest/presets/default-esm",
    roots: ["<rootDir>/src", "<rootDir>/src/__test__"],
    setupFilesAfterEnv: ["<rootDir>/src/__test__/setup.ts"],
    testEnvironment: "node",
    testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
    testTimeout: 5000,
    moduleNameMapper: {
      "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    transform: {
      "^.+\\.ts$": [
        "ts-jest",
        {
          useESM: true,
        },
      ],
    },
  };
};
