/**
 * Tool handler logging wrapper
 *
 * Provides standardized completion, error, and warning logging
 * for all MCP tool handlers.
 */
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
/**
 * Wraps a tool handler with standardized logging:
 * - Logs "Tool completed" at info level with durationMs on success
 * - Logs "Tool failed" at error level when result has isError: true
 * - Logs "Tool completed with no results" at warn level for search tools
 * - Logs "Tool threw an error" at error level when handler throws (re-throws)
 */
export declare function withToolLogging<T extends (...args: any[]) => Promise<CallToolResult>>(toolName: string, handler: T): T;
//# sourceMappingURL=logging.d.ts.map