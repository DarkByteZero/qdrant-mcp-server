/**
 * GitSynchronizer - Track last indexed commit for incremental updates
 */
export declare class GitSynchronizer {
    private repoPath;
    private snapshotPath;
    private snapshot;
    constructor(repoPath: string, collectionName: string);
    /**
     * Initialize synchronizer by loading existing snapshot
     * @returns true if snapshot exists and was loaded
     */
    initialize(): Promise<boolean>;
    /**
     * Get the last indexed commit hash
     */
    getLastCommitHash(): string | null;
    /**
     * Get the timestamp of last indexing
     */
    getLastIndexedAt(): Date | null;
    /**
     * Get the number of commits indexed
     */
    getCommitsIndexed(): number;
    /**
     * Update snapshot with new indexing state
     */
    updateSnapshot(lastCommitHash: string, commitsIndexed: number): Promise<void>;
    /**
     * Delete the snapshot file
     */
    deleteSnapshot(): Promise<void>;
    /**
     * Check if snapshot exists
     */
    exists(): Promise<boolean>;
    /**
     * Get snapshot age in milliseconds
     */
    getSnapshotAge(): number | null;
}
//# sourceMappingURL=synchronizer.d.ts.map