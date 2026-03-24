/**
 * Prompt registration module for McpServer
 */
import { z } from "zod";
import { renderTemplate, validateArguments } from "./template.js";
/**
 * Build a Zod schema object for prompt arguments
 */
function buildArgsSchema(args) {
    const schema = {};
    for (const arg of args) {
        const fieldSchema = z.string().describe(arg.description);
        schema[arg.name] = arg.required ? fieldSchema : fieldSchema.optional();
    }
    return schema;
}
/**
 * Register all prompts from configuration on the server
 */
export function registerAllPrompts(server, config) {
    if (!config) {
        return; // No prompts = no prompts capability
    }
    for (const prompt of config.prompts) {
        const argsSchema = buildArgsSchema(prompt.arguments);
        server.registerPrompt(prompt.name, {
            title: prompt.name,
            description: prompt.description,
            argsSchema,
        }, (args) => {
            // Validate arguments
            const argsRecord = (args || {});
            validateArguments(argsRecord, prompt.arguments);
            // Render template
            const rendered = renderTemplate(prompt.template, argsRecord, prompt.arguments);
            return {
                messages: [
                    {
                        role: "user",
                        content: {
                            type: "text",
                            text: rendered.text,
                        },
                    },
                ],
            };
        });
    }
}
//# sourceMappingURL=register.js.map