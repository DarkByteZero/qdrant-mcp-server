import { EmbeddingProvider, EmbeddingResult, RateLimitConfig } from "./base.js";
export declare class OpenAIEmbeddings implements EmbeddingProvider {
    private log;
    private client;
    private model;
    private dimensions;
    private limiter;
    private retryAttempts;
    private retryDelayMs;
    constructor(apiKey: string, model?: string, dimensions?: number, rateLimitConfig?: RateLimitConfig);
    private retryWithBackoff;
    embed(text: string): Promise<EmbeddingResult>;
    embedBatch(texts: string[]): Promise<EmbeddingResult[]>;
    getDimensions(): number;
    getModel(): string;
}
//# sourceMappingURL=openai.d.ts.map