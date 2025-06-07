import { TailscaleMCPCLI } from "./cli.js";

async function main() {
  const cli = new TailscaleMCPCLI();
  cli.setupSignalHandlers();
  await cli.run();
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
