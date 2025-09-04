import { describe, it, expect } from 'vitest';
import { AgencyConsoleApp, type AgencyConfig, type AgencyUser } from './index.js';

describe('Agency Console App', () => {
  it('should create an app instance', () => {
    const config: AgencyConfig = {
      apiUrl: 'https://api.example.com',
      authToken: 'test-token',
      features: ['manage', 'campaigns']
    };
    
    const app = new AgencyConsoleApp(config);
    expect(app).toBeDefined();
  });

  it('should initialize the app', () => {
    const config: AgencyConfig = {
      apiUrl: 'https://api.example.com',
      authToken: 'test-token',
      features: ['manage']
    };
    
    const app = new AgencyConsoleApp(config);
    expect(() => app.initialize()).not.toThrow();
  });

  it('should handle user permissions', () => {
    const config: AgencyConfig = {
      apiUrl: 'https://api.example.com',
      authToken: 'test-token',
      features: ['manage', 'campaigns']
    };
    
    const app = new AgencyConsoleApp(config);
    const permissions = app.getUserPermissions('user-123');
    
    expect(permissions).toEqual(['read', 'write', 'manage']);
  });
});
