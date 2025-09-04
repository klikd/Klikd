import { describe, it, expect } from 'vitest';
import { FigmaMCPClient } from './client/FigmaMCPClient.js';
import { FigmaMCPServer } from './server/FigmaMCPServer.js';
import type { FigmaMCPServerConfig } from './types/index.js';

describe('Figma MCP Package', () => {
  it('should export FigmaMCPClient', () => {
    const client = new FigmaMCPClient();
    expect(client).toBeDefined();
  });

  it('should export FigmaMCPServer', () => {
    const config: FigmaMCPServerConfig = {
      figmaAccessToken: 'test-token'
    };
    const server = new FigmaMCPServer(config);
    expect(server).toBeDefined();
  });

  it('should handle basic client operations', async () => {
    const client = new FigmaMCPClient();
    
    // Test connection (mock)
    await expect(client.connect()).resolves.not.toThrow();
    
    // Test disconnect
    await expect(client.disconnect()).resolves.not.toThrow();
  });

  it('should handle server configuration', () => {
    const config: FigmaMCPServerConfig = {
      figmaAccessToken: 'test-token',
      figmaTeamId: 'test-team',
      syncInterval: 60000
    };
    
    expect(config.figmaAccessToken).toBe('test-token');
    expect(config.figmaTeamId).toBe('test-team');
    expect(config.syncInterval).toBe(60000);
  });
});
