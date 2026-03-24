/**
 * Type definitions for git history indexing module
 */
/**
 * Commit type classification based on conventional commits
 */
export type CommitType = "feat" | "fix" | "refactor" | "docs" | "test" | "chore" | "style" | "perf" | "build" | "ci" | "revert" | "other";
/**
 * Configuration for git history indexing
 */
export interface GitConfig {
    maxCommits: number;
    includeFileList: boolean;
    includeDiff: boolean;
    maxDiffSize: number;
    gitTimeout: number;
    maxChunkSize: number;
    batchSize: number;
    batchRetryAttempts: number;
    defaultSearchLimit: number;
    enableHybridSearch: boolean;
}
/**
 * Raw commit data parsed from git log
 */
export interface RawCommit {
    hash: string;
    shortHash: string;
    author: string;
    authorEmail: string;
    date: Date;
    subject: string;
    body: string;
    files: string[];
    insertions: number;
    deletions: number;
}
/**
 * Embeddable chunk created from a commit
 */
export interface CommitChunk {
    content: string;
    metadata: {
        commitHash: string;
        shortHash: string;
        author: string;
        authorEmail: string;
        date: string;
        subject: string;
        commitType: CommitType;
        files: string[];
        insertions: number;
        deletions: number;
        repoPath: string;
    };
}
/**
 * Options for indexing git history
 */
export interface GitIndexOptions {
    forceReindex?: boolean;
    sinceDate?: string;
    maxCommits?: number;
}
/**
 * Statistics from indexing operation
 */
export interface GitIndexStats {
    commitsScanned: number;
    commitsIndexed: number;
    chunksCreated: number;
    durationMs: number;
    status: "completed" | "partial" | "failed";
    errors?: string[];
}
/**
 * Statistics from incremental update operation
 */
export interface GitChangeStats {
    newCommits: number;
    chunksAdded: number;
    durationMs: number;
}
/**
 * Search result from git history
 */
export interface GitSearchResult {
    content: string;
    commitHash: string;
    shortHash: string;
    author: string;
    date: string;
    subject: string;
    commitType: CommitType;
    files: string[];
    score: number;
}
/**
 * Search options for git history
 */
export interface GitSearchOptions {
    limit?: number;
    useHybrid?: boolean;
    commitTypes?: CommitType[];
    authors?: string[];
    dateFrom?: string;
    dateTo?: string;
    scoreThreshold?: number;
}
/**
 * Indexing status for a repository
 */
export type GitIndexingStatus = "not_indexed" | "indexing" | "indexed";
/**
 * Status information for a git history index
 */
export interface GitIndexStatus {
    /** @deprecated Use `status` instead. True only when status is 'indexed'. */
    isIndexed: boolean;
    /** Current indexing status: 'not_indexed', 'indexing', or 'indexed' */
    status: GitIndexingStatus;
    collectionName?: string;
    commitsCount?: number;
    chunksCount?: number;
    lastCommitHash?: string;
    lastIndexedAt?: Date;
}
/**
 * Progress callback for indexing operations
 */
export type GitProgressCallback = (progress: GitProgressUpdate) => void;
/**
 * Progress update during indexing
 */
export interface GitProgressUpdate {
    phase: "extracting" | "chunking" | "embedding" | "storing";
    current: number;
    total: number;
    percentage: number;
    message: string;
}
/**
 * Snapshot for tracking last indexed commit
 */
export interface GitSnapshot {
    repoPath: string;
    lastCommitHash: string;
    lastIndexedAt: number;
    commitsIndexed: number;
}
/**
 * Options for extracting commits from git
 */
export interface GitExtractOptions {
    sinceCommit?: string;
    sinceDate?: string;
    maxCommits?: number;
}
//# sourceMappingURL=types.d.ts.map