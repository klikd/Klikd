import axios, { AxiosInstance } from 'axios';
import { FigmaFile, FigmaNode, FigmaProject, DesignToken, DesignTokenGroup, FigmaMCPServerConfig } from '../types/index.js';
import { FigmaNodeSchema, FigmaFileSchema, FigmaProjectSchema } from '../types/index.js';

export class FigmaService {
  private client: AxiosInstance;
  private config: FigmaMCPServerConfig;

  constructor(config: FigmaMCPServerConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: 'https://api.figma.com/v1',
      headers: {
        'X-Figma-Token': config.figmaAccessToken,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get Figma file by key
   */
  async getFile(fileKey: string): Promise<FigmaFile> {
    try {
      const response = await this.client.get(`/files/${fileKey}`);
      const validatedData = FigmaFileSchema.parse(response.data);
      return validatedData;
    } catch (error) {
      throw new Error(`Failed to fetch Figma file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get Figma project by ID
   */
  async getProject(projectId: string): Promise<FigmaProject> {
    try {
      const response = await this.client.get(`/projects/${projectId}`);
      const validatedData = FigmaProjectSchema.parse(response.data);
      return validatedData;
    } catch (error) {
      throw new Error(`Failed to fetch Figma project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get team projects
   */
  async getTeamProjects(teamId: string): Promise<FigmaProject[]> {
    try {
      const response = await this.client.get(`/teams/${teamId}/projects`);
      const projects = response.data.projects || [];
      return projects.map((project: any) => FigmaProjectSchema.parse(project));
    } catch (error) {
      throw new Error(`Failed to fetch team projects: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract design tokens from Figma file
   */
  async extractDesignTokens(fileKey: string): Promise<DesignTokenGroup[]> {
    try {
      const file = await this.getFile(fileKey);
      const tokens: DesignTokenGroup[] = [];

      // Extract color tokens
      const colorTokens = this.extractColorTokens(file.document);
      if (colorTokens.length > 0) {
        tokens.push({
          name: 'colors',
          tokens: colorTokens,
          category: 'color',
          description: 'Color tokens extracted from Figma'
        });
      }

      // Extract spacing tokens
      const spacingTokens = this.extractSpacingTokens(file.document);
      if (spacingTokens.length > 0) {
        tokens.push({
          name: 'spacing',
          tokens: spacingTokens,
          category: 'spacing',
          description: 'Spacing tokens extracted from Figma'
        });
      }

      // Extract typography tokens
      const typographyTokens = this.extractTypographyTokens(file.document);
      if (typographyTokens.length > 0) {
        tokens.push({
          name: 'typography',
          tokens: typographyTokens,
          category: 'typography',
          description: 'Typography tokens extracted from Figma'
        });
      }

      // Extract component tokens
      const componentTokens = this.extractComponentTokens(file.components);
      if (componentTokens.length > 0) {
        tokens.push({
          name: 'components',
          tokens: componentTokens,
          category: 'component',
          description: 'Component tokens extracted from Figma'
        });
      }

      return tokens;
    } catch (error) {
      throw new Error(`Failed to extract design tokens: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract color tokens from Figma nodes
   */
  private extractColorTokens(node: FigmaNode): DesignToken[] {
    const tokens: DesignToken[] = [];

    const extractColors = (currentNode: FigmaNode) => {
      // Extract fills
      if (currentNode.fills && Array.isArray(currentNode.fills)) {
        currentNode.fills.forEach((fill: any, index: number) => {
          if (fill.type === 'SOLID' && fill.color) {
            const colorValue = this.rgbaToHex(fill.color.r, fill.color.g, fill.color.b, fill.color.a);
            tokens.push({
              name: `${currentNode.name}_fill_${index}`,
              value: colorValue,
              type: 'color',
              description: `Color from ${currentNode.name}`,
              category: 'color',
              tags: ['fill', currentNode.type]
            });
          }
        });
      }

      // Extract strokes
      if (currentNode.strokes && Array.isArray(currentNode.strokes)) {
        currentNode.strokes.forEach((stroke: any, index: number) => {
          if (stroke.type === 'SOLID' && stroke.color) {
            const colorValue = this.rgbaToHex(stroke.color.r, stroke.color.g, stroke.color.b, stroke.color.a);
            tokens.push({
              name: `${currentNode.name}_stroke_${index}`,
              value: colorValue,
              type: 'color',
              description: `Stroke color from ${currentNode.name}`,
              category: 'color',
              tags: ['stroke', currentNode.type]
            });
          }
        });
      }

      // Recursively process children
      if (currentNode.children) {
        currentNode.children.forEach(extractColors);
      }
    };

    extractColors(node);
    return tokens;
  }

  /**
   * Extract spacing tokens from Figma nodes
   */
  private extractSpacingTokens(node: FigmaNode): DesignToken[] {
    const tokens: DesignToken[] = [];

    const extractSpacing = (currentNode: FigmaNode) => {
      // Extract padding/margin from bounding box
      if (currentNode.absoluteBoundingBox) {
        const { width, height } = currentNode.absoluteBoundingBox;
        
        if (width > 0) {
          tokens.push({
            name: `${currentNode.name}_width`,
            value: Math.round(width),
            type: 'spacing',
            description: `Width of ${currentNode.name}`,
            category: 'spacing',
            tags: ['width', currentNode.type]
          });
        }

        if (height > 0) {
          tokens.push({
            name: `${currentNode.name}_height`,
            value: Math.round(height),
            type: 'spacing',
            description: `Height of ${currentNode.name}`,
            category: 'spacing',
            tags: ['height', currentNode.type]
          });
        }
      }

      // Extract corner radius
      if (currentNode.cornerRadius && currentNode.cornerRadius > 0) {
        tokens.push({
          name: `${currentNode.name}_radius`,
          value: Math.round(currentNode.cornerRadius),
          type: 'spacing',
          description: `Corner radius of ${currentNode.name}`,
          category: 'spacing',
          tags: ['radius', currentNode.type]
        });
      }

      // Recursively process children
      if (currentNode.children) {
        currentNode.children.forEach(extractSpacing);
      }
    };

    extractSpacing(node);
    return tokens;
  }

  /**
   * Extract typography tokens from Figma nodes
   */
  private extractTypographyTokens(node: FigmaNode): DesignToken[] {
    const tokens: DesignToken[] = [];

    const extractTypography = (currentNode: FigmaNode) => {
      // Extract text styles
      if (currentNode.styles && currentNode.styles.text) {
        // This would require additional API calls to get text style details
        // For now, we'll create a placeholder token
        tokens.push({
          name: `${currentNode.name}_text_style`,
          value: currentNode.styles.text,
          type: 'typography',
          description: `Text style from ${currentNode.name}`,
          category: 'typography',
          tags: ['text-style', currentNode.type]
        });
      }

      // Recursively process children
      if (currentNode.children) {
        currentNode.children.forEach(extractTypography);
      }
    };

    extractTypography(node);
    return tokens;
  }

  /**
   * Extract component tokens from Figma components
   */
  private extractComponentTokens(components: Record<string, FigmaNode>): DesignToken[] {
    const tokens: DesignToken[] = [];

    Object.entries(components).forEach(([id, component]) => {
      tokens.push({
        name: component.name,
        value: {
          id,
          type: component.type,
          description: `Component: ${component.name}`
        },
        type: 'component',
        description: `Figma component: ${component.name}`,
        category: 'component',
        tags: ['component', component.type]
      });
    });

    return tokens;
  }

  /**
   * Convert RGBA values to hex color
   */
  private rgbaToHex(r: number, g: number, b: number, a: number): string {
    const toHex = (value: number): string => {
      const hex = Math.round(value * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    const hexColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    
    if (a < 1) {
      const alpha = Math.round(a * 255).toString(16);
      return `${hexColor}${alpha.length === 1 ? '0' + alpha : alpha}`;
    }

    return hexColor;
  }

  /**
   * Get file images
   */
  async getFileImages(fileKey: string, nodeIds: string[], format: 'png' | 'jpg' | 'svg' = 'png', scale: number = 1): Promise<Record<string, string>> {
    try {
      const response = await this.client.get(`/images/${fileKey}`, {
        params: {
          ids: nodeIds.join(','),
          format,
          scale
        }
      });

      return response.data.images || {};
    } catch (error) {
      throw new Error(`Failed to fetch file images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get file comments
   */
  async getFileComments(fileKey: string): Promise<any[]> {
    try {
      const response = await this.client.get(`/files/${fileKey}/comments`);
      return response.data.comments || [];
    } catch (error) {
      throw new Error(`Failed to fetch file comments: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate Figma file structure
   */
  async validateFile(fileKey: string): Promise<{ isValid: boolean; issues: string[] }> {
    try {
      const file = await this.getFile(fileKey);
      const issues: string[] = [];

      // Check if file has components
      if (Object.keys(file.components).length === 0) {
        issues.push('No components found in the file');
      }

      // Check if file has styles
      if (Object.keys(file.styles).length === 0) {
        issues.push('No styles found in the file');
      }

      // Check document structure
      if (!file.document) {
        issues.push('No document structure found');
      }

      return {
        isValid: issues.length === 0,
        issues
      };
    } catch (error) {
      return {
        isValid: false,
        issues: [`Failed to validate file: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
    }
  }
}
