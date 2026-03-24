/**
 * Document operation tools registration
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { EmbeddingProvider } from "../embeddings/base.js";
import type { QdrantManager } from "../qdrant/client.js";
export interface DocumentToolDependencies {
    qdrant: QdrantManager;
    embeddings: EmbeddingProvider;
}
export declare function registerDocumentTools(server: McpServer, deps: DocumentToolDependencies): void;
//# sourceMappingURL=document.d.ts.map