/**
 * FileSynchronizer - Manages incremental updates using Merkle trees
 * Detects file changes and updates snapshots
 */
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import { homedir } from "node:os";
import { join, relative } from "node:path";
import { MerkleTree } from "./merkle.js";
import { SnapshotManager } from "./snapshot.js";
export class FileSynchronizer {
    codebasePath;
    snapshotManager;
    previousHashes = new Map();
    previousTree = null;
    constructor(codebasePath, collectionName) {
        this.codebasePath = codebasePath;
        // Store snapshots in ~/.qdrant-mcp/snapshots/
        const snapshotDir = join(homedir(), ".qdrant-mcp", "snapshots");
        const snapshotPath = join(snapshotDir, `${collectionName}.json`);
        this.snapshotManager = new SnapshotManager(snapshotPath);
    }
    /**
     * Initialize synchronizer by loading previous snapshot
     */
    async initialize() {
        const snapshot = await this.snapshotManager.load();
        if (snapshot) {
            this.previousHashes = snapshot.fileHashes;
            this.previousTree = snapshot.merkleTree;
            return true;
        }
        return false;
    }
    /**
     * Compute hash for a file's content
     */
    async hashFile(filePath) {
        try {
            // Resolve path relative to codebase if not absolute
            const absolutePath = filePath.startsWith(this.codebasePath)
                ? filePath
                : join(this.codebasePath, filePath);
            const content = await fs.readFile(absolutePath, "utf-8");
            return createHash("sha256").update(content).digest("hex");
        }
        catch (_error) {
            // If file can't be read, return empty hash
            return "";
        }
    }
    /**
     * Compute hashes for all files
     */
    async computeFileHashes(filePaths) {
        const fileHashes = new Map();
        for (const filePath of filePaths) {
            const hash = await this.hashFile(filePath);
            if (hash) {
                // Normalize to relative path
                const relativePath = filePath.startsWith(this.codebasePath)
                    ? relative(this.codebasePath, filePath)
                    : filePath;
                fileHashes.set(relativePath, hash);
            }
        }
        return fileHashes;
    }
    /**
     * Detect changes since last snapshot
     */
    async detectChanges(currentFiles) {
        // Compute current hashes
        const currentHashes = await this.computeFileHashes(currentFiles);
        // Compare with previous snapshot
        const changes = MerkleTree.compare(this.previousHashes, currentHashes);
        return changes;
    }
    /**
     * Update snapshot with current state
     */
    async updateSnapshot(files) {
        const fileHashes = await this.computeFileHashes(files);
        const tree = new MerkleTree();
        tree.build(fileHashes);
        await this.snapshotManager.save(this.codebasePath, fileHashes, tree);
        // Update internal state
        this.previousHashes = fileHashes;
        this.previousTree = tree;
    }
    /**
     * Delete snapshot
     */
    async deleteSnapshot() {
        await this.snapshotManager.delete();
        this.previousHashes.clear();
        this.previousTree = null;
    }
    /**
     * Check if snapshot exists
     */
    async hasSnapshot() {
        return this.snapshotManager.exists();
    }
    /**
     * Validate snapshot integrity
     */
    async validateSnapshot() {
        return this.snapshotManager.validate();
    }
    /**
     * Get snapshot age in milliseconds
     */
    async getSnapshotAge() {
        const snapshot = await this.snapshotManager.load();
        if (!snapshot)
            return null;
        return Date.now() - snapshot.timestamp;
    }
    /**
     * Quick check if re-indexing is needed (compare root hashes)
     */
    async needsReindex(currentFiles) {
        if (!this.previousTree)
            return true;
        const currentHashes = await this.computeFileHashes(currentFiles);
        const currentTree = new MerkleTree();
        currentTree.build(currentHashes);
        return this.previousTree.getRootHash() !== currentTree.getRootHash();
    }
}
//# sourceMappingURL=synchronizer.js.map