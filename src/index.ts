import { startServer } from "./server.js";
import { logger } from "./logger.js";

async function main() {
  try {
    logger.info("Starting Tailscale MCP Server...");
    await startServer();
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  logger.info("Received SIGINT, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  logger.info("Received SIGTERM, shutting down gracefully...");
  process.exit(0);
});

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    logger.error("Unhandled error:", error);
    process.exit(1);
  });
}
