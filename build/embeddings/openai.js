import OpenAI from "openai";
import Bottleneck from "bottleneck";
import logger from "../logger.js";
export class OpenAIEmbeddings {
    log = logger.child({ component: "embeddings", provider: "openai" });
    client;
    model;
    dimensions;
    limiter;
    retryAttempts;
    retryDelayMs;
    constructor(apiKey, model = "text-embedding-3-small", dimensions, rateLimitConfig) {
        this.client = new OpenAI({ apiKey });
        this.model = model;
        // Default dimensions for different models
        const defaultDimensions = {
            "text-embedding-3-small": 1536,
            "text-embedding-3-large": 3072,
            "text-embedding-ada-002": 1536,
        };
        this.dimensions = dimensions || defaultDimensions[model] || 1536;
        // Rate limiting configuration
        const maxRequestsPerMinute = rateLimitConfig?.maxRequestsPerMinute || 3500;
        this.retryAttempts = rateLimitConfig?.retryAttempts || 3;
        this.retryDelayMs = rateLimitConfig?.retryDelayMs || 1000;
        // Initialize bottleneck limiter
        // Uses reservoir (token bucket) pattern for burst handling with per-minute refresh
        // Note: Using both reservoir and minTime provides defense in depth but may be
        // more conservative than necessary. Future optimization could use reservoir-only
        // for better burst handling or minTime-only for simpler even distribution.
        this.limiter = new Bottleneck({
            reservoir: maxRequestsPerMinute,
            reservoirRefreshAmount: maxRequestsPerMinute,
            reservoirRefreshInterval: 60 * 1000, // 1 minute
            maxConcurrent: 10,
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
                apiError?.code === "rate_limit_exceeded" ||
                apiError?.message?.toLowerCase().includes("rate limit");
            if (isRateLimitError && attempt < this.retryAttempts) {
                // Check for Retry-After header (different HTTP clients may nest differently)
                const retryAfter = apiError?.response?.headers?.["retry-after"] ||
                    apiError?.headers?.["retry-after"];
                let delayMs;
                if (retryAfter) {
                    // Use Retry-After header if available (in seconds)
                    const parsed = parseInt(retryAfter, 10);
                    delayMs =
                        !isNaN(parsed) && parsed > 0
                            ? parsed * 1000
                            : this.retryDelayMs * Math.pow(2, attempt);
                }
                else {
                    // Exponential backoff: 1s, 2s, 4s, 8s...
                    delayMs = this.retryDelayMs * Math.pow(2, attempt);
                }
                const waitTimeSeconds = (delayMs / 1000).toFixed(1);
                this.log.warn({
                    waitTimeSeconds,
                    attempt: attempt + 1,
                    maxAttempts: this.retryAttempts,
                }, "Rate limit reached, retrying");
                await new Promise((resolve) => setTimeout(resolve, delayMs));
                return this.retryWithBackoff(fn, attempt + 1);
            }
            // If not a rate limit error or max retries exceeded, throw
            if (isRateLimitError) {
                throw new Error(`OpenAI API rate limit exceeded after ${this.retryAttempts} retry attempts. Please try again later or reduce request frequency.`);
            }
            throw error;
        }
    }
    async embed(text) {
        return this.limiter.schedule(() => this.retryWithBackoff(async () => {
            const response = await this.client.embeddings.create({
                model: this.model,
                input: text,
                dimensions: this.dimensions,
            });
            return {
                embedding: response.data[0].embedding,
                dimensions: this.dimensions,
            };
        }));
    }
    async embedBatch(texts) {
        this.log.debug({ batchSize: texts.length }, "embedBatch");
        return this.limiter.schedule(() => this.retryWithBackoff(async () => {
            const response = await this.client.embeddings.create({
                model: this.model,
                input: texts,
                dimensions: this.dimensions,
            });
            return response.data.map((item) => ({
                embedding: item.embedding,
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
//# sourceMappingURL=openai.js.map