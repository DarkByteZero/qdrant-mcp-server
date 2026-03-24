import { EmbeddingProvider, EmbeddingResult, RateLimitConfig } from "./base.js";
export declare class OllamaEmbeddings implements EmbeddingProvider {
    private log;
    private model;
    private dimensions;
    private limiter;
    private retryAttempts;
    private retryDelayMs;
    private baseUrl;
    constructor(model?: string, dimensions?: number, rateLimitConfig?: RateLimitConfig, baseUrl?: string);
    private isOllamaError;
    private retryWithBackoff;
    private callApi;
    embed(text: string): Promise<EmbeddingResult>;
    embedBatch(texts: string[]): Promise<EmbeddingResult[]>;
    getDimensions(): number;
    getModel(): string;
}
//# sourceMappingURL=ollama.d.ts.map