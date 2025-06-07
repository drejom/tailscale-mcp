import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { logger } from "../logger.js";
import { ToolRegistry } from "../tools/index.js";

export class StdioMCPServer {
  private server: Server;
  private toolRegistry: ToolRegistry;
  private keepAliveInterval?: NodeJS.Timeout;

  constructor(toolRegistry: ToolRegistry) {
    this.toolRegistry = toolRegistry;
    this.server = new Server(
      {
        name: "tailscale-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.toolRegistry.getTools(),
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      return await this.toolRegistry.callTool(name, args || {});
    });
  }

  async start(): Promise<void> {
    logger.info("Starting stdio MCP server...");

    const transport = new StdioServerTransport();
    try {
      await this.server.connect(transport);
    } catch (error) {
      logger.error("Failed to connect server to stdio transport:", error);
      throw error;
    }

    // Keep the process alive - MCP servers need to stay running to receive messages
    // Use interval-based keepalive to avoid interfering with MCP transport's stdin handling
    logger.debug("Setting up keepalive mechanism for stdio MCP server");
    this.keepAliveInterval = setInterval(() => {
      logger.debug("Stdio MCP Server keepalive heartbeat");
    }, 30000); // 30 second heartbeat

    // Handle process termination gracefully
    const cleanup = async () => {
      logger.info("Stdio MCP Server shutting down...");
      await this.stop();
      process.exit(0);
    };

    process.on("SIGINT", cleanup);
    process.on("SIGTERM", cleanup);

    logger.info(
      "Stdio MCP Server started successfully and listening for MCP messages"
    );
  }

  async stop(): Promise<void> {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = undefined;
    }
    logger.debug("Stdio MCP Server stopped");
  }
}
