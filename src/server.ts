import "dotenv/config";
import { createTailscaleAPI } from "./tailscale/index.js";
import { ToolRegistry } from "./tools/index.js";
import { StdioMCPServer, HttpMCPServer } from "./servers/index.js";
import { logger } from "./logger.js";

export type ServerMode = "stdio" | "http";

export class TailscaleMCPServer {
  private toolRegistry!: ToolRegistry;
  private stdioServer?: StdioMCPServer;
  private httpServer?: HttpMCPServer;

  constructor() {
    // Constructor is now lightweight - initialization happens in start()
  }

  async initialize(): Promise<void> {
    logger.info("Initializing Tailscale MCP Server...");

    // Initialize Tailscale integrations
    const api = createTailscaleAPI();

    // Create tool registry and register tool modules
    this.toolRegistry = new ToolRegistry({ api });
    await this.toolRegistry.loadTools();

    logger.info(`Loaded ${this.toolRegistry.getTools().length} tools`);
  }

  async start(mode: ServerMode = "stdio", port?: number): Promise<void> {
    await this.initialize();

    // Log server configuration
    logger.info(`Tailscale MCP Server starting in ${mode} mode...`);
    if (process.env.MCP_SERVER_LOG_FILE) {
      logger.info("File logging enabled");
    } else {
      logger.debug("File logging disabled (set MCP_SERVER_LOG_FILE to enable)");
    }

    if (mode === "http") {
      await this.startHttpServer(port);
    } else {
      await this.startStdioServer();
    }
  }

  private async startStdioServer(): Promise<void> {
    this.stdioServer = new StdioMCPServer(this.toolRegistry);
    await this.stdioServer.start();
  }

  private async startHttpServer(port: number = 3000): Promise<void> {
    this.httpServer = new HttpMCPServer(this.toolRegistry);
    await this.httpServer.start(port);
  }

  async stop(): Promise<void> {
    logger.info("Stopping Tailscale MCP Server...");

    if (this.stdioServer) {
      await this.stdioServer.stop();
      this.stdioServer = undefined;
    }

    if (this.httpServer) {
      await this.httpServer.stop();
      this.httpServer = undefined;
    }

    logger.info("Tailscale MCP Server stopped");
  }
}
