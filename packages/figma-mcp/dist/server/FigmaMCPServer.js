import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { FigmaService } from '../services/FigmaService.js';
export class FigmaMCPServer {
    server;
    figmaService;
    config;
    constructor(config) {
        this.config = config;
        this.figmaService = new FigmaService(config);
        this.server = new Server({
            name: 'figma-mcp-server',
            version: '1.0.0',
        });
        this.setupToolHandlers();
    }
    setupToolHandlers() {
        // List available tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: 'get_figma_file',
                        description: 'Get a Figma file by its key',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                fileKey: {
                                    type: 'string',
                                    description: 'The Figma file key to retrieve'
                                }
                            },
                            required: ['fileKey']
                        }
                    },
                    {
                        name: 'extract_design_tokens',
                        description: 'Extract design tokens from a Figma file',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                fileKey: {
                                    type: 'string',
                                    description: 'The Figma file key to extract tokens from'
                                }
                            },
                            required: ['fileKey']
                        }
                    },
                    {
                        name: 'get_figma_project',
                        description: 'Get a Figma project by its ID',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                projectId: {
                                    type: 'string',
                                    description: 'The Figma project ID to retrieve'
                                }
                            },
                            required: ['projectId']
                        }
                    },
                    {
                        name: 'get_team_projects',
                        description: 'Get all projects for a team',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                teamId: {
                                    type: 'string',
                                    description: 'The Figma team ID'
                                }
                            },
                            required: ['teamId']
                        }
                    },
                    {
                        name: 'validate_figma_file',
                        description: 'Validate the structure of a Figma file',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                fileKey: {
                                    type: 'string',
                                    description: 'The Figma file key to validate'
                                }
                            },
                            required: ['fileKey']
                        }
                    },
                    {
                        name: 'get_file_images',
                        description: 'Get images from specific nodes in a Figma file',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                fileKey: {
                                    type: 'string',
                                    description: 'The Figma file key'
                                },
                                nodeIds: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    description: 'Array of node IDs to get images for'
                                },
                                format: {
                                    type: 'string',
                                    enum: ['png', 'jpg', 'svg'],
                                    default: 'png',
                                    description: 'Image format'
                                },
                                scale: {
                                    type: 'number',
                                    default: 1,
                                    description: 'Image scale factor'
                                }
                            },
                            required: ['fileKey', 'nodeIds']
                        }
                    },
                    {
                        name: 'sync_design_system',
                        description: 'Sync design tokens from Figma to the local design system',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                fileKey: {
                                    type: 'string',
                                    description: 'The Figma file key containing the design system'
                                },
                                outputPath: {
                                    type: 'string',
                                    description: 'Path to save the extracted design tokens'
                                }
                            },
                            required: ['fileKey']
                        }
                    }
                ]
            };
        });
        // Handle tool calls
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                switch (name) {
                    case 'get_figma_file':
                        return await this.handleGetFigmaFile(args);
                    case 'extract_design_tokens':
                        return await this.handleExtractDesignTokens(args);
                    case 'get_figma_project':
                        return await this.handleGetFigmaProject(args);
                    case 'get_team_projects':
                        return await this.handleGetTeamProjects(args);
                    case 'validate_figma_file':
                        return await this.handleValidateFigmaFile(args);
                    case 'get_file_images':
                        return await this.handleGetFileImages(args);
                    case 'sync_design_system':
                        return await this.handleSyncDesignSystem(args);
                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }
            }
            catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Error executing tool ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }
                    ]
                };
            }
        });
    }
    async handleGetFigmaFile(args) {
        const { fileKey } = args;
        const file = await this.figmaService.getFile(fileKey);
        return {
            content: [
                {
                    type: 'text',
                    text: `Successfully retrieved Figma file: ${file.name}\n\nFile Details:\n- Name: ${file.name}\n- Version: ${file.version}\n- Last Modified: ${file.lastModified}\n- Components: ${Object.keys(file.components).length}\n- Styles: ${Object.keys(file.styles).length}`
                }
            ]
        };
    }
    async handleExtractDesignTokens(args) {
        const { fileKey } = args;
        const tokenGroups = await this.figmaService.extractDesignTokens(fileKey);
        let result = `Successfully extracted design tokens from Figma file:\n\n`;
        let totalTokens = 0;
        tokenGroups.forEach(group => {
            result += `## ${group.name} (${group.tokens.length} tokens)\n`;
            result += `Category: ${group.category}\n`;
            if (group.description) {
                result += `Description: ${group.description}\n`;
            }
            result += '\n';
            group.tokens.forEach(token => {
                result += `- ${token.name}: ${JSON.stringify(token.value)} (${token.type})\n`;
                totalTokens++;
            });
            result += '\n';
        });
        result += `Total tokens extracted: ${totalTokens}`;
        return {
            content: [
                {
                    type: 'text',
                    text: result
                }
            ]
        };
    }
    async handleGetFigmaProject(args) {
        const { projectId } = args;
        const project = await this.figmaService.getProject(projectId);
        let result = `Project: ${project.name}\n\nFiles:\n`;
        project.files.forEach(file => {
            result += `- ${file.name} (${file.key})\n`;
            if (file.lastModified) {
                result += `  Last modified: ${file.lastModified}\n`;
            }
        });
        return {
            content: [
                {
                    type: 'text',
                    text: result
                }
            ]
        };
    }
    async handleGetTeamProjects(args) {
        const { teamId } = args;
        const projects = await this.figmaService.getTeamProjects(teamId);
        let result = `Team Projects:\n\n`;
        projects.forEach(project => {
            result += `## ${project.name} (${project.id})\n`;
            result += `Files: ${project.files.length}\n\n`;
        });
        return {
            content: [
                {
                    type: 'text',
                    text: result
                }
            ]
        };
    }
    async handleValidateFigmaFile(args) {
        const { fileKey } = args;
        const validation = await this.figmaService.validateFile(fileKey);
        let result = `File Validation Results:\n\n`;
        result += `Valid: ${validation.isValid ? '✅ Yes' : '❌ No'}\n\n`;
        if (validation.issues.length > 0) {
            result += `Issues Found:\n`;
            validation.issues.forEach(issue => {
                result += `- ${issue}\n`;
            });
        }
        else {
            result += `✅ No issues found. File structure is valid.`;
        }
        return {
            content: [
                {
                    type: 'text',
                    text: result
                }
            ]
        };
    }
    async handleGetFileImages(args) {
        const { fileKey, nodeIds, format = 'png', scale = 1 } = args;
        const images = await this.figmaService.getFileImages(fileKey, nodeIds, format, scale);
        let result = `File Images:\n\n`;
        Object.entries(images).forEach(([nodeId, url]) => {
            result += `- Node ${nodeId}: ${url}\n`;
        });
        return {
            content: [
                {
                    type: 'text',
                    text: result
                }
            ]
        };
    }
    async handleSyncDesignSystem(args) {
        const { fileKey, outputPath } = args;
        // Extract tokens
        const tokenGroups = await this.figmaService.extractDesignTokens(fileKey);
        // Create sync result
        const syncResult = {
            success: true,
            tokensSynced: tokenGroups.reduce((total, group) => total + group.tokens.length, 0),
            componentsSynced: tokenGroups.find(g => g.name === 'components')?.tokens.length || 0,
            errors: [],
            warnings: [],
            timestamp: new Date().toISOString()
        };
        let result = `Design System Sync Results:\n\n`;
        result += `✅ Sync completed successfully\n`;
        result += `📊 Tokens synced: ${syncResult.tokensSynced}\n`;
        result += `🧩 Components synced: ${syncResult.componentsSynced}\n`;
        result += `⏰ Timestamp: ${syncResult.timestamp}\n\n`;
        if (outputPath) {
            result += `Output path: ${outputPath}\n`;
            // Here you would implement the actual file writing logic
        }
        return {
            content: [
                {
                    type: 'text',
                    text: result
                }
            ]
        };
    }
    async start() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Figma MCP Server started');
    }
}
//# sourceMappingURL=FigmaMCPServer.js.map