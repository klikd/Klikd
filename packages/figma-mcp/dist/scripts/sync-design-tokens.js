#!/usr/bin/env node
import { config } from 'dotenv';
import { FigmaService } from '../services/FigmaService.js';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import ora from 'ora';
import { Command } from 'commander';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Load environment variables
config();
async function syncDesignTokens(options) {
    const spinner = ora('Initializing Figma service...').start();
    try {
        // Get configuration from environment variables
        const figmaAccessToken = process.env.FIGMA_ACCESS_TOKEN;
        if (!figmaAccessToken) {
            spinner.fail('❌ FIGMA_ACCESS_TOKEN environment variable is required');
            process.exit(1);
        }
        const serverConfig = {
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
        // Validate file if requested
        if (options.validate) {
            spinner.text = 'Validating Figma file...';
            const validation = await figmaService.validateFile(options.fileKey);
            if (!validation.isValid) {
                spinner.fail(`❌ File validation failed:\n${validation.issues.join('\n')}`);
                process.exit(1);
            }
            spinner.succeed('✅ File validation passed');
            spinner.start('Extracting design tokens...');
        }
        else {
            spinner.text = 'Extracting design tokens...';
        }
        // Extract design tokens
        const tokenGroups = await figmaService.extractDesignTokens(options.fileKey);
        if (tokenGroups.length === 0) {
            spinner.warn('⚠️  No design tokens found in the file');
            return;
        }
        spinner.succeed(`✅ Extracted ${tokenGroups.reduce((total, group) => total + group.tokens.length, 0)} design tokens`);
        if (options.dryRun) {
            console.log('\n📋 Dry run - tokens would be written to:', options.outputPath);
            console.log('\n📊 Token Summary:');
            tokenGroups.forEach(group => {
                console.log(`  ${chalk.blue(group.name)}: ${chalk.green(group.tokens.length)} tokens`);
            });
            return;
        }
        // Generate output based on format
        spinner.start('Generating output...');
        let output;
        switch (options.format) {
            case 'json':
                output = JSON.stringify(tokenGroups, null, 2);
                break;
            case 'css':
                output = generateCSSVariables(tokenGroups);
                break;
            case 'scss':
                output = generateSCSSVariables(tokenGroups);
                break;
            case 'ts':
                output = generateTypeScriptTokens(tokenGroups);
                break;
            default:
                throw new Error(`Unsupported format: ${options.format}`);
        }
        // Ensure output directory exists
        const outputDir = dirname(options.outputPath);
        mkdirSync(outputDir, { recursive: true });
        // Write output file
        writeFileSync(options.outputPath, output, 'utf8');
        spinner.succeed(`✅ Design tokens written to: ${options.outputPath}`);
        // Print summary
        console.log('\n📊 Sync Summary:');
        console.log(`  📁 File: ${options.fileKey}`);
        console.log(`  📝 Format: ${options.format.toUpperCase()}`);
        console.log(`  📊 Total Groups: ${tokenGroups.length}`);
        console.log(`  🎨 Total Tokens: ${tokenGroups.reduce((total, group) => total + group.tokens.length, 0)}`);
        tokenGroups.forEach(group => {
            console.log(`    ${chalk.blue(group.name)}: ${chalk.green(group.tokens.length)} tokens`);
        });
    }
    catch (error) {
        spinner.fail(`❌ Failed to sync design tokens: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
    }
}
function generateCSSVariables(tokenGroups) {
    let css = ':root {\n';
    tokenGroups.forEach(group => {
        css += `  /* ${group.name} */\n`;
        group.tokens.forEach((token) => {
            const variableName = `--${group.name}-${token.name}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
            css += `  ${variableName}: ${token.value};\n`;
        });
        css += '\n';
    });
    css += '}';
    return css;
}
function generateSCSSVariables(tokenGroups) {
    let scss = '';
    tokenGroups.forEach(group => {
        scss += `// ${group.name}\n`;
        group.tokens.forEach((token) => {
            const variableName = `$${group.name}-${token.name}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
            scss += `${variableName}: ${token.value};\n`;
        });
        scss += '\n';
    });
    return scss;
}
function generateTypeScriptTokens(tokenGroups) {
    let ts = 'export const designTokens = {\n';
    tokenGroups.forEach(group => {
        ts += `  ${group.name}: {\n`;
        group.tokens.forEach((token) => {
            const propertyName = token.name.replace(/[^a-zA-Z0-9]/g, '');
            ts += `    ${propertyName}: ${JSON.stringify(token.value)},\n`;
        });
        ts += '  },\n';
    });
    ts += '} as const;\n\n';
    ts += 'export type DesignTokens = typeof designTokens;';
    return ts;
}
// CLI setup
const program = new Command();
program
    .name('figma-sync-tokens')
    .description('Sync design tokens from Figma to local design system')
    .version('1.0.0')
    .requiredOption('-f, --file-key <key>', 'Figma file key to sync from')
    .requiredOption('-o, --output-path <path>', 'Output file path')
    .option('-F, --format <format>', 'Output format (json, css, scss, ts)', 'json')
    .option('-v, --validate', 'Validate Figma file before syncing')
    .option('--dry-run', 'Show what would be synced without writing files')
    .action(syncDesignTokens);
// Parse command line arguments
program.parse(process.argv);
//# sourceMappingURL=sync-design-tokens.js.map