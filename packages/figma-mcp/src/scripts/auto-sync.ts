#!/usr/bin/env node

import { config } from 'dotenv';
import { FigmaService } from '../services/FigmaService.js';
import { FigmaMCPServerConfig, DesignToken } from '../types/index.js';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import ora from 'ora';
import { Command } from 'commander';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const _dirname = dirname(__filename);

// Klikd Design System from your repository
const KlikdDesignSystem = {
  colors: {
    primary: {
      klikd_green: '#ECFF00',
      klikd_black: '#0B0B0B',
      klikd_white: '#FFFFFF',
    },
    ui: {
      dark_bg: '#0B0B0B',
      soft_gray: '#999999',
      border_gray: '#333333',
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#FF6B6B',
      info: '#2196F3',
    },
    gradients: {
      primary: ['#ECFF00', '#B8CC00'],
      dark: ['#0B0B0B', '#1A1A1A'],
    },
  },
  typography: {
    fontFamily: 'Inter',
    sizes: {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
      xxl: 20,
      xxxl: 24,
    },
    weights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 20,
  },
};

interface SyncOptions {
  fileKey: string;
  outputDir: string;
  watch: boolean;
  interval: number;
  validate: boolean;
  generateTypes: boolean;
  generateCSS: boolean;
  generateSCSS: boolean;
  generateStorybook: boolean;
}

class AutoSyncManager {
  private figmaService: FigmaService;
  private options: SyncOptions;
  private isWatching: boolean = false;
  private lastSyncTime: Date | null = null;

  constructor(config: FigmaMCPServerConfig, options: SyncOptions) {
    this.figmaService = new FigmaService(config);
    this.options = options;
  }

  async start() {
    if (this.options.watch) {
      await this.startWatching();
    } else {
      await this.sync();
    }
  }

  private async startWatching() {
    this.isWatching = true;
    console.log(chalk.blue(`🔄 Starting watch mode - syncing every ${this.options.interval}ms`));
    
    while (this.isWatching) {
      try {
        await this.sync();
        await new Promise(resolve => setTimeout(resolve, this.options.interval));
      } catch (error) {
        console.error(chalk.red(`❌ Watch sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
        await new Promise(resolve => setTimeout(resolve, this.options.interval));
      }
    }
  }

  async stop() {
    this.isWatching = false;
    console.log(chalk.blue('⏹️  Watch mode stopped'));
  }

  private async sync() {
    const spinner = ora('🔄 Starting design system sync...').start();
    
    try {
      // Ensure output directory exists
      if (!existsSync(this.options.outputDir)) {
        mkdirSync(this.options.outputDir, { recursive: true });
      }

      spinner.text = '🎨 Generating design tokens from code...';
      const designTokens: DesignToken[] = this.generateDesignTokensFromCode();

      if (this.options.validate) {
        spinner.text = '🔍 Validating Figma file...';
        await this.validateFigmaFile();
      }

      spinner.text = '📤 Exporting design tokens...';
      await this.exportTokens(designTokens);

      if (this.options.generateTypes) {
        spinner.text = '📝 Generating TypeScript types...';
        this.generateTypeScriptTypes(designTokens);
      }

      if (this.options.generateCSS) {
        spinner.text = '🎨 Generating CSS variables...';
        this.generateCSSVariables(designTokens);
      }

      if (this.options.generateSCSS) {
        spinner.text = '🎨 Generating SCSS variables...';
        this.generateSCSSVariables(designTokens);
      }

      if (this.options.generateStorybook) {
        spinner.text = '📚 Generating Storybook configuration...';
        this.generateStorybookConfig(designTokens);
      }

      this.lastSyncTime = new Date();
      spinner.succeed(chalk.green(`✅ Sync completed at ${this.lastSyncTime.toLocaleTimeString()}`));
      
      console.log(chalk.green(`\n📊 Sync Summary:`));
      console.log(chalk.green(`  • Generated ${designTokens.length} design tokens`));
      console.log(chalk.green(`  • Exported to: ${this.options.outputDir}`));
      console.log(chalk.green(`  • Last sync: ${this.lastSyncTime.toLocaleString()}`));

    } catch (error) {
      spinner.fail(chalk.red(`❌ Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
      throw error;
    }
  }

  private generateDesignTokensFromCode(): DesignToken[] {
    const designTokens: DesignToken[] = [];
    
    // Convert colors to tokens
    Object.entries(KlikdDesignSystem.colors.primary).forEach(([name, value]) => {
      designTokens.push({
        name: `color.primary.${name}`,
        value,
        type: 'color',
        category: 'primary',
        description: `Klikd primary brand color: ${name}`
      });
    });
    
    Object.entries(KlikdDesignSystem.colors.ui).forEach(([name, value]) => {
      designTokens.push({
        name: `color.ui.${name}`,
        value,
        type: 'color',
        category: 'ui',
        description: `Klikd UI color: ${name}`
      });
    });
    
    // Convert typography to tokens
    Object.entries(KlikdDesignSystem.typography.sizes).forEach(([name, value]) => {
      designTokens.push({
        name: `typography.size.${name}`,
        value,
        type: 'typography',
        category: 'typography',
        description: `Font size: ${name}`
      });
    });
    
    // Convert spacing to tokens
    Object.entries(KlikdDesignSystem.spacing).forEach(([name, value]) => {
      designTokens.push({
        name: `spacing.${name}`,
        value,
        type: 'spacing',
        category: 'spacing',
        description: `Spacing unit: ${name}`
      });
    });
    
    // Convert border radius to tokens
    Object.entries(KlikdDesignSystem.borderRadius).forEach(([name, value]) => {
      designTokens.push({
        name: `borderRadius.${name}`,
        value,
        type: 'borderRadius',
        category: 'borderRadius',
        description: `Border radius: ${name}`
      });
    });
    
    return designTokens;
  }

  private async exportTokens(designTokens: DesignToken[]) {
    const tokenData = {
      name: 'Klikd Design System',
      version: '1.0.0',
      description: 'Official Klikd brand design system',
      tokens: designTokens,
      metadata: {
        generatedAt: new Date().toISOString(),
        source: 'Klikd Repository',
        totalTokens: designTokens.length,
        lastSync: this.lastSyncTime?.toISOString()
      }
    };

    // Export JSON
    writeFileSync(
      join(this.options.outputDir, 'design-tokens.json'),
      JSON.stringify(tokenData, null, 2)
    );

    // Export grouped by category
    const groupedTokens: Record<string, DesignToken[]> = {};
    designTokens.forEach(token => {
      const category = token.category || 'other';
      if (!groupedTokens[category]) {
        groupedTokens[category] = [];
      }
      groupedTokens[category].push(token);
    });

    Object.entries(groupedTokens).forEach(([category, tokens]) => {
      const categoryData = {
        name: `${category} tokens`,
        category,
        tokens,
        metadata: {
          generatedAt: new Date().toISOString(),
          count: tokens.length
        }
      };

      writeFileSync(
        join(this.options.outputDir, `${category}-tokens.json`),
        JSON.stringify(categoryData, null, 2)
      );
    });

    console.log(chalk.green(`✅ Exported ${designTokens.length} design tokens to ${this.options.outputDir}`));
  }

  private generateTypeScriptTypes(designTokens: DesignToken[]) {
    let typeScriptCode = `// Auto-generated TypeScript types for Klikd Design System
// Generated at: ${new Date().toISOString()}

export interface DesignToken {
  name: string;
  value: string | number | Record<string, unknown>;
  type: 'color' | 'spacing' | 'typography' | 'borderRadius' | 'shadow' | 'animation' | 'component';
  description?: string;
  category?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface DesignTokenGroup {
  name: string;
  category: string;
  tokens: DesignToken[];
  metadata?: Record<string, unknown>;
}

export interface DesignSystem {
  name: string;
  version: string;
  description?: string;
  tokens: DesignTokenGroup[];
  metadata?: Record<string, unknown>;
}

// Generated token constants
export const DESIGN_TOKENS: DesignToken[] = ${JSON.stringify(designTokens, null, 2)};

// Token counts by category
export const TOKEN_COUNTS = {
  totalTokens: designTokens.length,
`;

    // Group tokens by category for the counts
    const groupedTokens: Record<string, DesignToken[]> = {};
    designTokens.forEach(token => {
      const category = token.category || 'other';
      if (!groupedTokens[category]) {
        groupedTokens[category] = [];
      }
      groupedTokens[category].push(token);
    });

    Object.entries(groupedTokens).forEach(([category, tokens]) => {
      typeScriptCode += `\n  // ${category} tokens (${tokens.length})\n`;
      typeScriptCode += `  ${category}: ${tokens.length},\n`;
    });

    typeScriptCode += `};

// Export the design system
export const KLIKD_DESIGN_SYSTEM: DesignSystem = {
  name: 'Klikd Design System',
  version: '1.0.0',
  description: 'Official Klikd brand design system',
  tokens: Object.entries(groupedTokens).map(([category, tokens]) => ({
    name: \`\${category} tokens\`,
    category,
    tokens,
    metadata: {
      count: tokens.length
    }
  })),
  metadata: {
    generatedAt: '${new Date().toISOString()}',
    totalTokens: designTokens.length
  }
};
`;

    writeFileSync(
      join(this.options.outputDir, 'design-tokens.types.ts'),
      typeScriptCode
    );

    console.log(chalk.green(`✅ Generated TypeScript types with ${designTokens.length} tokens`));
  }

  private generateCSSVariables(designTokens: DesignToken[]) {
    let cssCode = `/* Auto-generated CSS variables for Klikd Design System */
/* Generated at: ${new Date().toISOString()} */

:root {
`;

    designTokens.forEach(token => {
      const cssName = `--${token.name.replace(/\./g, '-')}`;
      cssCode += `  ${cssName}: ${token.value};\n`;
    });

    cssCode += `}

/* Token count: ${designTokens.length} */`;

    writeFileSync(
      join(this.options.outputDir, 'design-tokens.css'),
      cssCode
    );

    console.log(chalk.green(`✅ Generated CSS variables with ${designTokens.length} tokens`));
  }

  private generateSCSSVariables(designTokens: DesignToken[]) {
    let scssCode = `// Auto-generated SCSS variables for Klikd Design System
// Generated at: ${new Date().toISOString()}

`;

    designTokens.forEach(token => {
      const scssName = `$${token.name.replace(/\./g, '-')}`;
      scssCode += `${scssName}: ${token.value};\n`;
    });

    scssCode += `\n// Token count: ${designTokens.length}`;

    writeFileSync(
      join(this.options.outputDir, 'design-tokens.scss'),
      scssCode
    );

    console.log(chalk.green(`✅ Generated SCSS variables with ${designTokens.length} tokens`));
  }

  private generateStorybookConfig(_designTokens: DesignToken[]) {
    const storybookConfig = {
      title: 'Klikd Design System',
      parameters: {
        docs: {
          description: {
            component: 'Official Klikd brand design system tokens and components'
          }
        }
      },
      argTypes: {
        backgroundColor: {
          control: 'color'
        }
      }
    };

    writeFileSync(
      join(this.options.outputDir, '.storybook/main.js'),
      `module.exports = ${JSON.stringify(storybookConfig, null, 2)};`
    );

    console.log(chalk.green(`✅ Generated Storybook configuration`));
  }

  private async validateFigmaFile() {
    try {
      const validation = await this.figmaService.validateFigmaFile(this.options.fileKey);
      if (validation.isValid) {
        console.log(chalk.green(`✅ Figma file validation passed`));
      } else {
        console.log(chalk.yellow(`⚠️  Figma file validation warnings: ${validation.issues.length}`));
        validation.issues.forEach(issue => {
          console.log(chalk.yellow(`  • ${issue.type}: ${issue.message}`));
        });
      }
    } catch (error) {
      console.log(chalk.yellow(`⚠️  Figma validation skipped: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  }
}

// CLI setup
const program = new Command();

program
  .name('auto-sync')
  .description('Automatically sync design system between code and Figma')
  .version('1.0.0');

program
  .option('-f, --file-key <key>', 'Figma file key to sync with')
  .option('-o, --output-dir <dir>', 'Output directory for generated files', './design-system-output')
  .option('-w, --watch', 'Watch mode - continuously sync')
  .option('-i, --interval <ms>', 'Watch interval in milliseconds', '30000')
  .option('--validate', 'Validate Figma file before sync')
  .option('--generate-types', 'Generate TypeScript types')
  .option('--generate-css', 'Generate CSS variables')
  .option('--generate-scss', 'Generate SCSS variables')
  .option('--generate-storybook', 'Generate Storybook configuration');

program.parse();

const options = program.opts();

// Load environment variables
const figmaConfig: FigmaMCPServerConfig = {
  figmaAccessToken: process.env.FIGMA_ACCESS_TOKEN || '',
  figmaTeamId: process.env.FIGMA_TEAM_ID,
  figmaProjectId: process.env.FIGMA_PROJECT_ID,
  designSystemFileKey: process.env.FIGMA_DESIGN_SYSTEM_FILE_KEY,
  webhookUrl: process.env.FIGMA_WEBHOOK_URL,
  syncInterval: parseInt(process.env.FIGMA_SYNC_INTERVAL || '300000'),
  maxRetries: parseInt(process.env.FIGMA_MAX_RETRIES || '3'),
  retryDelay: parseInt(process.env.FIGMA_RETRY_DELAY || '1000')
};

if (!figmaConfig.figmaAccessToken) {
  console.error(chalk.red('❌ FIGMA_ACCESS_TOKEN environment variable is required'));
  process.exit(1);
}

const syncOptions: SyncOptions = {
  fileKey: options.fileKey || figmaConfig.designSystemFileKey || '',
  outputDir: options.outputDir,
  watch: options.watch,
  interval: parseInt(options.interval),
  validate: options.validate,
  generateTypes: options.generateTypes,
  generateCSS: options.generateCSS,
  generateSCSS: options.generateSCSS,
  generateStorybook: options.generateStorybook
};

if (!syncOptions.fileKey) {
  console.error(chalk.red('❌ Figma file key is required. Use -f option or set FIGMA_DESIGN_SYSTEM_FILE_KEY'));
  process.exit(1);
}

// Start the sync manager
const manager = new AutoSyncManager(figmaConfig, syncOptions);

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log(chalk.blue('\n🛑 Shutting down gracefully...'));
  await manager.stop();
  process.exit(0);
});

// Run the sync
manager.start().catch(error => {
  console.error(chalk.red(`❌ Fatal error: ${error instanceof Error ? error.message : 'Unknown error'}`));
  process.exit(1);
});
