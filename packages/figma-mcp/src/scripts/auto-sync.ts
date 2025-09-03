#!/usr/bin/env node

import { config } from 'dotenv';
import { FigmaService } from '../services/FigmaService.js';
import { FigmaMCPServerConfig } from '../types/index.js';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import ora from 'ora';
import { Command } from 'commander';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    console.log(chalk.blue('🚀 Starting Klikd Design System Auto-Sync...\n'));
    
    // Ensure output directory exists
    if (!existsSync(this.options.outputDir)) {
      mkdirSync(this.options.outputDir, { recursive: true });
    }

    // Initial sync
    await this.performSync();

    if (this.options.watch) {
      await this.startWatching();
    }
  }

  private async performSync() {
    const spinner = ora('🔄 Syncing design system...').start();
    
    try {
      // Step 1: Generate design tokens from code
      const designTokens = this.generateDesignTokensFromCode();
      spinner.text = '📝 Generated design tokens from code...';

      // Step 2: Export tokens to various formats
      await this.exportTokens(designTokens);
      spinner.text = '💾 Exported tokens to multiple formats...';

      // Step 3: Validate Figma file (if enabled)
      if (this.options.validate) {
        spinner.text = '🔍 Validating Figma file...';
        await this.validateFigmaFile();
      }

      // Step 4: Generate additional outputs
      if (this.options.generateTypes) {
        spinner.text = '🔧 Generating TypeScript types...';
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

  private generateDesignTokensFromCode() {
    const designTokens = [];
    
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

  private async exportTokens(designTokens: any[]) {
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
    const categories = {};
    designTokens.forEach(token => {
      if (!categories[token.category]) categories[token.category] = [];
      categories[token.category].push(token);
    });

    Object.entries(categories).forEach(([category, tokens]) => {
      writeFileSync(
        join(this.options.outputDir, `${category}-tokens.json`),
        JSON.stringify({ category, tokens }, null, 2)
      );
    });
  }

  private async validateFigmaFile() {
    try {
      const validation = await this.figmaService.validateFile(this.options.fileKey);
      if (!validation.isValid) {
        console.log(chalk.yellow(`⚠️  Figma file validation issues found: ${validation.issues.length}`));
      }
    } catch (error) {
      console.log(chalk.yellow(`⚠️  Figma validation skipped: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  }

  private generateTypeScriptTypes(designTokens: any[]) {
    const categories = {};
    designTokens.forEach(token => {
      if (!categories[token.category]) categories[token.category] = [];
      categories[token.category].push(token);
    });

    let typeScriptCode = `// Klikd Design System Types
// Auto-generated - Do not edit manually
// Last sync: ${this.lastSyncTime?.toISOString()}

export namespace KlikdTokens {
`;

    Object.entries(categories).forEach(([category, tokens]) => {
      typeScriptCode += `\n  // ${category} tokens (${tokens.length})\n`;
      
      tokens.forEach(token => {
        const typeName = token.name.replace(/[.-]/g, '_');
        const value = typeof token.value === 'string' ? `'${token.value}'` : token.value;
        typeScriptCode += `  export const ${typeName} = ${value}; // ${token.description}\n`;
      });
    });
    
    typeScriptCode += `\n  // All tokens\n  export const all = {\n`;
    designTokens.forEach(token => {
      const typeName = token.name.replace(/[.-]/g, '_');
      typeScriptCode += `    ${typeName},\n`;
    });
    typeScriptCode += `  } as const;\n}\n`;
    
    writeFileSync(join(this.options.outputDir, 'klikd-tokens.ts'), typeScriptCode);
  }

  private generateCSSVariables(designTokens: any[]) {
    let cssCode = `/* Klikd Design System CSS Variables */
/* Auto-generated - Do not edit manually */
/* Last sync: ${this.lastSyncTime?.toISOString()} */

:root {
`;

    designTokens.forEach(token => {
      const cssVarName = `--klikd-${token.name.replace(/[.-]/g, '-')}`;
      cssCode += `  ${cssVarName}: ${token.value}; /* ${token.description} */\n`;
    });

    cssCode += `}\n`;
    writeFileSync(join(this.options.outputDir, 'klikd-tokens.css'), cssCode);
  }

  private generateSCSSVariables(designTokens: any[]) {
    let scssCode = `// Klikd Design System SCSS Variables
// Auto-generated - Do not edit manually
// Last sync: ${this.lastSyncTime?.toISOString()}

`;

    designTokens.forEach(token => {
      const scssVarName = `$klikd-${token.name.replace(/[.-]/g, '-')}`;
      scssCode += `${scssVarName}: ${token.value}; // ${token.description}\n`;
    });

    writeFileSync(join(this.options.outputDir, 'klikd-tokens.scss'), scssCode);
  }

  private generateStorybookConfig(designTokens: any[]) {
    const categories = {};
    designTokens.forEach(token => {
      if (!categories[token.category]) categories[token.category] = [];
      categories[token.category].push(token);
    });

    const storybookConfig = {
      title: 'Klikd Design System',
      parameters: {
        designTokens: {
          categories,
          metadata: {
            generatedAt: this.lastSyncTime?.toISOString(),
            totalTokens: designTokens.length
          }
        }
      }
    };

    writeFileSync(
      join(this.options.outputDir, 'storybook-config.json'),
      JSON.stringify(storybookConfig, null, 2)
    );
  }

  private async startWatching() {
    this.isWatching = true;
    console.log(chalk.blue(`\n👀 Watching for changes (sync every ${this.options.interval}ms)...`));
    console.log(chalk.gray('Press Ctrl+C to stop watching\n'));

    const interval = setInterval(async () => {
      if (!this.isWatching) {
        clearInterval(interval);
        return;
      }

      try {
        await this.performSync();
      } catch (error) {
        console.error(chalk.red(`❌ Watch sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    }, this.options.interval);

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      this.isWatching = false;
      clearInterval(interval);
      console.log(chalk.blue('\n👋 Stopping auto-sync...'));
      process.exit(0);
    });
  }
}

async function main() {
  const program = new Command();
  
  program
    .name('klikd-auto-sync')
    .description('Automatically sync Klikd design system between code and Figma')
    .version('1.0.0')
    .requiredOption('-f, --file-key <key>', 'Figma file key to sync with')
    .option('-o, --output-dir <path>', 'Output directory for generated files', './design-system-output')
    .option('-w, --watch', 'Watch for changes and auto-sync', false)
    .option('-i, --interval <ms>', 'Sync interval in milliseconds when watching', '30000')
    .option('-v, --validate', 'Validate Figma file during sync', true)
    .option('--generate-types', 'Generate TypeScript types', true)
    .option('--generate-css', 'Generate CSS variables', true)
    .option('--generate-scss', 'Generate SCSS variables', true)
    .option('--generate-storybook', 'Generate Storybook configuration', true)
    .action(async (options) => {
      const figmaAccessToken = process.env.FIGMA_ACCESS_TOKEN;
      if (!figmaAccessToken) {
        console.error(chalk.red('❌ FIGMA_ACCESS_TOKEN environment variable is required'));
        process.exit(1);
      }

      const config: FigmaMCPServerConfig = {
        figmaAccessToken,
      };

      const syncManager = new AutoSyncManager(config, {
        fileKey: options.fileKey,
        outputDir: options.outputDir,
        watch: options.watch,
        interval: parseInt(options.interval),
        validate: options.validate,
        generateTypes: options.generateTypes,
        generateCSS: options.generateCSS,
        generateSCSS: options.generateSCSS,
        generateStorybook: options.generateStorybook,
      });

      await syncManager.start();
    });

  program.parse(process.argv);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { AutoSyncManager, main };
