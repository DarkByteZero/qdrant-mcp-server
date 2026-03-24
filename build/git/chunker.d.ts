/**
 * CommitChunker - Create embeddable chunks from git commits
 */
import type { CommitChunk, CommitType, GitConfig, RawCommit } from "./types.js";
export declare class CommitChunker {
    private config;
    constructor(config: GitConfig);
    /**
     * Classify commit type based on commit message
     */
    classifyCommitType(commit: RawCommit): CommitType;
    /**
     * Create embeddable chunks from a commit
     * Currently produces one chunk per commit, but could be extended
     * to handle very large commits differently
     */
    createChunks(commit: RawCommit, repoPath: string, diff?: string): CommitChunk[];
    /**
     * Generate deterministic chunk ID from commit content
     */
    generateChunkId(chunk: CommitChunk): string;
    /**
     * Format the chunk content for embedding
     */
    private formatChunkContent;
    /**
     * Extract a readable preview from the diff
     */
    private extractDiffPreview;
    /**
     * Truncate content while preserving essential information
     */
    private truncateContent;
    /**
     * Create metadata object for a chunk
     */
    private createMetadata;
}
//# sourceMappingURL=chunker.d.ts.map