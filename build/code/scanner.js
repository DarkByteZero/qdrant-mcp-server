/**
 * FileScanner - Discovers code files in a directory while respecting ignore patterns
 */
import { promises as fs } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import ignore from "ignore";
export class FileScanner {
    config;
    ig = ignore();
    supportedExts;
    constructor(config) {
        this.config = config;
        this.supportedExts = new Set(config.supportedExtensions);
    }
    /**
     * Load ignore patterns from .gitignore, .dockerignore, .npmignore, and .contextignore
     */
    async loadIgnorePatterns(rootPath) {
        const ignoreFiles = [".gitignore", ".dockerignore", ".npmignore", ".contextignore"];
        for (const ignoreFile of ignoreFiles) {
            const ignorePath = join(rootPath, ignoreFile);
            if (await this.fileExists(ignorePath)) {
                try {
                    const content = await fs.readFile(ignorePath, "utf-8");
                    this.ig.add(content);
                }
                catch (_error) {
                    // Silently skip if file can't be read
                }
            }
        }
        // Add default patterns from config
        if (this.config.ignorePatterns && this.config.ignorePatterns.length > 0) {
            this.ig.add(this.config.ignorePatterns);
        }
        // Add custom patterns
        if (this.config.customIgnorePatterns && this.config.customIgnorePatterns.length > 0) {
            this.ig.add(this.config.customIgnorePatterns);
        }
    }
    /**
     * Scan directory recursively and return all code files
     */
    async scanDirectory(rootPath) {
        const absoluteRoot = resolve(rootPath);
        const files = [];
        await this.walkDirectory(absoluteRoot, absoluteRoot, files);
        return files;
    }
    /**
     * Check if a file should be ignored based on patterns
     */
    shouldIgnore(filePath, rootPath) {
        const relativePath = relative(rootPath, filePath);
        return this.ig.ignores(relativePath);
    }
    /**
     * Get list of supported file extensions
     */
    getSupportedExtensions() {
        return Array.from(this.supportedExts);
    }
    /**
     * Recursively walk directory tree
     */
    async walkDirectory(currentPath, rootPath, files) {
        try {
            const entries = await fs.readdir(currentPath, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = join(currentPath, entry.name);
                const relativePath = relative(rootPath, fullPath);
                // Skip ignored paths
                if (this.ig.ignores(relativePath)) {
                    continue;
                }
                // Handle symbolic links safely to avoid infinite loops
                if (entry.isSymbolicLink()) {
                    continue;
                }
                if (entry.isDirectory()) {
                    await this.walkDirectory(fullPath, rootPath, files);
                }
                else if (entry.isFile()) {
                    const ext = extname(entry.name);
                    if (this.supportedExts.has(ext)) {
                        files.push(fullPath);
                    }
                }
            }
        }
        catch (_error) {
            // Skip directories that can't be read (permission errors, etc.)
        }
    }
    /**
     * Check if a file exists
     */
    async fileExists(path) {
        try {
            await fs.access(path);
            return true;
        }
        catch {
            return false;
        }
    }
}
//# sourceMappingURL=scanner.js.map