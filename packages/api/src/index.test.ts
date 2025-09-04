import { describe, it, expect } from 'vitest';
import { KlikdApiServer, type ApiConfig, type ApiServer } from './index.js';

describe('Klikd API Server', () => {
  it('should create an API server instance', () => {
    const config: ApiConfig = {
      port: 3000,
      host: 'localhost',
      environment: 'development'
    };
    
    const server = new KlikdApiServer(config);
    expect(server).toBeDefined();
  });

  it('should handle server start', async () => {
    const config: ApiConfig = {
      port: 3000,
      host: 'localhost',
      environment: 'development'
    };
    
    const server = new KlikdApiServer(config);
    await expect(server.start()).resolves.not.toThrow();
  });

  it('should handle server stop', async () => {
    const config: ApiConfig = {
      port: 3000,
      host: 'localhost',
      environment: 'development'
    };
    
    const server = new KlikdApiServer(config);
    await expect(server.stop()).resolves.not.toThrow();
  });
});
