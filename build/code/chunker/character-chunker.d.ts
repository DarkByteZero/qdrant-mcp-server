/**
 * CharacterChunker - Simple character-based chunking with overlap
 * Used as fallback when AST parsing is not available
 */
import type { ChunkerConfig, CodeChunk } from "../types.js";
import type { CodeChunker } from "./base.js";
export declare class CharacterChunker implements CodeChunker {
    private config;
    constructor(config: ChunkerConfig);
    chunk(code: string, filePath: string, language: string): Promise<CodeChunk[]>;
    supportsLanguage(_language: string): boolean;
    getStrategyName(): string;
    /**
     * Find a good break point in the code (empty line, closing brace, etc.)
     */
    private findBreakPoint;
    /**
     * Calculate number of lines to overlap based on chunk size
     */
    private calculateOverlapLines;
}
//# sourceMappingURL=character-chunker.d.ts.map