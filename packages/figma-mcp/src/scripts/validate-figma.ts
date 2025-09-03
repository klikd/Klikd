#!/usr/bin/env node

import { config } from 'dotenv';
import { FigmaService } from '../services/FigmaService.js';
import { FigmaMCPServerConfig } from '../types/index.js';
import chalk from 'chalk';
import ora from 'ora';
import { Command } from 'commander';

// Load environment variables
config();

interface ValidateOptions {
  fileKey: string;
  detailed: boolean;
  checkComponents: boolean;
  checkStyles: boolean;
  checkStructure: boolean;
}

async function validateFigmaFile(options: ValidateOptions): Promise<void> {
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

    // Get file details
    spinner.text = 'Fetching file details...';
    const file = await figmaService.getFile(options.fileKey);
    
    spinner.succeed(`✅ File loaded: ${file.name}`);

    // Basic validation
    const basicValidation = await figmaService.validateFile(options.fileKey);
    
    console.log('\n📋 Basic Validation Results:');
    if (basicValidation.isValid) {
      console.log(chalk.green('✅ File structure is valid'));
    } else {
      console.log(chalk.red('❌ File structure has issues:'));
      basicValidation.issues.forEach(issue => {
        console.log(chalk.yellow(`  ⚠️  ${issue}`));
      });
    }

    // Detailed validation if requested
    if (options.detailed) {
      console.log('\n🔍 Detailed Analysis:');
      
      // File metadata
      console.log(chalk.blue('\n📁 File Information:'));
      console.log(`  Name: ${file.name}`);
      console.log(`  Version: ${file.version}`);
      console.log(`  Schema Version: ${file.schemaVersion}`);
      console.log(`  Last Modified: ${file.lastModified}`);
      
      // Components analysis
      if (options.checkComponents) {
        console.log(chalk.blue('\n🧩 Components Analysis:'));
        const componentCount = Object.keys(file.components).length;
        console.log(`  Total Components: ${componentCount}`);
        
        if (componentCount > 0) {
          const componentTypes = new Map<string, number>();
          Object.values(file.components).forEach(component => {
            const type = component.type;
            componentTypes.set(type, (componentTypes.get(type) || 0) + 1);
          });
          
          console.log('  Component Types:');
          componentTypes.forEach((count, type) => {
            console.log(`    ${type}: ${count}`);
          });
        } else {
          console.log(chalk.yellow('  ⚠️  No components found'));
        }
      }
      
      // Styles analysis
      if (options.checkStyles) {
        console.log(chalk.blue('\n🎨 Styles Analysis:'));
        const styleCount = Object.keys(file.styles).length;
        console.log(`  Total Styles: ${styleCount}`);
        
        if (styleCount > 0) {
          const styleTypes = new Map<string, number>();
          Object.values(file.styles).forEach((style: any) => {
            const type = style.styleType || 'unknown';
            styleTypes.set(type, (styleTypes.get(type) || 0) + 1);
          });
          
          console.log('  Style Types:');
          styleTypes.forEach((count, type) => {
            console.log(`    ${type}: ${count}`);
          });
        } else {
          console.log(chalk.yellow('  ⚠️  No styles found'));
        }
      }
      
      // Structure analysis
      if (options.checkStructure) {
        console.log(chalk.blue('\n🏗️  Structure Analysis:'));
        
        // Analyze document structure
        const analyzeNode = (node: any, depth: number = 0): { count: number; types: Map<string, number> } => {
          const types = new Map<string, number>();
          let count = 1;
          
          types.set(node.type, (types.get(node.type) || 0) + 1);
          
          if (node.children) {
            node.children.forEach((child: any) => {
              const childResult = analyzeNode(child, depth + 1);
              count += childResult.count;
              childResult.types.forEach((childCount, childType) => {
                types.set(childType, (types.get(childType) || 0) + childCount);
              });
            });
          }
          
          return { count, types };
        };
        
        const structure = analyzeNode(file.document);
        console.log(`  Total Nodes: ${structure.count}`);
        console.log('  Node Types:');
        structure.types.forEach((count, type) => {
          console.log(`    ${type}: ${count}`);
        });
        
        // Check for common design system patterns
        console.log(chalk.blue('\n🔍 Design System Patterns:'));
        
        // Check for color styles
        const hasColorStyles = Object.values(file.styles).some((style: any) => 
          style.styleType === 'FILL' || style.styleType === 'TEXT'
        );
        console.log(`  Color Styles: ${hasColorStyles ? '✅' : '❌'}`);
        
        // Check for text styles
        const hasTextStyles = Object.values(file.styles).some((style: any) => 
          style.styleType === 'TEXT'
        );
        console.log(`  Text Styles: ${hasTextStyles ? '✅' : '❌'}`);
        
        // Check for component variants
        const hasVariants = Object.values(file.components).some((component: any) => 
          component.componentProperties && Object.keys(component.componentProperties).length > 0
        );
        console.log(`  Component Variants: ${hasVariants ? '✅' : '❌'}`);
      }
    }

    // Summary
    console.log(chalk.blue('\n📊 Validation Summary:'));
    console.log(`  File: ${file.name}`);
    console.log(`  Status: ${basicValidation.isValid ? chalk.green('VALID') : chalk.red('INVALID')}`);
    console.log(`  Components: ${Object.keys(file.components).length}`);
    console.log(`  Styles: ${Object.keys(file.styles).length}`);
    
    if (basicValidation.issues.length > 0) {
      console.log(chalk.red(`  Issues: ${basicValidation.issues.length}`));
    }

  } catch (error) {
    spinner.fail(`❌ Failed to validate Figma file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
}

// CLI setup
const program = new Command();

program
  .name('figma-validate')
  .description('Validate Figma file structure and content')
  .version('1.0.0')
  .requiredOption('-f, --file-key <key>', 'Figma file key to validate')
  .option('-d, --detailed', 'Show detailed analysis')
  .option('--check-components', 'Analyze components in detail')
  .option('--check-styles', 'Analyze styles in detail')
  .option('--check-structure', 'Analyze document structure in detail')
  .action(validateFigmaFile);

// Parse command line arguments
program.parse(process.argv);
