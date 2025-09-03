import { z } from 'zod';
export declare const FigmaNodeSchema: z.ZodType<any>;
export declare const FigmaFileSchema: z.ZodObject<{
    document: z.ZodType<any, z.ZodTypeDef, any>;
    components: z.ZodRecord<z.ZodString, z.ZodType<any, z.ZodTypeDef, any>>;
    styles: z.ZodRecord<z.ZodString, z.ZodAny>;
    name: z.ZodString;
    lastModified: z.ZodString;
    thumbnailUrl: z.ZodOptional<z.ZodString>;
    version: z.ZodString;
    schemaVersion: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    components: Record<string, any>;
    styles: Record<string, any>;
    name: string;
    lastModified: string;
    version: string;
    schemaVersion: number;
    document?: any;
    thumbnailUrl?: string | undefined;
}, {
    components: Record<string, any>;
    styles: Record<string, any>;
    name: string;
    lastModified: string;
    version: string;
    schemaVersion: number;
    document?: any;
    thumbnailUrl?: string | undefined;
}>;
export declare const FigmaProjectSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    files: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        name: z.ZodString;
        thumbnailUrl: z.ZodOptional<z.ZodString>;
        lastModified: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        lastModified: string;
        key: string;
        thumbnailUrl?: string | undefined;
    }, {
        name: string;
        lastModified: string;
        key: string;
        thumbnailUrl?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    files: {
        name: string;
        lastModified: string;
        key: string;
        thumbnailUrl?: string | undefined;
    }[];
}, {
    name: string;
    id: string;
    files: {
        name: string;
        lastModified: string;
        key: string;
        thumbnailUrl?: string | undefined;
    }[];
}>;
export declare const DesignTokenSchema: z.ZodObject<{
    name: z.ZodString;
    value: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>]>;
    type: z.ZodEnum<["color", "spacing", "typography", "borderRadius", "shadow", "animation", "component"]>;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    value: string | number | {};
    type: "color" | "spacing" | "typography" | "borderRadius" | "shadow" | "animation" | "component";
    name: string;
    description?: string | undefined;
    category?: string | undefined;
    tags?: string[] | undefined;
    metadata?: Record<string, any> | undefined;
}, {
    value: string | number | {};
    type: "color" | "spacing" | "typography" | "borderRadius" | "shadow" | "animation" | "component";
    name: string;
    description?: string | undefined;
    category?: string | undefined;
    tags?: string[] | undefined;
    metadata?: Record<string, any> | undefined;
}>;
export declare const DesignTokenGroupSchema: z.ZodObject<{
    name: z.ZodString;
    tokens: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        value: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>]>;
        type: z.ZodEnum<["color", "spacing", "typography", "borderRadius", "shadow", "animation", "component"]>;
        description: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        value: string | number | {};
        type: "color" | "spacing" | "typography" | "borderRadius" | "shadow" | "animation" | "component";
        name: string;
        description?: string | undefined;
        category?: string | undefined;
        tags?: string[] | undefined;
        metadata?: Record<string, any> | undefined;
    }, {
        value: string | number | {};
        type: "color" | "spacing" | "typography" | "borderRadius" | "shadow" | "animation" | "component";
        name: string;
        description?: string | undefined;
        category?: string | undefined;
        tags?: string[] | undefined;
        metadata?: Record<string, any> | undefined;
    }>, "many">;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    tokens: {
        value: string | number | {};
        type: "color" | "spacing" | "typography" | "borderRadius" | "shadow" | "animation" | "component";
        name: string;
        description?: string | undefined;
        category?: string | undefined;
        tags?: string[] | undefined;
        metadata?: Record<string, any> | undefined;
    }[];
    description?: string | undefined;
    category?: string | undefined;
}, {
    name: string;
    tokens: {
        value: string | number | {};
        type: "color" | "spacing" | "typography" | "borderRadius" | "shadow" | "animation" | "component";
        name: string;
        description?: string | undefined;
        category?: string | undefined;
        tags?: string[] | undefined;
        metadata?: Record<string, any> | undefined;
    }[];
    description?: string | undefined;
    category?: string | undefined;
}>;
export declare const DesignSystemSchema: z.ZodObject<{
    name: z.ZodString;
    version: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    tokens: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        tokens: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            value: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>]>;
            type: z.ZodEnum<["color", "spacing", "typography", "borderRadius", "shadow", "animation", "component"]>;
            description: z.ZodOptional<z.ZodString>;
            category: z.ZodOptional<z.ZodString>;
            tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        }, "strip", z.ZodTypeAny, {
            value: string | number | {};
            type: "color" | "spacing" | "typography" | "borderRadius" | "shadow" | "animation" | "component";
            name: string;
            description?: string | undefined;
            category?: string | undefined;
            tags?: string[] | undefined;
            metadata?: Record<string, any> | undefined;
        }, {
            value: string | number | {};
            type: "color" | "spacing" | "typography" | "borderRadius" | "shadow" | "animation" | "component";
            name: string;
            description?: string | undefined;
            category?: string | undefined;
            tags?: string[] | undefined;
            metadata?: Record<string, any> | undefined;
        }>, "many">;
        description: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        tokens: {
            value: string | number | {};
            type: "color" | "spacing" | "typography" | "borderRadius" | "shadow" | "animation" | "component";
            name: string;
            description?: string | undefined;
            category?: string | undefined;
            tags?: string[] | undefined;
            metadata?: Record<string, any> | undefined;
        }[];
        description?: string | undefined;
        category?: string | undefined;
    }, {
        name: string;
        tokens: {
            value: string | number | {};
            type: "color" | "spacing" | "typography" | "borderRadius" | "shadow" | "animation" | "component";
            name: string;
            description?: string | undefined;
            category?: string | undefined;
            tags?: string[] | undefined;
            metadata?: Record<string, any> | undefined;
        }[];
        description?: string | undefined;
        category?: string | undefined;
    }>, "many">;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    version: string;
    tokens: {
        name: string;
        tokens: {
            value: string | number | {};
            type: "color" | "spacing" | "typography" | "borderRadius" | "shadow" | "animation" | "component";
            name: string;
            description?: string | undefined;
            category?: string | undefined;
            tags?: string[] | undefined;
            metadata?: Record<string, any> | undefined;
        }[];
        description?: string | undefined;
        category?: string | undefined;
    }[];
    description?: string | undefined;
    metadata?: Record<string, any> | undefined;
}, {
    name: string;
    version: string;
    tokens: {
        name: string;
        tokens: {
            value: string | number | {};
            type: "color" | "spacing" | "typography" | "borderRadius" | "shadow" | "animation" | "component";
            name: string;
            description?: string | undefined;
            category?: string | undefined;
            tags?: string[] | undefined;
            metadata?: Record<string, any> | undefined;
        }[];
        description?: string | undefined;
        category?: string | undefined;
    }[];
    description?: string | undefined;
    metadata?: Record<string, any> | undefined;
}>;
export declare const MCPRequestSchema: z.ZodObject<{
    jsonrpc: z.ZodLiteral<"2.0">;
    id: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    method: z.ZodString;
    params: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    id: string | number;
    jsonrpc: "2.0";
    method: string;
    params?: any;
}, {
    id: string | number;
    jsonrpc: "2.0";
    method: string;
    params?: any;
}>;
export declare const MCPResponseSchema: z.ZodObject<{
    jsonrpc: z.ZodLiteral<"2.0">;
    id: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    result: z.ZodOptional<z.ZodAny>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodNumber;
        message: z.ZodString;
        data: z.ZodOptional<z.ZodAny>;
    }, "strip", z.ZodTypeAny, {
        code: number;
        message: string;
        data?: any;
    }, {
        code: number;
        message: string;
        data?: any;
    }>>;
}, "strip", z.ZodTypeAny, {
    id: string | number;
    jsonrpc: "2.0";
    result?: any;
    error?: {
        code: number;
        message: string;
        data?: any;
    } | undefined;
}, {
    id: string | number;
    jsonrpc: "2.0";
    result?: any;
    error?: {
        code: number;
        message: string;
        data?: any;
    } | undefined;
}>;
export declare const FigmaMCPServerConfig: z.ZodObject<{
    figmaAccessToken: z.ZodString;
    figmaTeamId: z.ZodOptional<z.ZodString>;
    figmaProjectId: z.ZodOptional<z.ZodString>;
    designSystemFileKey: z.ZodOptional<z.ZodString>;
    webhookUrl: z.ZodOptional<z.ZodString>;
    syncInterval: z.ZodDefault<z.ZodNumber>;
    maxRetries: z.ZodDefault<z.ZodNumber>;
    retryDelay: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    figmaAccessToken: string;
    syncInterval: number;
    maxRetries: number;
    retryDelay: number;
    figmaTeamId?: string | undefined;
    figmaProjectId?: string | undefined;
    designSystemFileKey?: string | undefined;
    webhookUrl?: string | undefined;
}, {
    figmaAccessToken: string;
    figmaTeamId?: string | undefined;
    figmaProjectId?: string | undefined;
    designSystemFileKey?: string | undefined;
    webhookUrl?: string | undefined;
    syncInterval?: number | undefined;
    maxRetries?: number | undefined;
    retryDelay?: number | undefined;
}>;
export declare const FigmaSyncResult: z.ZodObject<{
    success: z.ZodBoolean;
    tokensSynced: z.ZodNumber;
    componentsSynced: z.ZodNumber;
    errors: z.ZodArray<z.ZodString, "many">;
    warnings: z.ZodArray<z.ZodString, "many">;
    timestamp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    success: boolean;
    tokensSynced: number;
    componentsSynced: number;
    errors: string[];
    warnings: string[];
    timestamp: string;
}, {
    success: boolean;
    tokensSynced: number;
    componentsSynced: number;
    errors: string[];
    warnings: string[];
    timestamp: string;
}>;
export declare const FigmaValidationResult: z.ZodObject<{
    isValid: z.ZodBoolean;
    issues: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["error", "warning", "info"]>;
        message: z.ZodString;
        nodeId: z.ZodOptional<z.ZodString>;
        suggestion: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        type: "error" | "warning" | "info";
        nodeId?: string | undefined;
        suggestion?: string | undefined;
    }, {
        message: string;
        type: "error" | "warning" | "info";
        nodeId?: string | undefined;
        suggestion?: string | undefined;
    }>, "many">;
    summary: z.ZodObject<{
        totalNodes: z.ZodNumber;
        totalComponents: z.ZodNumber;
        totalStyles: z.ZodNumber;
        missingTokens: z.ZodNumber;
        inconsistentTokens: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        totalNodes: number;
        totalComponents: number;
        totalStyles: number;
        missingTokens: number;
        inconsistentTokens: number;
    }, {
        totalNodes: number;
        totalComponents: number;
        totalStyles: number;
        missingTokens: number;
        inconsistentTokens: number;
    }>;
}, "strip", z.ZodTypeAny, {
    issues: {
        message: string;
        type: "error" | "warning" | "info";
        nodeId?: string | undefined;
        suggestion?: string | undefined;
    }[];
    isValid: boolean;
    summary: {
        totalNodes: number;
        totalComponents: number;
        totalStyles: number;
        missingTokens: number;
        inconsistentTokens: number;
    };
}, {
    issues: {
        message: string;
        type: "error" | "warning" | "info";
        nodeId?: string | undefined;
        suggestion?: string | undefined;
    }[];
    isValid: boolean;
    summary: {
        totalNodes: number;
        totalComponents: number;
        totalStyles: number;
        missingTokens: number;
        inconsistentTokens: number;
    };
}>;
export type FigmaNode = z.infer<typeof FigmaNodeSchema>;
export type FigmaFile = z.infer<typeof FigmaFileSchema>;
export type FigmaProject = z.infer<typeof FigmaProjectSchema>;
export type DesignToken = z.infer<typeof DesignTokenSchema>;
export type DesignTokenGroup = z.infer<typeof DesignTokenGroupSchema>;
export type DesignSystem = z.infer<typeof DesignSystemSchema>;
export type MCPRequest = z.infer<typeof MCPRequestSchema>;
export type MCPResponse = z.infer<typeof MCPResponseSchema>;
export type FigmaMCPServerConfig = z.infer<typeof FigmaMCPServerConfig>;
export type FigmaSyncResult = z.infer<typeof FigmaSyncResult>;
export type FigmaValidationResult = z.infer<typeof FigmaValidationResult>;
//# sourceMappingURL=index.d.ts.map