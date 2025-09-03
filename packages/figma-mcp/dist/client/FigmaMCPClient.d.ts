import { DesignTokenGroup, FigmaSyncResult, FigmaValidationResult } from '../types/index.js';
export declare class FigmaMCPClient {
    private isConnected;
    constructor();
    /**
     * Connect to the Figma MCP server
     */
    connect(): Promise<void>;
    /**
     * Disconnect from the Figma MCP server
     */
    disconnect(): Promise<void>;
    /**
     * List available tools
     */
    listTools(): Promise<any[]>;
    /**
     * Get a Figma file
     */
    getFigmaFile(fileKey: string): Promise<any>;
    /**
     * Extract design tokens from a Figma file
     */
    extractDesignTokens(fileKey: string): Promise<DesignTokenGroup[]>;
    /**
     * Validate a Figma file
     */
    validateFigmaFile(fileKey: string): Promise<FigmaValidationResult>;
    /**
     * Sync design system
     */
    syncDesignSystem(fileKey: string, outputPath?: string): Promise<FigmaSyncResult>;
    /**
     * Check if the client is connected
     */
    get connected(): boolean;
}
//# sourceMappingURL=FigmaMCPClient.d.ts.map