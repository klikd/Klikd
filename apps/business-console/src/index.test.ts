import { describe, it, expect } from 'vitest';
import { BusinessConsoleApp, type BusinessConfig, type BusinessUser } from './index.js';

describe('Business Console App', () => {
  it('should create an app instance', () => {
    const config: BusinessConfig = {
      apiUrl: 'https://api.example.com',
      authToken: 'test-token',
      features: ['manage', 'analytics']
    };
    
    const app = new BusinessConsoleApp(config);
    expect(app).toBeDefined();
  });

  it('should initialize the app', () => {
    const config: BusinessConfig = {
      apiUrl: 'https://api.example.com',
      authToken: 'test-token',
      features: ['manage']
    };
    
    const app = new BusinessConsoleApp(config);
    expect(() => app.initialize()).not.toThrow();
  });

  it('should handle user permissions', () => {
    const config: BusinessConfig = {
      apiUrl: 'https://api.example.com',
      authToken: 'test-token',
      features: ['manage', 'analytics']
    };
    
    const app = new BusinessConsoleApp(config);
    const permissions = app.getUserPermissions('user-123');
    
    expect(permissions).toEqual(['read', 'write', 'manage']);
  });
});
