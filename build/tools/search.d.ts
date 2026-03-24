/**
 * Search tools registration
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { EmbeddingProvider } from "../embeddings/base.js";
import type { QdrantManager } from "../qdrant/client.js";
export interface SearchToolDependencies {
    qdrant: QdrantManager;
    embeddings: EmbeddingProvider;
}
export declare function registerSearchTools(server: McpServer, deps: SearchToolDependencies): void;
//# sourceMappingURL=search.d.ts.map