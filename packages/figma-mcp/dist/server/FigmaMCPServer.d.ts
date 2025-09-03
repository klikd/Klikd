import { FigmaMCPServerConfig } from '../types/index.js';
export declare class FigmaMCPServer {
    private server;
    private figmaService;
    private config;
    constructor(config: FigmaMCPServerConfig);
    private setupToolHandlers;
    private handleGetFigmaFile;
    private handleExtractDesignTokens;
    private handleGetFigmaProject;
    private handleGetTeamProjects;
    private handleValidateFigmaFile;
    private handleGetFileImages;
    private handleSyncDesignSystem;
    start(): Promise<void>;
}
//# sourceMappingURL=FigmaMCPServer.d.ts.map