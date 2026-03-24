/**
 * CodeIndexer - Main orchestrator for code vectorization
 */
import type { EmbeddingProvider } from "../embeddings/base.js";
import type { QdrantManager } from "../qdrant/client.js";
import type { ChangeStats, CodeConfig, CodeSearchResult, IndexOptions, IndexStats, IndexStatus, ProgressCallback, SearchOptions } from "./types.js";
export declare class CodeIndexer {
    private qdrant;
    private embeddings;
    private config;
    private log;
    constructor(qdrant: QdrantManager, embeddings: EmbeddingProvider, config: CodeConfig);
    /**
     * Validate that a path doesn't attempt directory traversal
     * @throws Error if path traversal is detected
     */
    private validatePath;
    /**
     * Index a codebase from scratch or force re-index
     */
    indexCodebase(path: string, options?: IndexOptions, progressCallback?: ProgressCallback): Promise<IndexStats>;
    /**
     * Store an indexing status marker in the collection.
     * Called at the start of indexing with complete=false, and at the end with complete=true.
     */
    private storeIndexingMarker;
    /**
     * Search code semantically
     */
    searchCode(path: string, query: string, options?: SearchOptions): Promise<CodeSearchResult[]>;
    /**
     * Get indexing status for a codebase
     */
    getIndexStatus(path: string): Promise<IndexStatus>;
    /**
     * Incrementally re-index only changed files
     */
    reindexChanges(path: string, progressCallback?: ProgressCallback): Promise<ChangeStats>;
    /**
     * Clear all indexed data for a codebase
     */
    clearIndex(path: string): Promise<void>;
    /**
     * Generate deterministic collection name from codebase path.
     * Uses git remote URL for consistent naming across machines, with fallback to directory name.
     */
    private getCollectionName;
}
//# sourceMappingURL=indexer.d.ts.map