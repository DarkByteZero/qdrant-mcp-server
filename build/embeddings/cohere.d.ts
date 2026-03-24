import { EmbeddingProvider, EmbeddingResult, RateLimitConfig } from "./base.js";
export declare class CohereEmbeddings implements EmbeddingProvider {
    private log;
    private client;
    private model;
    private dimensions;
    private limiter;
    private retryAttempts;
    private retryDelayMs;
    private inputType;
    constructor(apiKey: string, model?: string, dimensions?: number, rateLimitConfig?: RateLimitConfig, inputType?: "search_document" | "search_query" | "classification" | "clustering");
    private retryWithBackoff;
    embed(text: string): Promise<EmbeddingResult>;
    embedBatch(texts: string[]): Promise<EmbeddingResult[]>;
    getDimensions(): number;
    getModel(): string;
}
//# sourceMappingURL=cohere.d.ts.map