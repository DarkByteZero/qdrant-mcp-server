/**
 * FileScanner - Discovers code files in a directory while respecting ignore patterns
 */
import type { ScannerConfig } from "./types.js";
export declare class FileScanner {
    private config;
    private ig;
    private supportedExts;
    constructor(config: ScannerConfig);
    /**
     * Load ignore patterns from .gitignore, .dockerignore, .npmignore, and .contextignore
     */
    loadIgnorePatterns(rootPath: string): Promise<void>;
    /**
     * Scan directory recursively and return all code files
     */
    scanDirectory(rootPath: string): Promise<string[]>;
    /**
     * Check if a file should be ignored based on patterns
     */
    shouldIgnore(filePath: string, rootPath: string): boolean;
    /**
     * Get list of supported file extensions
     */
    getSupportedExtensions(): string[];
    /**
     * Recursively walk directory tree
     */
    private walkDirectory;
    /**
     * Check if a file exists
     */
    private fileExists;
}
//# sourceMappingURL=scanner.d.ts.map