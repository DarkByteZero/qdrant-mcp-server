/**
 * Simple template rendering engine for prompts
 */
import type { PromptArgument, RenderedPrompt } from "./types.js";
/**
 * Render a template string by replacing {{variable}} placeholders with actual values
 * @param template Template string with {{variable}} placeholders
 * @param args Record of argument values
 * @param definitions Argument definitions with defaults
 * @returns Rendered template
 */
export declare function renderTemplate(template: string, args?: Record<string, string>, definitions?: PromptArgument[]): RenderedPrompt;
/**
 * Validate that all required arguments are provided
 * @param args Provided arguments
 * @param definitions Argument definitions
 * @throws Error if required arguments are missing
 */
export declare function validateArguments(args: Record<string, string>, definitions: PromptArgument[]): void;
//# sourceMappingURL=template.d.ts.map