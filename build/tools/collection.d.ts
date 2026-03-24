/**
 * Collection management tools registration
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { EmbeddingProvider } from "../embeddings/base.js";
import type { QdrantManager } from "../qdrant/client.js";
export interface CollectionToolDependencies {
    qdrant: QdrantManager;
    embeddings: EmbeddingProvider;
}
export declare function registerCollectionTools(server: McpServer, deps: CollectionToolDependencies): void;
//# sourceMappingURL=collection.d.ts.map