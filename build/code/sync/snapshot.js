/**
 * Snapshot - Persistence layer for Merkle tree snapshots
 * Stores file hashes and tree structure for incremental updates
 */
import { promises as fs } from "node:fs";
import { dirname } from "node:path";
import { MerkleTree } from "./merkle.js";
export class SnapshotManager {
    snapshotPath;
    constructor(snapshotPath) {
        this.snapshotPath = snapshotPath;
    }
    /**
     * Save snapshot to disk
     */
    async save(codebasePath, fileHashes, tree) {
        const snapshot = {
            codebasePath,
            timestamp: Date.now(),
            fileHashes: Object.fromEntries(fileHashes),
            merkleTree: tree.serialize(),
        };
        // Ensure directory exists
        await fs.mkdir(dirname(this.snapshotPath), { recursive: true });
        // Write snapshot atomically (write to temp file, then rename)
        // Use unique temp file name to avoid race conditions
        const tempPath = `${this.snapshotPath}.tmp.${Date.now()}.${Math.random().toString(36).substring(2, 9)}`;
        await fs.writeFile(tempPath, JSON.stringify(snapshot, null, 2), "utf-8");
        await fs.rename(tempPath, this.snapshotPath);
    }
    /**
     * Load snapshot from disk
     */
    async load() {
        try {
            const data = await fs.readFile(this.snapshotPath, "utf-8");
            const snapshot = JSON.parse(data);
            const fileHashes = new Map(Object.entries(snapshot.fileHashes));
            const tree = MerkleTree.deserialize(snapshot.merkleTree);
            return {
                codebasePath: snapshot.codebasePath,
                fileHashes,
                merkleTree: tree,
                timestamp: snapshot.timestamp,
            };
        }
        catch (_error) {
            // Snapshot doesn't exist or is corrupted
            return null;
        }
    }
    /**
     * Check if snapshot exists
     */
    async exists() {
        try {
            await fs.access(this.snapshotPath);
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Delete snapshot
     */
    async delete() {
        try {
            await fs.unlink(this.snapshotPath);
        }
        catch {
            // Ignore if doesn't exist
        }
    }
    /**
     * Validate snapshot (check for corruption)
     */
    async validate() {
        try {
            const snapshot = await this.load();
            if (!snapshot)
                return false;
            // Basic validation: check if tree can be deserialized
            return snapshot.merkleTree.getRootHash() !== undefined || snapshot.fileHashes.size === 0;
        }
        catch {
            return false;
        }
    }
}
//# sourceMappingURL=snapshot.js.map