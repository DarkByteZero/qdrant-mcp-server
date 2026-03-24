/**
 * MerkleTree - Efficient change detection using Merkle trees
 * Enables incremental updates by comparing file hashes
 */
export declare class MerkleNode {
    hash: string;
    left?: MerkleNode | undefined;
    right?: MerkleNode | undefined;
    constructor(hash: string, left?: MerkleNode | undefined, right?: MerkleNode | undefined);
}
export declare class MerkleTree {
    root: MerkleNode | undefined;
    /**
     * Build Merkle tree from file hashes
     * @param fileHashes Map of file path to content hash
     */
    build(fileHashes: Map<string, string>): void;
    /**
     * Recursively build tree from leaf nodes
     */
    private buildRecursive;
    /**
     * Compare two trees and return file differences
     */
    static compare(oldHashes: Map<string, string>, newHashes: Map<string, string>): {
        added: string[];
        modified: string[];
        deleted: string[];
    };
    /**
     * Get root hash (quick comparison)
     */
    getRootHash(): string | undefined;
    /**
     * Serialize tree for storage
     */
    serialize(): string;
    private serializeNode;
    /**
     * Deserialize tree from storage
     */
    static deserialize(data: string): MerkleTree;
    private deserializeNode;
}
//# sourceMappingURL=merkle.d.ts.map