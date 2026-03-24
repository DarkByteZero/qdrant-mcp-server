/**
 * Consolidated Zod schemas for all MCP tools
 *
 * Note: Schemas are exported as plain objects (not wrapped in z.object()) because
 * McpServer.registerTool() expects schemas in this format. The SDK internally
 * converts these to JSON Schema for the MCP protocol. Each property is a Zod
 * field definition that gets composed into the final schema by the SDK.
 */
import { z } from "zod";
export declare const CreateCollectionSchema: {
    name: z.ZodString;
    distance: z.ZodOptional<z.ZodEnum<{
        Cosine: "Cosine";
        Euclid: "Euclid";
        Dot: "Dot";
    }>>;
    enableHybrid: z.ZodOptional<z.ZodBoolean>;
};
export declare const DeleteCollectionSchema: {
    name: z.ZodString;
};
export declare const GetCollectionInfoSchema: {
    name: z.ZodString;
};
export declare const AddDocumentsSchema: {
    collection: z.ZodString;
    documents: z.ZodArray<z.ZodObject<{
        id: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
        text: z.ZodString;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, z.core.$strip>>;
};
export declare const DeleteDocumentsSchema: {
    collection: z.ZodString;
    ids: z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
};
export declare const SemanticSearchSchema: {
    collection: z.ZodString;
    query: z.ZodString;
    limit: z.ZodOptional<z.ZodNumber>;
    filter: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
};
export declare const HybridSearchSchema: {
    collection: z.ZodString;
    query: z.ZodString;
    limit: z.ZodOptional<z.ZodNumber>;
    filter: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
};
export declare const IndexCodebaseSchema: {
    path: z.ZodString;
    forceReindex: z.ZodOptional<z.ZodBoolean>;
    extensions: z.ZodOptional<z.ZodArray<z.ZodString>>;
    ignorePatterns: z.ZodOptional<z.ZodArray<z.ZodString>>;
};
export declare const SearchCodeSchema: {
    path: z.ZodString;
    query: z.ZodString;
    limit: z.ZodOptional<z.ZodNumber>;
    fileTypes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    pathPattern: z.ZodOptional<z.ZodString>;
};
export declare const ReindexChangesSchema: {
    path: z.ZodString;
};
export declare const GetIndexStatusSchema: {
    path: z.ZodString;
};
export declare const ClearIndexSchema: {
    path: z.ZodString;
};
export declare const IndexGitHistorySchema: {
    path: z.ZodString;
    forceReindex: z.ZodOptional<z.ZodBoolean>;
    sinceDate: z.ZodOptional<z.ZodString>;
    maxCommits: z.ZodOptional<z.ZodNumber>;
};
export declare const SearchGitHistorySchema: {
    path: z.ZodString;
    query: z.ZodString;
    limit: z.ZodOptional<z.ZodNumber>;
    commitTypes: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        test: "test";
        feat: "feat";
        fix: "fix";
        refactor: "refactor";
        docs: "docs";
        chore: "chore";
        style: "style";
        perf: "perf";
        build: "build";
        ci: "ci";
        revert: "revert";
        other: "other";
    }>>>;
    authors: z.ZodOptional<z.ZodArray<z.ZodString>>;
    dateFrom: z.ZodOptional<z.ZodString>;
    dateTo: z.ZodOptional<z.ZodString>;
};
export declare const IndexNewCommitsSchema: {
    path: z.ZodString;
};
export declare const GetGitIndexStatusSchema: {
    path: z.ZodString;
};
export declare const ClearGitIndexSchema: {
    path: z.ZodString;
};
export declare const ContextualSearchSchema: {
    path: z.ZodString;
    query: z.ZodString;
    codeLimit: z.ZodOptional<z.ZodNumber>;
    gitLimit: z.ZodOptional<z.ZodNumber>;
    correlate: z.ZodOptional<z.ZodBoolean>;
};
export declare const FederatedSearchSchema: {
    paths: z.ZodArray<z.ZodString>;
    query: z.ZodString;
    searchType: z.ZodOptional<z.ZodEnum<{
        git: "git";
        code: "code";
        both: "both";
    }>>;
    limit: z.ZodOptional<z.ZodNumber>;
};
//# sourceMappingURL=schemas.d.ts.map