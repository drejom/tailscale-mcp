import type { CallToolResult, Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { TailscaleAPI } from "../tailscale/tailscale-api.js";
import { TailscaleCLI } from "../tailscale/tailscale-cli.js";

// Import all tool modules
import { logger } from "../logger.js";
import { aclTools } from "./acl-tools.js";
import { adminTools } from "./admin-tools.js";
import { deviceTools } from "./device-tools.js";
import { networkTools } from "./network-tools.js";

export interface ToolContext {
  api: TailscaleAPI;
  cli: TailscaleCLI;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: z.ZodSchema;
  handler: (args: any, context: ToolContext) => Promise<CallToolResult>;
}

export interface ToolModule {
  tools: ToolDefinition[];
}

// Tool registry
export class ToolRegistry {
  private tools = new Map<string, ToolDefinition>();
  private context: ToolContext;

  constructor(context: ToolContext) {
    this.context = context;
  }

  async loadTools(): Promise<void> {
    logger.info("Loading tools...");

    // Register all tool modules
    this.registerModule(deviceTools);
    this.registerModule(networkTools);
    this.registerModule(aclTools);
    this.registerModule(adminTools);

    logger.info(`Loaded ${this.tools.size} tools`);
  }

  register(tool: ToolDefinition): void {
    this.tools.set(tool.name, tool);
  }

  registerModule(module: ToolModule): void {
    for (const tool of module.tools) {
      this.register(tool);
    }
  }

  getTools(): Tool[] {
    return Array.from(this.tools.values()).map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: zodToJsonSchema(tool.inputSchema),
    }));
  }

  async callTool(name: string, args: any): Promise<CallToolResult> {
    const tool = this.tools.get(name);
    if (!tool) {
      return {
        content: [{ type: "text", text: `Unknown tool: ${name}` }],
        isError: true,
      };
    }

    try {
      const validatedArgs = tool.inputSchema.parse(args);
      return await tool.handler(validatedArgs, this.context);
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Tool error: ${error.message}` }],
        isError: true,
      };
    }
  }
}

// Helper function to convert Zod schema to JSON Schema
function zodToJsonSchema(schema: z.ZodSchema): any {
  // This is a simplified conversion - you might want to use a library like zod-to-json-schema
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    const properties: any = {};
    const required: string[] = [];

    for (const [key, value] of Object.entries(shape)) {
      const zodValue = value as z.ZodTypeAny;

      if (zodValue instanceof z.ZodString) {
        properties[key] = { type: "string" };
        if ((zodValue as any)._def.description) {
          properties[key].description = (zodValue as any)._def.description;
        }
      } else if (zodValue instanceof z.ZodNumber) {
        properties[key] = { type: "number" };
        if ((zodValue as any)._def.description) {
          properties[key].description = (zodValue as any)._def.description;
        }
      } else if (zodValue instanceof z.ZodBoolean) {
        properties[key] = { type: "boolean" };
        if ((zodValue as any)._def.description) {
          properties[key].description = (zodValue as any)._def.description;
        }
      } else if (zodValue instanceof z.ZodArray) {
        properties[key] = { type: "array", items: { type: "string" } };
        if ((zodValue as any)._def.description) {
          properties[key].description = (zodValue as any)._def.description;
        }
      } else if (zodValue instanceof z.ZodEnum) {
        properties[key] = {
          type: "string",
          enum: (zodValue as any)._def.values,
        };
        if ((zodValue as any)._def.description) {
          properties[key].description = (zodValue as any)._def.description;
        }
      }

      if (!zodValue.isOptional()) {
        required.push(key);
      }
    }

    return {
      type: "object",
      properties,
      required: required.length > 0 ? required : undefined,
    };
  }

  return { type: "object" };
}
