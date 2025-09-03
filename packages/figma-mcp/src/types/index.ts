import { z } from 'zod';

// Figma API Types
export const FigmaNodeSchema: z.ZodType<any> = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  visible: z.boolean().optional(),
  children: z.array(z.lazy(() => FigmaNodeSchema)).optional(),
  fills: z.array(z.any()).optional(),
  strokes: z.array(z.any()).optional(),
  strokeWeight: z.number().optional(),
  cornerRadius: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  x: z.number().optional(),
  y: z.number().optional(),
  absoluteBoundingBox: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number()
  }).optional(),
  styles: z.record(z.string(), z.string()).optional(),
  componentId: z.string().optional(),
  componentProperties: z.record(z.string(), z.any()).optional()
});

export const FigmaFileSchema = z.object({
  document: FigmaNodeSchema,
  components: z.record(z.string(), FigmaNodeSchema),
  styles: z.record(z.string(), z.any()),
  name: z.string(),
  lastModified: z.string(),
  thumbnailUrl: z.string().optional(),
  version: z.string(),
  schemaVersion: z.number()
});

export const FigmaProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  files: z.array(z.object({
    key: z.string(),
    name: z.string(),
    thumbnailUrl: z.string().optional(),
    lastModified: z.string()
  }))
});

// Design Token Types
export const DesignTokenSchema = z.object({
  name: z.string(),
  value: z.union([z.string(), z.number(), z.object({})]),
  type: z.enum(['color', 'spacing', 'typography', 'borderRadius', 'shadow', 'animation', 'component']),
  description: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.any()).optional()
});

export const DesignTokenGroupSchema = z.object({
  name: z.string(),
  tokens: z.array(DesignTokenSchema),
  description: z.string().optional(),
  category: z.string().optional()
});

export const DesignSystemSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string().optional(),
  tokens: z.array(DesignTokenGroupSchema),
  metadata: z.record(z.string(), z.any()).optional()
});

// MCP Types
export const MCPRequestSchema = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.union([z.string(), z.number()]),
  method: z.string(),
  params: z.any().optional()
});

export const MCPResponseSchema = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.union([z.string(), z.number()]),
  result: z.any().optional(),
  error: z.object({
    code: z.number(),
    message: z.string(),
    data: z.any().optional()
  }).optional()
});

// Figma MCP Specific Types
export const FigmaMCPServerConfig = z.object({
  figmaAccessToken: z.string(),
  figmaTeamId: z.string().optional(),
  figmaProjectId: z.string().optional(),
  designSystemFileKey: z.string().optional(),
  webhookUrl: z.string().optional(),
  syncInterval: z.number().default(300000), // 5 minutes
  maxRetries: z.number().default(3),
  retryDelay: z.number().default(1000)
});

export const FigmaSyncResult = z.object({
  success: z.boolean(),
  tokensSynced: z.number(),
  componentsSynced: z.number(),
  errors: z.array(z.string()),
  warnings: z.array(z.string()),
  timestamp: z.string()
});

export const FigmaValidationResult = z.object({
  isValid: z.boolean(),
  issues: z.array(z.object({
    type: z.enum(['error', 'warning', 'info']),
    message: z.string(),
    nodeId: z.string().optional(),
    suggestion: z.string().optional()
  })),
  summary: z.object({
    totalNodes: z.number(),
    totalComponents: z.number(),
    totalStyles: z.number(),
    missingTokens: z.number(),
    inconsistentTokens: z.number()
  })
});

// Export all types
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
