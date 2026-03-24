/**
 * Tool registration orchestrator
 */
import { registerCodeTools } from "./code.js";
import { registerCollectionTools } from "./collection.js";
import { registerDocumentTools } from "./document.js";
import { registerFederatedTools } from "./federated.js";
import { registerGitHistoryTools } from "./git-history.js";
import { registerSearchTools } from "./search.js";
/**
 * Register all MCP tools on the server
 */
export function registerAllTools(server, deps) {
    registerCollectionTools(server, {
        qdrant: deps.qdrant,
        embeddings: deps.embeddings,
    });
    registerDocumentTools(server, {
        qdrant: deps.qdrant,
        embeddings: deps.embeddings,
    });
    registerSearchTools(server, {
        qdrant: deps.qdrant,
        embeddings: deps.embeddings,
    });
    registerCodeTools(server, {
        codeIndexer: deps.codeIndexer,
    });
    registerGitHistoryTools(server, {
        gitHistoryIndexer: deps.gitHistoryIndexer,
    });
    registerFederatedTools(server, {
        codeIndexer: deps.codeIndexer,
        gitHistoryIndexer: deps.gitHistoryIndexer,
    });
}
// Re-export schemas for external use
export * from "./schemas.js";
//# sourceMappingURL=index.js.map