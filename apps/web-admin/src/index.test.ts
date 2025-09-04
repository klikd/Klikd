import { describe, it, expect } from 'vitest';
import { WebAdminApp, type AdminConfig, type AdminUser } from './index.js';

describe('Web Admin App', () => {
  it('should create an app instance', () => {
    const config: AdminConfig = {
      apiUrl: 'https://api.example.com',
      authToken: 'test-token',
      features: ['admin', 'users']
    };
    
    const app = new WebAdminApp(config);
    expect(app).toBeDefined();
  });

  it('should initialize the app', () => {
    const config: AdminConfig = {
      apiUrl: 'https://api.example.com',
      authToken: 'test-token',
      features: ['admin']
    };
    
    const app = new WebAdminApp(config);
    expect(() => app.initialize()).not.toThrow();
  });

  it('should handle user permissions', () => {
    const config: AdminConfig = {
      apiUrl: 'https://api.example.com',
      authToken: 'test-token',
      features: ['admin', 'users']
    };
    
    const app = new WebAdminApp(config);
    const permissions = app.getUserPermissions('user-123');
    
    expect(permissions).toEqual(['read', 'write', 'delete']);
  });
});
