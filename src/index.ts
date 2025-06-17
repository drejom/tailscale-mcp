import { TailscaleMCPCLI } from "./cli.js";
import { logger } from "./logger.js";

async function main() {
  logger.info("Starting Tailscale MCP Server...");
  const cli = new TailscaleMCPCLI();
  await cli.run();
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
