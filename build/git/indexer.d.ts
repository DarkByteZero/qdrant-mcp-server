/**
 * GitHistoryIndexer - Main orchestrator for git history indexing
 */
import type { EmbeddingProvider } from "../embeddings/base.js";
import type { QdrantManager } from "../qdrant/client.js";
import type { GitChangeStats, GitConfig, GitIndexOptions, GitIndexStats, GitIndexStatus, GitProgressCallback, GitSearchOptions, GitSearchResult } from "./types.js";
export declare class GitHistoryIndexer {
    private qdrant;
    private embeddings;
    private config;
    private log;
    constructor(qdrant: QdrantManager, embeddings: EmbeddingProvider, config: GitConfig);
    /**
     * Validate that a path doesn't attempt directory traversal
     */
    private validatePath;
    /**
     * Index git history for a repository
     */
    indexHistory(path: string, options?: GitIndexOptions, progressCallback?: GitProgressCallback): Promise<GitIndexStats>;
    /**
     * Search indexed git history
     */
    searchHistory(path: string, query: string, options?: GitSearchOptions): Promise<GitSearchResult[]>;
    /**
     * Get indexing status for a repository
     */
    getIndexStatus(path: string): Promise<GitIndexStatus>;
    /**
     * Index only new commits since last indexing
     */
    indexNewCommits(path: string, progressCallback?: GitProgressCallback): Promise<GitChangeStats>;
    /**
     * Clear all indexed data for a repository
     */
    clearIndex(path: string): Promise<void>;
    /**
     * Store indexing status marker in the collection
     */
    private storeIndexingMarker;
    /**
     * Build search filter from options
     */
    private buildSearchFilter;
    /**
     * Generate deterministic collection name from repository path.
     * Uses git remote URL for consistent naming across machines, with fallback to full path.
     */
    private getCollectionName;
}
//# sourceMappingURL=indexer.d.ts.map