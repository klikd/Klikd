import { FigmaFile, FigmaProject, DesignTokenGroup, FigmaMCPServerConfig } from '../types/index.js';
export declare class FigmaService {
    private client;
    private config;
    constructor(config: FigmaMCPServerConfig);
    /**
     * Get Figma file by key
     */
    getFile(fileKey: string): Promise<FigmaFile>;
    /**
     * Get Figma project by ID
     */
    getProject(projectId: string): Promise<FigmaProject>;
    /**
     * Get team projects
     */
    getTeamProjects(teamId: string): Promise<FigmaProject[]>;
    /**
     * Extract design tokens from Figma file
     */
    extractDesignTokens(fileKey: string): Promise<DesignTokenGroup[]>;
    /**
     * Extract color tokens from Figma nodes
     */
    private extractColorTokens;
    /**
     * Extract spacing tokens from Figma nodes
     */
    private extractSpacingTokens;
    /**
     * Extract typography tokens from Figma nodes
     */
    private extractTypographyTokens;
    /**
     * Extract component tokens from Figma components
     */
    private extractComponentTokens;
    /**
     * Convert RGBA values to hex color
     */
    private rgbaToHex;
    /**
     * Get file images
     */
    getFileImages(fileKey: string, nodeIds: string[], format?: 'png' | 'jpg' | 'svg', scale?: number): Promise<Record<string, string>>;
    /**
     * Get file comments
     */
    getFileComments(fileKey: string): Promise<any[]>;
    /**
     * Validate Figma file structure
     */
    validateFile(fileKey: string): Promise<{
        isValid: boolean;
        issues: string[];
    }>;
}
//# sourceMappingURL=FigmaService.d.ts.map