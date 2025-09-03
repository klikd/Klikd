#!/usr/bin/env node

import { config } from 'dotenv';
import { FigmaMCPServer } from './server/FigmaMCPServer.js';
import { FigmaMCPServerConfig } from './types/index.js';

// Load environment variables
config();

async function main() {
  try {
    // Get configuration from environment variables
    const figmaAccessToken = process.env.FIGMA_ACCESS_TOKEN;
    
    if (!figmaAccessToken) {
      console.error('❌ FIGMA_ACCESS_TOKEN environment variable is required');
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

    console.error('🚀 Starting Figma MCP Server...');
    console.error(`📁 Design System File: ${serverConfig.designSystemFileKey || 'Not specified'}`);
    console.error(`👥 Team ID: ${serverConfig.figmaTeamId || 'Not specified'}`);
    console.error(`📊 Project ID: ${serverConfig.figmaProjectId || 'Not specified'}`);

    const server = new FigmaMCPServer(serverConfig);
    await server.start();

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.error('\n🛑 Received SIGINT, shutting down gracefully...');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.error('\n🛑 Received SIGTERM, shutting down gracefully...');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to start Figma MCP Server:', error);
    process.exit(1);
  }
}

// Run the server
main().catch((error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});
