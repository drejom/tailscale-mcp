import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import express from "express";
import { randomUUID, createHash } from "node:crypto";
import * as http from "node:http";

import { createTailscaleAPI } from "./tailscale/index.js";
import { ToolRegistry } from "./tools/index.js";
import { logger } from "./logger.js";

export type ServerMode = "stdio" | "http";

interface SessionInfo {
  transport: StreamableHTTPServerTransport;
  authToken: string;
  createdAt: Date;
  lastAccessed: Date;
  clientInfo?: {
    userAgent?: string;
    ip?: string;
  };
}

export class TailscaleMCPServer {
  private server: Server;
  private toolRegistry!: ToolRegistry;
  private httpServer?: http.Server;

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
      const allowedOrigin =
        process.env.NODE_ENV === "production"
          ? process.env.CORS_ORIGIN || "http://localhost:3000"
          : "*";

      res.header("Access-Control-Allow-Origin", allowedOrigin);
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, mcp-session-id"
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

    // Add session info endpoint for debugging (development only)
    app.get("/sessions", (req, res) => {
      if (process.env.NODE_ENV === "production") {
        res.status(404).json({ error: "Not found" });
        return;
      }

      const sessionSummary = Object.keys(sessions).map((sessionId) => ({
        sessionId,
        createdAt: sessions[sessionId].createdAt,
        lastAccessed: sessions[sessionId].lastAccessed,
        clientInfo: sessions[sessionId].clientInfo,
      }));

      res.json({
        activeSessions: sessionSummary.length,
        sessions: sessionSummary,
      });
    });

    // Secure session management with authentication
    const sessions: { [sessionId: string]: SessionInfo } = {};

    // Generate a secure authentication token
    const generateAuthToken = (): string => {
      return createHash("sha256")
        .update(randomUUID() + Date.now() + Math.random())
        .digest("hex");
    };

    // Validate session ownership
    const validateSession = (
      sessionId: string,
      authToken: string,
      clientIp?: string
    ): SessionInfo | null => {
      const session = sessions[sessionId];
      if (!session) {
        logger.warn(
          `Session validation failed: Session ${sessionId} not found`
        );
        return null;
      }

      if (session.authToken !== authToken) {
        logger.warn(
          `Session validation failed: Invalid auth token for session ${sessionId} from IP ${clientIp}`
        );
        return null;
      }

      // Update last accessed time
      session.lastAccessed = new Date();

      // Optional: Validate client IP consistency (can be disabled for development)
      if (
        process.env.NODE_ENV === "production" &&
        session.clientInfo?.ip &&
        clientIp &&
        session.clientInfo.ip !== clientIp
      ) {
        logger.warn(
          `Session validation failed: IP mismatch for session ${sessionId}. Expected ${session.clientInfo.ip}, got ${clientIp}`
        );
        return null;
      }

      return session;
    };

    // Clean up expired sessions (older than 1 hour)
    const cleanupExpiredSessions = () => {
      const now = new Date();
      const expiredThreshold = 60 * 60 * 1000; // 1 hour

      Object.keys(sessions).forEach((sessionId) => {
        const session = sessions[sessionId];
        if (now.getTime() - session.lastAccessed.getTime() > expiredThreshold) {
          logger.debug(`Cleaning up expired session: ${sessionId}`);
          delete sessions[sessionId];
        }
      });
    };

    // Run cleanup every 15 minutes
    const cleanupInterval = setInterval(cleanupExpiredSessions, 15 * 60 * 1000);

    // MCP POST endpoint handler with secure session management
    const mcpPostHandler = async (
      req: express.Request,
      res: express.Response
    ) => {
      try {
        const sessionId = req.headers["mcp-session-id"] as string;
        const authToken = req.headers["authorization"]?.replace(
          "Bearer ",
          ""
        ) as string;
        const clientIp = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers["user-agent"];

        let sessionInfo: SessionInfo;

        if (sessionId && authToken) {
          // Validate existing session
          const validatedSession = validateSession(
            sessionId,
            authToken,
            clientIp
          );
          if (!validatedSession) {
            res.status(401).json({
              error: "Invalid session or authentication token",
              code: "INVALID_SESSION",
            });
            return;
          }
          sessionInfo = validatedSession;
        } else if (!sessionId && !authToken) {
          // Create new session with authentication
          const newAuthToken = generateAuthToken();
          const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID(),
            onsessioninitialized: (newSessionId: string) => {
              logger.info(
                `New authenticated session initialized: ${newSessionId} from IP ${clientIp}`
              );

              sessionInfo = {
                transport,
                authToken: newAuthToken,
                createdAt: new Date(),
                lastAccessed: new Date(),
                clientInfo: {
                  userAgent,
                  ip: clientIp,
                },
              };

              sessions[newSessionId] = sessionInfo;

              // Send authentication token to client
              res.setHeader("X-Auth-Token", newAuthToken);
              res.setHeader("X-Session-ID", newSessionId);
            },
          });

          // Set up onclose handler to clean up session when transport closes
          transport.onclose = () => {
            const sid = transport.sessionId;
            if (sid && sessions[sid]) {
              logger.debug(
                `Transport closed for session ${sid}, removing from sessions`
              );
              delete sessions[sid];
            }
          };

          // Connect the server to this transport
          await this.server.connect(transport);

          // Store session info temporarily (will be updated in onsessioninitialized)
          sessionInfo = {
            transport,
            authToken: newAuthToken,
            createdAt: new Date(),
            lastAccessed: new Date(),
            clientInfo: { userAgent, ip: clientIp },
          };
        } else {
          // Missing either session ID or auth token
          res.status(400).json({
            error:
              "Both session ID and authorization token are required for existing sessions",
            code: "MISSING_CREDENTIALS",
          });
          return;
        }

        // Handle the request with the validated session
        await sessionInfo.transport.handleRequest(req, res);
      } catch (error) {
        logger.error("Error handling MCP request:", error);
        res.status(500).json({
          error: "Internal server error",
          code: "INTERNAL_ERROR",
        });
      }
    };

    // MCP GET endpoint handler (for SSE streams) with secure session validation
    const mcpGetHandler = async (
      req: express.Request,
      res: express.Response
    ) => {
      try {
        const sessionId = req.headers["mcp-session-id"] as string;
        const authToken = req.headers["authorization"]?.replace(
          "Bearer ",
          ""
        ) as string;
        const clientIp = req.ip || req.connection.remoteAddress;

        if (!sessionId || !authToken) {
          res.status(400).json({
            error: "Session ID and authorization token are required",
            code: "MISSING_CREDENTIALS",
          });
          return;
        }

        // Validate session ownership
        const sessionInfo = validateSession(sessionId, authToken, clientIp);
        if (!sessionInfo) {
          res.status(401).json({
            error: "Invalid session or authentication token",
            code: "INVALID_SESSION",
          });
          return;
        }

        // Handle the SSE request with the validated session
        await sessionInfo.transport.handleRequest(req, res);
      } catch (error) {
        logger.error("Error handling MCP GET request:", error);
        res.status(500).json({
          error: "Internal server error",
          code: "INTERNAL_ERROR",
        });
      }
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

      // Clear the session cleanup interval
      clearInterval(cleanupInterval);

      // Clean up all active sessions
      Object.keys(sessions).forEach((sessionId) => {
        logger.debug(`Cleaning up session on shutdown: ${sessionId}`);
        delete sessions[sessionId];
      });

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
