/**
 * Basic usage example for the Figma MCP package
 * 
 * This example demonstrates how to:
 * 1. Use the FigmaService directly
 * 2. Use the MCP Client
 * 3. Extract and process design tokens
 */

import { FigmaService, FigmaMCPClient } from '../src/index.js';
import { FigmaMCPServerConfig } from '../src/types/index.js';

// Example configuration
const config: FigmaMCPServerConfig = {
  figmaAccessToken: process.env.FIGMA_ACCESS_TOKEN!,
  figmaTeamId: process.env.FIGMA_TEAM_ID,
  figmaProjectId: process.env.FIGMA_PROJECT_ID,
  designSystemFileKey: process.env.FIGMA_DESIGN_SYSTEM_FILE_KEY,
  webhookUrl: process.env.FIGMA_WEBHOOK_URL,
  syncInterval: 300000, // 5 minutes
  maxRetries: 3,
  retryDelay: 1000
};

/**
 * Example 1: Using FigmaService directly
 */
async function exampleDirectService() {
  console.log('🚀 Example 1: Using FigmaService directly');
  
  try {
    const figmaService = new FigmaService(config);
    
    // Get file details
    const fileKey = 'your_figma_file_key_here';
    const file = await figmaService.getFile(fileKey);
    console.log(`📁 File loaded: ${file.name}`);
    
    // Extract design tokens
    const tokens = await figmaService.extractDesignTokens(fileKey);
    console.log(`🎨 Extracted ${tokens.length} token groups`);
    
    // Validate file
    const validation = await figmaService.validateFile(fileKey);
    console.log(`✅ File validation: ${validation.isValid ? 'PASSED' : 'FAILED'}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

/**
 * Example 2: Using MCP Client
 */
async function exampleMCPClient() {
  console.log('\n🚀 Example 2: Using MCP Client');
  
  try {
    const client = new FigmaMCPClient();
    
    // Connect to MCP server
    await client.connect();
    console.log('🔌 Connected to MCP server');
    
    // List available tools
    const tools = await client.listTools();
    console.log(`🛠️  Available tools: ${tools.length}`);
    
    // Extract design tokens via MCP
    const fileKey = 'your_figma_file_key_here';
    const tokens = await client.extractDesignTokens(fileKey);
    console.log(`🎨 Extracted ${tokens.length} token groups via MCP`);
    
    // Sync design system
    const result = await client.syncDesignSystem(fileKey, './output');
    console.log(`🔄 Sync result: ${result.tokensSynced} tokens synced`);
    
    // Disconnect
    await client.disconnect();
    console.log('🔌 Disconnected from MCP server');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

/**
 * Example 3: Processing design tokens
 */
async function exampleProcessTokens() {
  console.log('\n🚀 Example 3: Processing design tokens');
  
  try {
    const figmaService = new FigmaService(config);
    const fileKey = 'your_figma_file_key_here';
    
    // Extract tokens
    const tokenGroups = await figmaService.extractDesignTokens(fileKey);
    
    // Process color tokens
    const colorGroup = tokenGroups.find(g => g.name === 'colors');
    if (colorGroup) {
      console.log(`🎨 Found ${colorGroup.tokens.length} color tokens:`);
      colorGroup.tokens.forEach(token => {
        console.log(`  - ${token.name}: ${token.value}`);
      });
    }
    
    // Process spacing tokens
    const spacingGroup = tokenGroups.find(g => g.name === 'spacing');
    if (spacingGroup) {
      console.log(`📏 Found ${spacingGroup.tokens.length} spacing tokens:`);
      spacingGroup.tokens.forEach(token => {
        console.log(`  - ${token.name}: ${token.value}px`);
      });
    }
    
    // Process component tokens
    const componentGroup = tokenGroups.find(g => g.name === 'components');
    if (componentGroup) {
      console.log(`🧩 Found ${componentGroup.tokens.length} component tokens:`);
      componentGroup.tokens.forEach(token => {
        console.log(`  - ${token.name}: ${token.type}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

/**
 * Example 4: Error handling and retries
 */
async function exampleErrorHandling() {
  console.log('\n🚀 Example 4: Error handling and retries');
  
  try {
    const figmaService = new FigmaService(config);
    
    // Try to access a non-existent file
    try {
      await figmaService.getFile('invalid_file_key');
    } catch (error) {
      console.log('✅ Properly caught error for invalid file key');
      console.log(`   Error message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    // Try to extract tokens from invalid file
    try {
      await figmaService.extractDesignTokens('invalid_file_key');
    } catch (error) {
      console.log('✅ Properly caught error for token extraction');
      console.log(`   Error message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

/**
 * Main function to run all examples
 */
async function runExamples() {
  console.log('🎯 Figma MCP Package Examples\n');
  
  // Check if required environment variable is set
  if (!process.env.FIGMA_ACCESS_TOKEN) {
    console.log('⚠️  FIGMA_ACCESS_TOKEN environment variable not set');
    console.log('   Set it to run the examples with real Figma data');
    console.log('   Examples will show error handling instead\n');
  }
  
  await exampleDirectService();
  await exampleMCPClient();
  await exampleProcessTokens();
  await exampleErrorHandling();
  
  console.log('\n✨ Examples completed!');
}

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runExamples().catch(console.error);
}

export {
  exampleDirectService,
  exampleMCPClient,
  exampleProcessTokens,
  exampleErrorHandling,
  runExamples
};
