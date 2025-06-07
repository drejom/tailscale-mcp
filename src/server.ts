import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import express from "express";
import { randomUUID } from "node:crypto";

import { createTailscaleAPI } from "./tailscale/index.js";
import { ToolRegistry } from "./tools/index.js";
import { logger } from "./logger.js";

export type ServerMode = "stdio" | "http";

export class TailscaleMCPServer {
  private server: Server;
  private toolRegistry!: ToolRegistry;
  private httpServer?: any;

  constructor() {
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

  async initialize(): Promise<void> {
    // Initialize Tailscale integrations
    const api = createTailscaleAPI();
    // const cli = new TailscaleCLI();

    // Create tool registry and register tool modules
    this.toolRegistry = new ToolRegistry({ api });
    await this.toolRegistry.loadTools();
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

  async start(mode: ServerMode = "stdio", port: number = 3000): Promise<void> {
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

    logger.info(
      `Tailscale MCP Server started successfully and listening for MCP messages (${mode} mode)`
    );
  }

  private async startStdioServer(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    // Keep the process alive - MCP servers need to stay running to receive messages
    // Use interval-based keepalive to avoid interfering with MCP transport's stdin handling
    logger.debug("Setting up keepalive mechanism for MCP server");
    const keepAliveInterval = setInterval(() => {
      logger.debug("MCP Server keepalive heartbeat");
    }, 30000); // 30 second heartbeat

    // Store interval reference for cleanup
    process.on("exit", () => {
      clearInterval(keepAliveInterval);
    });

    // Handle process termination gracefully
    const cleanup = () => {
      logger.info("MCP Server shutting down...");
      process.exit(0);
    };

    process.on("SIGINT", cleanup);
    process.on("SIGTERM", cleanup);
  }

  private async startHttpServer(port: number): Promise<void> {
    const app = express();

    // Enable JSON parsing
    app.use(express.json());

    // Add CORS headers for testing
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      if (req.method === "OPTIONS") {
        res.sendStatus(200);
      } else {
        next();
      }
    });

    // Add a simple health check endpoint
    app.get("/health", (req, res) => {
      res.json({
        status: "healthy",
        server: "tailscale-mcp-server",
        mode: "http",
        tools: this.toolRegistry.getTools().length,
      });
    });

    // Add a tools listing endpoint
    app.get("/tools", (req, res) => {
      res.json({ tools: this.toolRegistry.getTools() });
    });

    // Map to store transports by session ID
    const transports: { [sessionId: string]: StreamableHTTPServerTransport } =
      {};

    // MCP POST endpoint handler
    const mcpPostHandler = async (req: any, res: any) => {
      try {
        // Check for existing session ID
        const sessionId = req.headers["mcp-session-id"] as string;
        let transport: StreamableHTTPServerTransport;

        if (sessionId && transports[sessionId]) {
          // Reuse existing transport
          transport = transports[sessionId];
        } else if (!sessionId) {
          // New session - create new transport
          transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID(),
            onsessioninitialized: (sessionId: string) => {
              logger.debug(`Session initialized with ID: ${sessionId}`);
              transports[sessionId] = transport;
            },
          });

          // Set up onclose handler to clean up transport when closed
          transport.onclose = () => {
            const sid = transport.sessionId;
            if (sid && transports[sid]) {
              logger.debug(
                `Transport closed for session ${sid}, removing from transports map`
              );
              delete transports[sid];
            }
          };

          // Connect the server to this transport
          await this.server.connect(transport);
        } else {
          res.status(400).send("Invalid session ID");
          return;
        }

        // Handle the request
        await transport.handleRequest(req, res);
      } catch (error) {
        logger.error("Error handling MCP request:", error);
        res.status(500).send("Internal server error");
      }
    };

    // MCP GET endpoint handler (for SSE streams)
    const mcpGetHandler = async (req: any, res: any) => {
      const sessionId = req.headers["mcp-session-id"];
      if (!sessionId || !transports[sessionId]) {
        res.status(400).send("Invalid or missing session ID");
        return;
      }

      const transport = transports[sessionId];
      await transport.handleRequest(req, res);
    };

    // Set up MCP endpoints
    app.post("/mcp", mcpPostHandler);
    app.get("/mcp", mcpGetHandler);

    // Start the HTTP server
    this.httpServer = app.listen(port, () => {
      logger.info(`HTTP server listening on port ${port}`);
      logger.info(`Health check: http://localhost:${port}/health`);
      logger.info(`Tools list: http://localhost:${port}/tools`);
      logger.info(`MCP endpoint: http://localhost:${port}/mcp`);
    });

    // Handle process termination gracefully
    const cleanup = () => {
      logger.info("HTTP MCP Server shutting down...");
      if (this.httpServer) {
        this.httpServer.close(() => {
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    };

    process.on("SIGINT", cleanup);
    process.on("SIGTERM", cleanup);
  }
}

// For backwards compatibility and easy testing
export async function startServer(): Promise<void> {
  const server = new TailscaleMCPServer();
  await server.start();
}
