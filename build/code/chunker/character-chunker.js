/**
 * CharacterChunker - Simple character-based chunking with overlap
 * Used as fallback when AST parsing is not available
 */
export class CharacterChunker {
    config;
    constructor(config) {
        this.config = config;
    }
    async chunk(code, filePath, language) {
        const chunks = [];
        const lines = code.split("\n");
        let currentChunk = "";
        let currentStartLine = 1;
        let currentLineCount = 0;
        let chunkIndex = 0;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            currentChunk += `${line}\n`;
            currentLineCount++;
            // Check if we've reached chunk size
            if (currentChunk.length >= this.config.chunkSize) {
                // Try to find a good break point (end of function, class, or empty line)
                const breakPoint = this.findBreakPoint(lines, i + 1);
                if (breakPoint > i && breakPoint - i < 20) {
                    // Include lines up to break point, but respect maxChunkSize
                    for (let j = i + 1; j <= breakPoint && j < lines.length; j++) {
                        const nextLine = `${lines[j]}\n`;
                        // Stop if adding this line would exceed maxChunkSize
                        if (currentChunk.length + nextLine.length > this.config.maxChunkSize) {
                            break;
                        }
                        currentChunk += nextLine;
                        currentLineCount++;
                        i = j;
                    }
                }
                // Create chunk
                chunks.push({
                    content: currentChunk.trim(),
                    startLine: currentStartLine,
                    endLine: currentStartLine + currentLineCount - 1,
                    metadata: {
                        filePath,
                        language,
                        chunkIndex,
                        chunkType: "block",
                    },
                });
                chunkIndex++;
                // Calculate overlap
                const overlapLines = this.calculateOverlapLines(currentLineCount);
                const _overlapStart = Math.max(0, currentLineCount - overlapLines);
                // Start new chunk with overlap
                currentChunk = `${lines.slice(i - overlapLines + 1, i + 1).join("\n")}\n`;
                currentStartLine = currentStartLine + currentLineCount - overlapLines;
                currentLineCount = overlapLines;
            }
        }
        // Add remaining content as final chunk
        if (currentChunk.trim().length > 50) {
            chunks.push({
                content: currentChunk.trim(),
                startLine: currentStartLine,
                endLine: currentStartLine + currentLineCount - 1,
                metadata: {
                    filePath,
                    language,
                    chunkIndex,
                    chunkType: "block",
                },
            });
        }
        return chunks;
    }
    supportsLanguage(_language) {
        // Character chunker supports all languages
        return true;
    }
    getStrategyName() {
        return "character-based";
    }
    /**
     * Find a good break point in the code (empty line, closing brace, etc.)
     */
    findBreakPoint(lines, startIdx) {
        const searchWindow = Math.min(20, lines.length - startIdx);
        for (let i = 0; i < searchWindow; i++) {
            const line = lines[startIdx + i]?.trim() || "";
            // Good break points
            if (line === "" ||
                line === "}" ||
                line === "};" ||
                line === "]);" ||
                line.startsWith("//") ||
                line.startsWith("#")) {
                return startIdx + i;
            }
        }
        return startIdx;
    }
    /**
     * Calculate number of lines to overlap based on chunk size
     */
    calculateOverlapLines(totalLines) {
        const overlapChars = this.config.chunkOverlap;
        const avgCharsPerLine = this.config.chunkSize / Math.max(totalLines, 1);
        return Math.floor(overlapChars / Math.max(avgCharsPerLine, 1));
    }
}
//# sourceMappingURL=character-chunker.js.map