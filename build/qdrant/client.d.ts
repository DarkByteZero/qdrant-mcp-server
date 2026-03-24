export interface CollectionInfo {
    name: string;
    vectorSize: number;
    pointsCount: number;
    distance: "Cosine" | "Euclid" | "Dot";
    hybridEnabled?: boolean;
}
export interface SearchResult {
    id: string | number;
    score: number;
    payload?: Record<string, any>;
}
export interface SparseVector {
    indices: number[];
    values: number[];
}
export declare class QdrantManager {
    private log;
    private client;
    constructor(url?: string, apiKey?: string);
    /**
     * Converts a string ID to UUID format if it's not already a UUID.
     * Qdrant requires string IDs to be in UUID format.
     */
    private normalizeId;
    createCollection(name: string, vectorSize: number, distance?: "Cosine" | "Euclid" | "Dot", enableSparse?: boolean): Promise<void>;
    collectionExists(name: string): Promise<boolean>;
    listCollections(): Promise<string[]>;
    getCollectionInfo(name: string): Promise<CollectionInfo>;
    deleteCollection(name: string): Promise<void>;
    addPoints(collectionName: string, points: Array<{
        id: string | number;
        vector: number[];
        payload?: Record<string, any>;
    }>): Promise<void>;
    search(collectionName: string, vector: number[], limit?: number, filter?: Record<string, any>): Promise<SearchResult[]>;
    getPoint(collectionName: string, id: string | number): Promise<{
        id: string | number;
        payload?: Record<string, any>;
    } | null>;
    deletePoints(collectionName: string, ids: (string | number)[]): Promise<void>;
    /**
     * Deletes points matching a filter condition.
     * Useful for deleting all chunks associated with a specific file path.
     */
    deletePointsByFilter(collectionName: string, filter: Record<string, any>): Promise<void>;
    /**
     * Performs hybrid search combining semantic vector search with sparse vector (keyword) search
     * using Reciprocal Rank Fusion (RRF) to combine results
     */
    hybridSearch(collectionName: string, denseVector: number[], sparseVector: SparseVector, limit?: number, filter?: Record<string, any>, _semanticWeight?: number): Promise<SearchResult[]>;
    /**
     * Adds points with both dense and sparse vectors for hybrid search
     */
    addPointsWithSparse(collectionName: string, points: Array<{
        id: string | number;
        vector: number[];
        sparseVector: SparseVector;
        payload?: Record<string, any>;
    }>): Promise<void>;
}
//# sourceMappingURL=client.d.ts.map