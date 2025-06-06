import { build } from "esbuild";
import { readFileSync } from "fs";

// Read package.json to get dependencies
let dependencies = [];
try {
  const packageJson = JSON.parse(readFileSync("./package.json", "utf8"));
  dependencies = Object.keys(packageJson.dependencies || {});
} catch (error) {
  console.warn(
    "Warning: Could not read package.json dependencies:",
    error.message
  );
  dependencies = [];
}

const baseConfig = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node18",
  format: "esm",
  outfile: "dist/index.js",
  sourcemap: true,
  minify: false,
  // External dependencies (don't bundle them)
  external: dependencies,
  // Handle TypeScript path mapping
  resolveExtensions: [".ts", ".js"],
  // Preserve JSX and other settings
  jsx: "preserve",
  // Define environment
  // NODE_ENV defined in specific configs
  // Banner to add shebang for executable
  banner: {
    js: "#!/usr/bin/env node\n// Tailscale MCP Server - Built with esbuild",
  },
};

// Development config
export const devConfig = {
  ...baseConfig,
  minify: false,
  sourcemap: true,
  define: {
    "process.env.NODE_ENV": '"development"',
  },
};

// Production config
export const prodConfig = {
  ...baseConfig,
  minify: true,
  sourcemap: false,
  define: {
    "process.env.NODE_ENV": '"production"',
  },
};

// Watch config
export const watchConfig = {
  ...devConfig,
  watch: {
    onRebuild(error, result) {
      if (error) {
        console.error("❌ Build failed:", error);
      } else {
        console.log("✅ Build succeeded");
      }
    },
  },
};

// Build function
export async function buildProject(config = prodConfig) {
  try {
    const result = await build(config);
    console.log("✅ Build completed successfully");

    // Make the output executable
    if (config === prodConfig || config === devConfig) {
      const { chmodSync } = await import("fs");
      try {
        chmodSync("dist/index.js", 0o755);
        console.log("✅ Made output executable");
      } catch (error) {
        console.warn("⚠️ Could not make output executable:", error.message);
      }
    }

    return result;
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

// CLI handling
if (import.meta.url === `file://${process.argv[1]}`) {
  const mode = process.argv[2] || "build";

  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log("Usage: node esbuild.config.js [mode]");
    console.log("Modes: dev, watch, build (default)");
    process.exit(0);
  }

  switch (mode) {
    case "dev":
      await buildProject(devConfig);
      break;
    case "watch":
      await buildProject(watchConfig);
      break;
    case "build":
    default:
      await buildProject(prodConfig);
      break;
  }
}
