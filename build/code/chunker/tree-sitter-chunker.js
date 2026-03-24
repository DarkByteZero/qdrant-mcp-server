/**
 * TreeSitterChunker - AST-aware code chunking using tree-sitter
 * Primary chunking strategy for supported languages
 */
import Parser from "tree-sitter";
// tree-sitter language modules don't have proper types
import Bash from "tree-sitter-bash";
import Go from "tree-sitter-go";
import Java from "tree-sitter-java";
import JavaScript from "tree-sitter-javascript";
import Python from "tree-sitter-python";
import Rust from "tree-sitter-rust";
import TypeScript from "tree-sitter-typescript";
import logger from "../../logger.js";
import { CharacterChunker } from "./character-chunker.js";
const log = logger.child({ component: "tree-sitter-chunker" });
export class TreeSitterChunker {
    config;
    languages = new Map();
    fallbackChunker;
    constructor(config) {
        this.config = config;
        this.fallbackChunker = new CharacterChunker(config);
        this.initializeParsers();
    }
    initializeParsers() {
        // TypeScript
        const tsParser = new Parser();
        tsParser.setLanguage(TypeScript.typescript);
        this.languages.set("typescript", {
            parser: tsParser,
            chunkableTypes: [
                "function_declaration",
                "method_definition",
                "class_declaration",
                "interface_declaration",
                "type_alias_declaration",
                "enum_declaration",
            ],
        });
        // JavaScript
        const jsParser = new Parser();
        jsParser.setLanguage(JavaScript);
        this.languages.set("javascript", {
            parser: jsParser,
            chunkableTypes: [
                "function_declaration",
                "method_definition",
                "class_declaration",
                "export_statement",
            ],
        });
        // Python
        const pyParser = new Parser();
        pyParser.setLanguage(Python);
        this.languages.set("python", {
            parser: pyParser,
            chunkableTypes: [
                "function_definition",
                "class_definition",
                "decorated_definition",
            ],
        });
        // Go
        const goParser = new Parser();
        goParser.setLanguage(Go);
        this.languages.set("go", {
            parser: goParser,
            chunkableTypes: [
                "function_declaration",
                "method_declaration",
                "type_declaration",
                "interface_declaration",
            ],
        });
        // Rust
        const rustParser = new Parser();
        rustParser.setLanguage(Rust);
        this.languages.set("rust", {
            parser: rustParser,
            chunkableTypes: [
                "function_item",
                "impl_item",
                "trait_item",
                "struct_item",
                "enum_item",
            ],
        });
        // Java
        const javaParser = new Parser();
        javaParser.setLanguage(Java);
        this.languages.set("java", {
            parser: javaParser,
            chunkableTypes: [
                "method_declaration",
                "class_declaration",
                "interface_declaration",
                "enum_declaration",
            ],
        });
        // Bash
        const bashParser = new Parser();
        bashParser.setLanguage(Bash);
        this.languages.set("bash", {
            parser: bashParser,
            chunkableTypes: ["function_definition", "command"],
        });
    }
    async chunk(code, filePath, language) {
        const langConfig = this.languages.get(language);
        if (!langConfig) {
            // Fallback to character-based chunking
            return this.fallbackChunker.chunk(code, filePath, language);
        }
        try {
            const tree = langConfig.parser.parse(code);
            const chunks = [];
            // Find all chunkable nodes
            const nodes = this.findChunkableNodes(tree.rootNode, langConfig.chunkableTypes);
            for (const [index, node] of nodes.entries()) {
                const content = code.substring(node.startIndex, node.endIndex);
                // Skip chunks that are too small
                if (content.length < 50) {
                    continue;
                }
                // If chunk is too large, fall back to character chunking for this node
                if (content.length > this.config.maxChunkSize * 2) {
                    const subChunks = await this.fallbackChunker.chunk(content, filePath, language);
                    // Adjust line numbers for sub-chunks
                    for (const subChunk of subChunks) {
                        chunks.push({
                            ...subChunk,
                            startLine: node.startPosition.row + 1 + subChunk.startLine - 1,
                            endLine: node.startPosition.row + 1 + subChunk.endLine - 1,
                            metadata: {
                                ...subChunk.metadata,
                                chunkIndex: chunks.length,
                            },
                        });
                    }
                    continue;
                }
                chunks.push({
                    content: content.trim(),
                    startLine: node.startPosition.row + 1,
                    endLine: node.endPosition.row + 1,
                    metadata: {
                        filePath,
                        language,
                        chunkIndex: index,
                        chunkType: this.getChunkType(node.type),
                        name: this.extractName(node, code),
                    },
                });
            }
            // If no chunks found or file is small, use fallback
            if (chunks.length === 0 && code.length > 100) {
                return this.fallbackChunker.chunk(code, filePath, language);
            }
            return chunks;
        }
        catch (error) {
            // On parsing error, fallback to character-based chunking
            log.warn({ filePath, err: error }, "Tree-sitter parsing failed, falling back to character chunker");
            return this.fallbackChunker.chunk(code, filePath, language);
        }
    }
    supportsLanguage(language) {
        return this.languages.has(language);
    }
    getStrategyName() {
        return "tree-sitter";
    }
    /**
     * Find all chunkable nodes in the AST
     */
    findChunkableNodes(node, chunkableTypes) {
        const nodes = [];
        const traverse = (n) => {
            if (chunkableTypes.includes(n.type)) {
                nodes.push(n);
                // Don't traverse children of chunkable nodes to avoid nested chunks
                return;
            }
            for (const child of n.children) {
                traverse(child);
            }
        };
        traverse(node);
        return nodes;
    }
    /**
     * Extract function/class name from AST node
     */
    extractName(node, code) {
        // Try to find name node
        const nameNode = node.childForFieldName("name");
        if (nameNode) {
            return code.substring(nameNode.startIndex, nameNode.endIndex);
        }
        // For some node types, name might be in a different location
        for (const child of node.children) {
            if (child.type === "identifier" || child.type === "type_identifier") {
                return code.substring(child.startIndex, child.endIndex);
            }
        }
        return undefined;
    }
    /**
     * Map AST node type to chunk type
     */
    getChunkType(nodeType) {
        if (nodeType.includes("function") || nodeType.includes("method")) {
            return "function";
        }
        if (nodeType.includes("class") || nodeType.includes("struct")) {
            return "class";
        }
        if (nodeType.includes("interface") || nodeType.includes("trait")) {
            return "interface";
        }
        return "block";
    }
}
//# sourceMappingURL=tree-sitter-chunker.js.map