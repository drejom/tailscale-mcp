import "dotenv/config";
import { TailscaleMCPServer, ServerMode } from "./server.js";
import { logger } from "./logger.js";
import { fileURLToPath } from "node:url";

async function main() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    let mode: ServerMode = "stdio";
    let port = 3000;

    // Check for --http flag
    if (args.includes("--http")) {
      mode = "http";

      // Check for --port flag
      const portIndex = args.indexOf("--port");
      if (portIndex !== -1 && args[portIndex + 1]) {
        const parsedPort = parseInt(args[portIndex + 1], 10);
        if (!isNaN(parsedPort) && parsedPort >= 1 && parsedPort <= 65535) {
          port = parsedPort;
        } else {
          console.error(
            `Invalid port number: ${
              args[portIndex + 1]
            }. Port must be between 1 and 65535.`
          );
          process.exit(1);
        }
      }
    }

    // Check for --help flag
    if (args.includes("--help") || args.includes("-h")) {
      console.log(`
Tailscale MCP Server

Usage:
  tailscale-mcp-server [options]

Options:
  --http              Start in HTTP mode (default: stdio mode)
  --port <number>     Port for HTTP mode (default: 3000)
  --help, -h          Show this help message

Examples:
  tailscale-mcp-server                    # Start in stdio mode (for MCP clients)
  tailscale-mcp-server --http             # Start HTTP server on port 3000
  tailscale-mcp-server --http --port 8080 # Start HTTP server on port 8080
      `);
      process.exit(0);
    }

    logger.info("Starting Tailscale MCP Server...");
    const server = new TailscaleMCPServer();
    await server.start(mode, port);
  } catch (error) {
    logger.error("Failed to start server:", error);
    await gracefulShutdown(1);
  }
}

async function gracefulShutdown(exitCode: number = 0): Promise<void> {
  try {
    logger.info("Flushing logs before shutdown...");
    await logger.flush();
    await logger.close();
  } catch (error) {
    console.error("Error during graceful shutdown:", error);
  } finally {
    process.exit(exitCode);
  }
}

process.on("unhandledRejection", async (err) => {
  logger.error("Unhandled rejection:", err);
  await gracefulShutdown(1);
});

// Handle graceful shutdown
process.on("SIGINT", async () => {
  logger.info("Received SIGINT, shutting down gracefully...");
  await gracefulShutdown(0);
});

process.on("SIGTERM", async () => {
  logger.info("Received SIGTERM, shutting down gracefully...");
  await gracefulShutdown(0);
});

// Check if this file is being run directly (works in both ESM and CJS)
const isMainModule = (() => {
  try {
    // ESM check
    if (import.meta.url) {
      return process.argv[1] === fileURLToPath(import.meta.url);
    }
  } catch {
    // CJS fallback - this will be handled by the build process
    return true; // In CJS build, we always want to run main
  }
  return false;
})();

if (isMainModule) {
  main().catch(async (error) => {
    logger.error("Unhandled error:", error);
    await gracefulShutdown(1);
  });
}
