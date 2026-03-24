/**
 * Code indexing tools registration
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CodeIndexer } from "../code/indexer.js";
export interface CodeToolDependencies {
    codeIndexer: CodeIndexer;
}
export declare function registerCodeTools(server: McpServer, deps: CodeToolDependencies): void;
//# sourceMappingURL=code.d.ts.map