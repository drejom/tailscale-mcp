import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // Base JavaScript configuration
  js.configs.recommended,

  // TypeScript configuration
  ...tseslint.configs.recommended,

  // Global configuration for TypeScript and JavaScript files
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      // Allow any types for now - can be tightened later
      "@typescript-eslint/no-explicit-any": "warn",
      // Allow unused vars with underscore prefix
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Allow require imports in config files
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  // Ignore patterns
  {
    ignores: [
      "dist/**/*",
      "coverage/**/*",
      "node_modules/**/*",
      "*.config.js",
      "*.config.ts",
      "jest.config*.ts",
      "esbuild.config.js",
      "scripts/**/*",
      "package-lock.json",
      "**/*.md",
      "**/*.json",
    ],
  },
);
