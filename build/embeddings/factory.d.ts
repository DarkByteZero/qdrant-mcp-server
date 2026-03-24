import { EmbeddingProvider, ProviderConfig } from "./base.js";
export type EmbeddingProviderType = "openai" | "cohere" | "voyage" | "ollama";
export interface FactoryConfig extends ProviderConfig {
    provider: EmbeddingProviderType;
}
export declare class EmbeddingProviderFactory {
    static create(config: FactoryConfig): EmbeddingProvider;
    static createFromEnv(): EmbeddingProvider;
}
//# sourceMappingURL=factory.d.ts.map