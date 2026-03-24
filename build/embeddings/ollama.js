import Bottleneck from "bottleneck";
import logger from "../logger.js";
export class OllamaEmbeddings {
    log = logger.child({ component: "embeddings", provider: "ollama" });
    model;
    dimensions;
    limiter;
    retryAttempts;
    retryDelayMs;
    baseUrl;
    constructor(model = "nomic-embed-text", dimensions, rateLimitConfig, baseUrl = "http://localhost:11434") {
        this.model = model;
        this.baseUrl = baseUrl;
        // Default dimensions for different models
        const defaultDimensions = {
            "nomic-embed-text": 768,
            "mxbai-embed-large": 1024,
            "all-minilm": 384,
        };
        this.dimensions = dimensions || defaultDimensions[model] || 768;
        // Rate limiting configuration (more lenient for local models)
        const maxRequestsPerMinute = rateLimitConfig?.maxRequestsPerMinute || 1000;
        this.retryAttempts = rateLimitConfig?.retryAttempts || 3;
        this.retryDelayMs = rateLimitConfig?.retryDelayMs || 500;
        this.limiter = new Bottleneck({
            reservoir: maxRequestsPerMinute,
            reservoirRefreshAmount: maxRequestsPerMinute,
            reservoirRefreshInterval: 60 * 1000,
            maxConcurrent: 10,
            minTime: Math.floor((60 * 1000) / maxRequestsPerMinute),
        });
    }
    isOllamaError(e) {
        return (typeof e === "object" && e !== null && ("status" in e || "message" in e));
    }
    async retryWithBackoff(fn, attempt = 0) {
        try {
            return await fn();
        }
        catch (error) {
            // Type guard for OllamaError
            const apiError = this.isOllamaError(error)
                ? error
                : { status: 0, message: String(error) };
            const isRateLimitError = apiError.status === 429 ||
                (typeof apiError.message === "string" &&
                    apiError.message.toLowerCase().includes("rate limit"));
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
                throw new Error(`Ollama API rate limit exceeded after ${this.retryAttempts} retry attempts. Please try again later or reduce request frequency.`);
            }
            throw error;
        }
    }
    async callApi(text) {
        try {
            const response = await fetch(`${this.baseUrl}/api/embeddings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: this.model,
                    prompt: text,
                }),
            });
            if (!response.ok) {
                const errorBody = await response.text();
                const textPreview = text.length > 100 ? text.substring(0, 100) + "..." : text;
                const error = {
                    status: response.status,
                    message: `Ollama API error (${response.status}) for model "${this.model}": ${errorBody}. Text preview: "${textPreview}"`,
                };
                throw error;
            }
            return response.json();
        }
        catch (error) {
            // Re-throw if it's already an OllamaError from the !response.ok block
            if (error && typeof error === "object" && "status" in error) {
                throw error;
            }
            // For Error instances (like network errors), enhance the message
            if (error instanceof Error) {
                const textPreview = text.length > 100 ? text.substring(0, 100) + "..." : text;
                throw new Error(`Failed to call Ollama API at ${this.baseUrl} with model ${this.model}: ${error.message}. Text preview: "${textPreview}"`);
            }
            // Handle objects with 'message' property - preserve the original error structure
            // This ensures objects with 'message' property work correctly in tests
            if (this.isOllamaError(error)) {
                throw error;
            }
            // For other types, create a descriptive error message
            const textPreview = text.length > 100 ? text.substring(0, 100) + "..." : text;
            const errorMessage = JSON.stringify(error);
            throw new Error(`Failed to call Ollama API at ${this.baseUrl} with model ${this.model}: ${errorMessage}. Text preview: "${textPreview}"`);
        }
    }
    async embed(text) {
        return this.limiter.schedule(() => this.retryWithBackoff(async () => {
            const response = await this.callApi(text);
            if (!response.embedding) {
                throw new Error("No embedding returned from Ollama API");
            }
            return {
                embedding: response.embedding,
                dimensions: this.dimensions,
            };
        }));
    }
    async embedBatch(texts) {
        this.log.debug({ batchSize: texts.length }, "embedBatch");
        // Ollama doesn't support batch embeddings natively, so we process in parallel
        // Process in chunks to avoid overwhelming Ollama and prevent memory issues
        const CHUNK_SIZE = 50;
        const results = [];
        for (let i = 0; i < texts.length; i += CHUNK_SIZE) {
            const chunk = texts.slice(i, i + CHUNK_SIZE);
            // The Bottleneck limiter will handle rate limiting and concurrency (maxConcurrent: 10)
            const chunkResults = await Promise.all(chunk.map((text) => this.embed(text)));
            results.push(...chunkResults);
        }
        return results;
    }
    getDimensions() {
        return this.dimensions;
    }
    getModel() {
        return this.model;
    }
}
//# sourceMappingURL=ollama.js.map