import { CohereClient } from "cohere-ai";
import Bottleneck from "bottleneck";
import logger from "../logger.js";
export class CohereEmbeddings {
    log = logger.child({ component: "embeddings", provider: "cohere" });
    client;
    model;
    dimensions;
    limiter;
    retryAttempts;
    retryDelayMs;
    inputType;
    constructor(apiKey, model = "embed-english-v3.0", dimensions, rateLimitConfig, inputType = "search_document") {
        this.client = new CohereClient({ token: apiKey });
        this.model = model;
        this.inputType = inputType;
        // Default dimensions for different models
        const defaultDimensions = {
            "embed-english-v3.0": 1024,
            "embed-multilingual-v3.0": 1024,
            "embed-english-light-v3.0": 384,
            "embed-multilingual-light-v3.0": 384,
        };
        this.dimensions = dimensions || defaultDimensions[model] || 1024;
        // Rate limiting configuration
        const maxRequestsPerMinute = rateLimitConfig?.maxRequestsPerMinute || 100;
        this.retryAttempts = rateLimitConfig?.retryAttempts || 3;
        this.retryDelayMs = rateLimitConfig?.retryDelayMs || 1000;
        this.limiter = new Bottleneck({
            reservoir: maxRequestsPerMinute,
            reservoirRefreshAmount: maxRequestsPerMinute,
            reservoirRefreshInterval: 60 * 1000,
            maxConcurrent: 5,
            minTime: Math.floor((60 * 1000) / maxRequestsPerMinute),
        });
    }
    async retryWithBackoff(fn, attempt = 0) {
        try {
            return await fn();
        }
        catch (error) {
            const apiError = error;
            const isRateLimitError = apiError?.status === 429 ||
                apiError?.statusCode === 429 ||
                apiError?.message?.toLowerCase().includes("rate limit");
            if (isRateLimitError && attempt < this.retryAttempts) {
                const delayMs = this.retryDelayMs * Math.pow(2, attempt);
                const waitTimeSeconds = (delayMs / 1000).toFixed(1);
                this.log.warn({
                    waitTimeSeconds,
                    attempt: attempt + 1,
                    maxAttempts: this.retryAttempts,
                }, "Rate limit reached, retrying");
                await new Promise((resolve) => setTimeout(resolve, delayMs));
                return this.retryWithBackoff(fn, attempt + 1);
            }
            if (isRateLimitError) {
                throw new Error(`Cohere API rate limit exceeded after ${this.retryAttempts} retry attempts. Please try again later or reduce request frequency.`);
            }
            throw error;
        }
    }
    async embed(text) {
        return this.limiter.schedule(() => this.retryWithBackoff(async () => {
            const response = await this.client.embed({
                texts: [text],
                model: this.model,
                inputType: this.inputType,
                embeddingTypes: ["float"],
            });
            // Cohere v7+ returns embeddings as number[][]
            const embeddings = response.embeddings;
            if (!embeddings || embeddings.length === 0) {
                throw new Error("No embedding returned from Cohere API");
            }
            return {
                embedding: embeddings[0],
                dimensions: this.dimensions,
            };
        }));
    }
    async embedBatch(texts) {
        this.log.debug({ batchSize: texts.length }, "embedBatch");
        return this.limiter.schedule(() => this.retryWithBackoff(async () => {
            const response = await this.client.embed({
                texts,
                model: this.model,
                inputType: this.inputType,
                embeddingTypes: ["float"],
            });
            // Cohere v7+ returns embeddings as number[][]
            const embeddings = response.embeddings;
            if (!embeddings) {
                throw new Error("No embeddings returned from Cohere API");
            }
            return embeddings.map((embedding) => ({
                embedding,
                dimensions: this.dimensions,
            }));
        }));
    }
    getDimensions() {
        return this.dimensions;
    }
    getModel() {
        return this.model;
    }
}
//# sourceMappingURL=cohere.js.map