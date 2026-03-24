/**
 * TreeSitterChunker - AST-aware code chunking using tree-sitter
 * Primary chunking strategy for supported languages
 */
import type { ChunkerConfig, CodeChunk } from "../types.js";
import type { CodeChunker } from "./base.js";
export declare class TreeSitterChunker implements CodeChunker {
    private config;
    private languages;
    private fallbackChunker;
    constructor(config: ChunkerConfig);
    private initializeParsers;
    chunk(code: string, filePath: string, language: string): Promise<CodeChunk[]>;
    supportsLanguage(language: string): boolean;
    getStrategyName(): string;
    /**
     * Find all chunkable nodes in the AST
     */
    private findChunkableNodes;
    /**
     * Extract function/class name from AST node
     */
    private extractName;
    /**
     * Map AST node type to chunk type
     */
    private getChunkType;
}
//# sourceMappingURL=tree-sitter-chunker.d.ts.map