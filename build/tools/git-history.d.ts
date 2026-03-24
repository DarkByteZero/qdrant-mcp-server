/**
 * Git history indexing tools registration
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GitHistoryIndexer } from "../git/indexer.js";
export interface GitHistoryToolDependencies {
    gitHistoryIndexer: GitHistoryIndexer;
}
export declare function registerGitHistoryTools(server: McpServer, deps: GitHistoryToolDependencies): void;
//# sourceMappingURL=git-history.d.ts.map