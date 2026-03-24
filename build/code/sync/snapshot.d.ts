/**
 * Snapshot - Persistence layer for Merkle tree snapshots
 * Stores file hashes and tree structure for incremental updates
 */
import { MerkleTree } from "./merkle.js";
export interface Snapshot {
    codebasePath: string;
    timestamp: number;
    fileHashes: Record<string, string>;
    merkleTree: string;
}
export declare class SnapshotManager {
    private snapshotPath;
    constructor(snapshotPath: string);
    /**
     * Save snapshot to disk
     */
    save(codebasePath: string, fileHashes: Map<string, string>, tree: MerkleTree): Promise<void>;
    /**
     * Load snapshot from disk
     */
    load(): Promise<{
        codebasePath: string;
        fileHashes: Map<string, string>;
        merkleTree: MerkleTree;
        timestamp: number;
    } | null>;
    /**
     * Check if snapshot exists
     */
    exists(): Promise<boolean>;
    /**
     * Delete snapshot
     */
    delete(): Promise<void>;
    /**
     * Validate snapshot (check for corruption)
     */
    validate(): Promise<boolean>;
}
//# sourceMappingURL=snapshot.d.ts.map