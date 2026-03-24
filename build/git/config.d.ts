/**
 * Default configuration and constants for git history indexing
 */
import type { CommitType, GitConfig } from "./types.js";
/**
 * Default configuration for git history indexing
 */
export declare const DEFAULT_GIT_CONFIG: GitConfig;
/**
 * Patterns for classifying commit types based on conventional commits
 * Order matters - first match wins
 */
export declare const COMMIT_TYPE_PATTERNS: Array<{
    type: CommitType;
    patterns: RegExp[];
}>;
/**
 * Git log format string for extracting structured commit data
 * Format: hash|shortHash|author|authorEmail|date|subject|body
 */
export declare const GIT_LOG_FORMAT = "%H|%h|%an|%ae|%aI|%s|%b";
/**
 * Delimiter used in git log output to separate commits
 */
export declare const GIT_LOG_COMMIT_DELIMITER = "---COMMIT_DELIMITER---";
/**
 * Max buffer size for git operations (50MB)
 */
export declare const GIT_MAX_BUFFER: number;
/**
 * Reserved ID for storing indexing metadata in the collection
 */
export declare const GIT_INDEXING_METADATA_ID = "__git_indexing_metadata__";
//# sourceMappingURL=config.d.ts.map