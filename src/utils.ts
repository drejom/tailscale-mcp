import type { CallToolResult } from "@modelcontextprotocol/sdk/types";
import { isAxiosError } from "axios";
import { logger } from "./logger";
import { CLIError, TailscaleError } from "./types";

export function getErrorMessage(error: unknown): string {
  if (error instanceof TailscaleError) {
    return error.message;
  }
  if (isAxiosError(error)) {
    return error.response?.data?.error || error.message;
  }
  if (error instanceof CLIError) {
    return error.stderr || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }

  logger.error("Unknown error:", error);
  return String(error);
}

export function returnToolSuccess(message: string): CallToolResult {
  return {
    content: [{ type: "text", text: message }],
  };
}

export function returnToolError(error: unknown): CallToolResult {
  const errorMessage = getErrorMessage(error);

  return {
    isError: true,
    content: [{ type: "text", text: errorMessage }],
  };
}
