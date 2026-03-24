/**
 * Prompt configuration loader
 */
import type { PromptDefinition, PromptsConfig } from "./types.js";
/**
 * Load and parse prompts configuration from a JSON file
 * @param filePath Path to the prompts configuration file
 * @returns Parsed prompts configuration
 * @throws Error if file cannot be read or parsed
 */
export declare function loadPromptsConfig(filePath: string): PromptsConfig;
/**
 * Get a specific prompt by name
 * @param config Prompts configuration
 * @param name Prompt name
 * @returns Prompt definition or undefined if not found
 */
export declare function getPrompt(config: PromptsConfig, name: string): PromptDefinition | undefined;
/**
 * List all available prompts
 * @param config Prompts configuration
 * @returns Array of prompt definitions
 */
export declare function listPrompts(config: PromptsConfig): PromptDefinition[];
//# sourceMappingURL=loader.d.ts.map