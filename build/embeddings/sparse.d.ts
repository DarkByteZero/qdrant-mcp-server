/**
 * BM25 Sparse Vector Generator
 *
 * This module provides a simple BM25-like sparse vector generation for keyword search.
 * Uses deterministic hash-based vocabulary indices so that the same token always maps
 * to the same index, regardless of when or where the generator is instantiated.
 *
 * For production use, consider using a proper BM25 implementation or Qdrant's built-in
 * sparse vector generation via FastEmbed.
 */
import type { SparseVector } from "../qdrant/client.js";
export declare class BM25SparseVectorGenerator {
    private idfScores;
    private documentCount;
    private k1;
    private b;
    constructor(k1?: number, b?: number);
    /**
     * Deterministically hash a token to a fixed vocabulary index.
     * The same token will always produce the same index, regardless of
     * generator instance or document processing order.
     */
    private hashToken;
    /**
     * Tokenize text into words (simple whitespace tokenization + lowercase)
     */
    private tokenize;
    /**
     * Calculate term frequency for a document
     */
    private getTermFrequency;
    /**
     * Build vocabulary from training documents (optional pre-training step)
     * Computes IDF scores for more accurate BM25 scoring.
     */
    train(documents: string[]): void;
    /**
     * Generate sparse vector for a query or document
     * Returns indices and values for non-zero dimensions
     */
    generate(text: string, avgDocLength?: number): SparseVector;
    /**
     * Simple static method for generating sparse vectors without training
     * Useful for quick implementation
     */
    static generateSimple(text: string): SparseVector;
}
//# sourceMappingURL=sparse.d.ts.map