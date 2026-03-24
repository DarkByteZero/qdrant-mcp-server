import { EmbeddingProvider, EmbeddingResult, RateLimitConfig } from "./base.js";
export declare class VoyageEmbeddings implements EmbeddingProvider {
    private log;
    private apiKey;
    private model;
    private dimensions;
    private limiter;
    private retryAttempts;
    private retryDelayMs;
    private baseUrl;
    private inputType?;
    constructor(apiKey: string, model?: string, dimensions?: number, rateLimitConfig?: RateLimitConfig, baseUrl?: string, inputType?: "query" | "document");
    private retryWithBackoff;
    private callApi;
    embed(text: string): Promise<EmbeddingResult>;
    embedBatch(texts: string[]): Promise<EmbeddingResult[]>;
    getDimensions(): number;
    getModel(): string;
}
//# sourceMappingURL=voyage.d.ts.map