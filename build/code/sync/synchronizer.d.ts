/**
 * FileSynchronizer - Manages incremental updates using Merkle trees
 * Detects file changes and updates snapshots
 */
import type { FileChanges } from "../types.js";
export declare class FileSynchronizer {
    private codebasePath;
    private snapshotManager;
    private previousHashes;
    private previousTree;
    constructor(codebasePath: string, collectionName: string);
    /**
     * Initialize synchronizer by loading previous snapshot
     */
    initialize(): Promise<boolean>;
    /**
     * Compute hash for a file's content
     */
    private hashFile;
    /**
     * Compute hashes for all files
     */
    computeFileHashes(filePaths: string[]): Promise<Map<string, string>>;
    /**
     * Detect changes since last snapshot
     */
    detectChanges(currentFiles: string[]): Promise<FileChanges>;
    /**
     * Update snapshot with current state
     */
    updateSnapshot(files: string[]): Promise<void>;
    /**
     * Delete snapshot
     */
    deleteSnapshot(): Promise<void>;
    /**
     * Check if snapshot exists
     */
    hasSnapshot(): Promise<boolean>;
    /**
     * Validate snapshot integrity
     */
    validateSnapshot(): Promise<boolean>;
    /**
     * Get snapshot age in milliseconds
     */
    getSnapshotAge(): Promise<number | null>;
    /**
     * Quick check if re-indexing is needed (compare root hashes)
     */
    needsReindex(currentFiles: string[]): Promise<boolean>;
}
//# sourceMappingURL=synchronizer.d.ts.map