/**
 * MetadataExtractor - Extracts metadata from code chunks
 */
import type { CodeChunk } from "./types.js";
export declare class MetadataExtractor {
    /**
     * Extract programming language from file path
     */
    extractLanguage(filePath: string): string;
    /**
     * Generate deterministic chunk ID based on content and location
     * Format: chunk_{sha256(path:start:end:content)[:16]}
     */
    generateChunkId(chunk: CodeChunk): string;
    /**
     * Calculate simple code complexity score (optional)
     * Based on: cyclomatic complexity indicators
     */
    calculateComplexity(code: string): number;
    /**
     * Detect potential secrets in code (basic pattern matching)
     */
    containsSecrets(code: string): boolean;
    /**
     * Extract imports/exports from code (basic regex-based)
     */
    extractImportsExports(code: string, language: string): {
        imports: string[];
        exports: string[];
    };
}
//# sourceMappingURL=metadata.d.ts.map