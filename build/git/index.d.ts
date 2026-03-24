/**
 * Git history indexing module - barrel export
 */
export type { CommitChunk, CommitType, GitChangeStats, GitConfig, GitExtractOptions, GitIndexOptions, GitIndexStats, GitIndexStatus, GitIndexingStatus, GitProgressCallback, GitProgressUpdate, GitSearchOptions, GitSearchResult, GitSnapshot, RawCommit, } from "./types.js";
export { DEFAULT_GIT_CONFIG, COMMIT_TYPE_PATTERNS } from "./config.js";
export { GitHistoryIndexer } from "./indexer.js";
export { GitExtractor } from "./extractor.js";
export { CommitChunker } from "./chunker.js";
export { GitSynchronizer } from "./sync/synchronizer.js";
//# sourceMappingURL=index.d.ts.map