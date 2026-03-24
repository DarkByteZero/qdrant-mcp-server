/**
 * GitExtractor - Extract commit data from git repositories
 * Uses child_process.execFile for security (no shell injection)
 */
import type { GitConfig, GitExtractOptions, RawCommit } from "./types.js";
/**
 * Normalize git remote URL to consistent format for hashing.
 * Handles both SSH and HTTPS URL formats.
 *
 * @example
 * normalizeRemoteUrl("git@github.com:user/repo.git") // → "user/repo"
 * normalizeRemoteUrl("https://github.com/user/repo.git") // → "user/repo"
 * normalizeRemoteUrl("") // → ""
 */
export declare function normalizeRemoteUrl(url: string): string;
export declare class GitExtractor {
    private repoPath;
    private config;
    constructor(repoPath: string, config: GitConfig);
    /**
     * Validate that the path is a git repository
     */
    validateRepository(): Promise<boolean>;
    /**
     * Get the latest commit hash
     */
    getLatestCommitHash(): Promise<string>;
    /**
     * Get the remote origin URL, or empty string if not configured
     */
    getRemoteUrl(): Promise<string>;
    /**
     * Get total commit count (optionally after a specific commit)
     */
    getCommitCount(sinceCommit?: string): Promise<number>;
    /**
     * Extract commits from the repository
     */
    getCommits(options?: GitExtractOptions): Promise<RawCommit[]>;
    /**
     * Get the diff for a specific commit
     */
    getCommitDiff(commitHash: string): Promise<string>;
    /**
     * Parse git log output into structured commits
     */
    private parseGitLog;
    /**
     * Parse a single commit block
     */
    private parseCommitBlock;
    /**
     * Parse numstat output (lines after the format line)
     */
    private parseNumstat;
}
//# sourceMappingURL=extractor.d.ts.map