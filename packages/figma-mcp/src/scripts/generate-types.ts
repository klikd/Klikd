#!/usr/bin/env node

import { config } from 'dotenv';
import { FigmaService } from '../services/FigmaService.js';
import { FigmaMCPServerConfig, DesignToken, DesignTokenGroup } from '../types/index.js';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import ora from 'ora';
import { Command } from 'commander';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config();

interface GenerateTypesOptions {
  fileKey: string;
  outputPath: string;
  namespace: string;
  includeDescriptions: boolean;
  includeMetadata: boolean;
  strict: boolean;
}

async function generateTypes(options: GenerateTypesOptions): Promise<void> {
  const spinner = ora('Initializing Figma service...').start();

  try {
    // Get configuration from environment variables
    const figmaAccessToken = process.env.FIGMA_ACCESS_TOKEN;
    
    if (!figmaAccessToken) {
      spinner.fail('❌ FIGMA_ACCESS_TOKEN environment variable is required');
      process.exit(1);
    }

    const serverConfig: FigmaMCPServerConfig = {
      figmaAccessToken,
      figmaTeamId: process.env.FIGMA_TEAM_ID,
      figmaProjectId: process.env.FIGMA_PROJECT_ID,
      designSystemFileKey: process.env.FIGMA_DESIGN_SYSTEM_FILE_KEY,
      webhookUrl: process.env.FIGMA_WEBHOOK_URL,
      syncInterval: process.env.FIGMA_SYNC_INTERVAL ? parseInt(process.env.FIGMA_SYNC_INTERVAL) : 300000,
      maxRetries: process.env.FIGMA_MAX_RETRIES ? parseInt(process.env.FIGMA_MAX_RETRIES) : 3,
      retryDelay: process.env.FIGMA_RETRY_DELAY ? parseInt(process.env.FIGMA_RETRY_DELAY) : 1000
    };

    spinner.text = 'Connecting to Figma API...';
    const figmaService = new FigmaService(serverConfig);

    // Extract design tokens
    spinner.text = 'Extracting design tokens...';
    const tokenGroups = await figmaService.extractDesignTokens(options.fileKey);
    
    if (tokenGroups.length === 0) {
      spinner.warn('⚠️  No design tokens found in the file');
      return;
    }

    spinner.succeed(`✅ Extracted ${tokenGroups.reduce((total, group) => total + group.tokens.length, 0)} design tokens`);

    // Generate TypeScript types
    spinner.text = 'Generating TypeScript types...';
    const typesContent = generateTypeScriptTypes(tokenGroups, options);
    
    // Ensure output directory exists
    const outputDir = dirname(options.outputPath);
    mkdirSync(outputDir, { recursive: true });

    // Write output file
    writeFileSync(options.outputPath, typesContent, 'utf8');
    
    spinner.succeed(`✅ TypeScript types written to: ${options.outputPath}`);
    
    // Print summary
    console.log('\n📊 Type Generation Summary:');
    console.log(`  📁 File: ${options.fileKey}`);
    console.log(`  📝 Output: ${options.outputPath}`);
    console.log(`  🏷️  Namespace: ${options.namespace}`);
    console.log(`  📊 Total Groups: ${tokenGroups.length}`);
    console.log(`  🎨 Total Tokens: ${tokenGroups.reduce((total, group) => total + group.tokens.length, 0)}`);
    
    tokenGroups.forEach(group => {
      console.log(`    ${chalk.blue(group.name)}: ${chalk.green(group.tokens.length)} tokens`);
    });

  } catch (error) {
    spinner.fail(`❌ Failed to generate types: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
}

function generateTypeScriptTypes(tokenGroups: DesignTokenGroup[], options: GenerateTypesOptions): string {
  const namespace = options.namespace;
  let types = '';
  
  // Header
  types += `/**
 * Auto-generated TypeScript types from Figma design tokens
 * Generated on: ${new Date().toISOString()}
 * Source: Figma design system
 */
\n`;
  
  // Namespace declaration
  types += `export namespace ${namespace} {\n\n`;
  
  // Generate types for each token group
  tokenGroups.forEach(group => {
    const groupName = sanitizeTypeName(group.name);
    
    // Group interface
    types += `  /**
   * ${group.description || `${groupName} design tokens`}
   */\n`;
    types += `  export interface ${groupName} {\n`;
    
    group.tokens.forEach(token => {
      const tokenName = sanitizeTypeName(token.name);
      const tokenType = getTokenType(token.type, options.strict);
      const description = options.includeDescriptions && token.description ? `\n   * ${token.description}` : '';
      
      if (description) {
        types += `    /**${description}\n   */\n`;
      }
      types += `    ${tokenName}: ${tokenType};\n`;
    });
    
    types += `  }\n\n`;
    
    // Group values object
    types += `  /**
   * ${groupName} token values
   */\n`;
    types += `  export const ${groupName.toLowerCase()}: ${groupName} = {\n`;
    
    group.tokens.forEach(token => {
      const tokenName = sanitizeTypeName(token.name);
      const tokenValue = formatTokenValue(token, options);
      types += `    ${tokenName}: ${tokenValue},\n`;
    });
    
    types += `  } as const;\n\n`;
    
    // Group type
    types += `  /**
   * ${groupName} token type
   */\n`;
    types += `  export type ${groupName}Token = typeof ${groupName.toLowerCase()}[keyof typeof ${groupName.toLowerCase()}];\n\n`;
  });
  
  // Union type for all tokens
  const allGroupNames = tokenGroups.map(g => sanitizeTypeName(g.name));
  types += `  /**
   * All design token groups
   */\n`;
  types += `  export interface DesignTokens {\n`;
  allGroupNames.forEach(groupName => {
    types += `    ${groupName.toLowerCase()}: ${groupName};\n`;
  });
  types += `  }\n\n`;
  
  // All tokens object
  types += `  /**
   * All design tokens
   */\n`;
  types += `  export const designTokens: DesignTokens = {\n`;
  allGroupNames.forEach(groupName => {
    types += `    ${groupName.toLowerCase()}: ${groupName.toLowerCase()},\n`;
  });
  types += `  } as const;\n\n`;
  
  // Union type for all token values
  types += `  /**
   * Union type of all token values
   */\n`;
  types += `  export type DesignTokenValue = typeof designTokens[keyof typeof designTokens][keyof typeof designTokens[keyof typeof designTokens]];\n\n`;
  
  // Metadata types if requested
  if (options.includeMetadata) {
    types += `  /**
   * Token metadata types
   */\n`;
    types += `  export interface TokenMetadata {\n`;
    types += `    name: string;\n`;
    types += `    type: string;\n`;
    types += `    description?: string;\n`;
    types += `    category?: string;\n`;
    types += `    tags?: string[];\n`;
    types += `    metadata?: Record<string, any>;\n`;
    types += `  }\n\n`;
  }
  
  // Close namespace
  types += `}\n\n`;
  
  // Re-exports for convenience
  types += `// Re-exports for convenience\n`;
  types += `export type { ${namespace}.DesignTokens, ${namespace}.DesignTokenValue };\n`;
  types += `export const { designTokens } = ${namespace};\n`;
  
  return types;
}

function sanitizeTypeName(name: string): string {
  // Convert to PascalCase and remove invalid characters
  return name
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
    .replace(/^[0-9]/, '_$&'); // Prefix with underscore if starts with number
}

function getTokenType(type: string, strict: boolean): string {
  switch (type) {
    case 'color':
      return strict ? 'string' : 'string';
    case 'spacing':
      return strict ? 'number' : 'number';
    case 'typography':
      return strict ? 'string' : 'string';
    case 'borderRadius':
      return strict ? 'number' : 'number';
    case 'shadow':
      return strict ? 'string' : 'string';
    case 'animation':
      return strict ? 'string' : 'string';
    case 'component':
      return strict ? 'Record<string, any>' : 'any';
    default:
      return strict ? 'unknown' : 'any';
  }
}

function formatTokenValue(token: DesignToken, options: GenerateTypesOptions): string {
  if (typeof token.value === 'string') {
    return `"${token.value}"`;
  } else if (typeof token.value === 'number') {
    return token.value.toString();
  } else if (typeof token.value === 'object') {
    return JSON.stringify(token.value);
  } else {
    return JSON.stringify(token.value);
  }
}

// CLI setup
const program = new Command();

program
  .name('figma-generate-types')
  .description('Generate TypeScript types from Figma design tokens')
  .version('1.0.0')
  .requiredOption('-f, --file-key <key>', 'Figma file key to extract tokens from')
  .requiredOption('-o, --output-path <path>', 'Output TypeScript file path')
  .option('-n, --namespace <name>', 'TypeScript namespace name', 'FigmaTokens')
  .option('--include-descriptions', 'Include token descriptions in JSDoc comments')
  .option('--include-metadata', 'Include metadata types')
  .option('--strict', 'Use strict TypeScript types')
  .action(generateTypes);

// Parse command line arguments
program.parse(process.argv);
