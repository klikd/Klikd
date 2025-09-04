import { describe, it, expect } from 'vitest';
import { ExplorerConsoleApp, type ExplorerConfig, type ExplorerUser } from './index.js';

describe('Explorer Console App', () => {
  it('should create an app instance', () => {
    const config: ExplorerConfig = {
      apiUrl: 'https://api.example.com',
      authToken: 'test-token',
      features: ['explore', 'moderate']
    };
    
    const app = new ExplorerConsoleApp(config);
    expect(app).toBeDefined();
  });

  it('should initialize the app', () => {
    const config: ExplorerConfig = {
      apiUrl: 'https://api.example.com',
      authToken: 'test-token',
      features: ['explore']
    };
    
    const app = new ExplorerConsoleApp(config);
    expect(() => app.initialize()).not.toThrow();
  });

  it('should handle user permissions', () => {
    const config: ExplorerConfig = {
      apiUrl: 'https://api.example.com',
      authToken: 'test-token',
      features: ['explore', 'moderate']
    };
    
    const app = new ExplorerConsoleApp(config);
    const permissions = app.getUserPermissions('user-123');
    
    expect(permissions).toEqual(['read', 'explore', 'moderate']);
  });
});
