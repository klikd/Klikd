import { describe, it, expect } from 'vitest';
import { CreatorConsoleApp, type CreatorConfig, type CreatorUser } from './index.js';

describe('Creator Console App', () => {
  it('should create an app instance', () => {
    const config: CreatorConfig = {
      apiUrl: 'https://api.example.com',
      authToken: 'test-token',
      features: ['create', 'publish']
    };
    
    const app = new CreatorConsoleApp(config);
    expect(app).toBeDefined();
  });

  it('should initialize the app', () => {
    const config: CreatorConfig = {
      apiUrl: 'https://api.example.com',
      authToken: 'test-token',
      features: ['create']
    };
    
    const app = new CreatorConsoleApp(config);
    expect(() => app.initialize()).not.toThrow();
  });

  it('should handle user permissions', () => {
    const config: CreatorConfig = {
      apiUrl: 'https://api.example.com',
      authToken: 'test-token',
      features: ['create', 'publish']
    };
    
    const app = new CreatorConsoleApp(config);
    const permissions = app.getUserPermissions('user-123');
    
    expect(permissions).toEqual(['read', 'write', 'create']);
  });
});
