/**
 * Federated and contextual search tools registration
 *
 * Provides advanced search capabilities:
 * - contextual_search: Combined git + code search for a single repository
 * - federated_search: Search across multiple indexed repositories
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CodeIndexer } from "../code/indexer.js";
import type { CodeSearchResult } from "../code/types.js";
import type { GitHistoryIndexer } from "../git/indexer.js";
import type { GitSearchResult } from "../git/types.js";
export interface FederatedToolDependencies {
    codeIndexer: CodeIndexer;
    gitHistoryIndexer: GitHistoryIndexer;
}
/**
 * Links a code chunk to commits that modified the file
 */
export interface CodeCommitCorrelation {
    codeResult: CodeSearchResult;
    relatedCommits: Array<{
        shortHash: string;
        subject: string;
        author: string;
        date: string;
    }>;
}
/**
 * Combined code + git search results with correlations
 */
export interface ContextualSearchResult {
    codeResults: CodeSearchResult[];
    gitResults: GitSearchResult[];
    correlations: CodeCommitCorrelation[];
    metadata: {
        path: string;
        query: string;
        codeResultCount: number;
        gitResultCount: number;
        correlationCount: number;
    };
}
/**
 * Result with repository attribution
 */
export type FederatedResult = (CodeSearchResult & {
    resultType: "code";
    repoPath: string;
}) | (GitSearchResult & {
    resultType: "git";
    repoPath: string;
});
/**
 * Federated search response with results and metadata
 */
export interface FederatedSearchResponse {
    results: FederatedResult[];
    metadata: {
        query: string;
        searchType: "code" | "git" | "both";
        repositoriesSearched: string[];
        totalResults: number;
    };
}
/**
 * Build correlations between code results and git history
 * Links code chunks to commits that modified the same file
 */
export declare function buildCorrelations(codeResults: CodeSearchResult[], gitResults: GitSearchResult[]): CodeCommitCorrelation[];
/**
 * Check if two paths refer to the same file by comparing path segments from the end.
 * This handles relative vs absolute paths while avoiding false positives.
 *
 * Examples:
 * - "app/models/user.ts" vs "models/user.ts" → true (suffix match)
 * - "app/models/user.ts" vs "lib/user.ts" → false (different parent dir)
 * - "src/user.ts" vs "user.ts" → true (suffix match)
 */
export declare function pathsMatch(path1: string, path2: string): boolean;
/**
 * Normalize scores to [0, 1] range using min-max normalization
 */
export declare function normalizeScores<T extends {
    score: number;
}>(results: T[]): T[];
/**
 * Calculate Reciprocal Rank Fusion score
 * RRF formula: sum(1 / (k + rank)) where k=60 prevents high ranks from dominating
 */
export declare function calculateRRFScore(ranks: number[]): number;
/**
 * Register federated search tools on the MCP server
 */
export declare function registerFederatedTools(server: McpServer, deps: FederatedToolDependencies): void;
//# sourceMappingURL=federated.d.ts.map