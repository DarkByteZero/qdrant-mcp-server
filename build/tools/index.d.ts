/**
 * Tool registration orchestrator
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CodeIndexer } from "../code/indexer.js";
import type { EmbeddingProvider } from "../embeddings/base.js";
import type { GitHistoryIndexer } from "../git/indexer.js";
import type { QdrantManager } from "../qdrant/client.js";
export interface ToolDependencies {
    qdrant: QdrantManager;
    embeddings: EmbeddingProvider;
    codeIndexer: CodeIndexer;
    gitHistoryIndexer: GitHistoryIndexer;
}
/**
 * Register all MCP tools on the server
 */
export declare function registerAllTools(server: McpServer, deps: ToolDependencies): void;
export * from "./schemas.js";
//# sourceMappingURL=index.d.ts.map