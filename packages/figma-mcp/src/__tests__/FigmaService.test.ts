import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FigmaService } from '../services/FigmaService.js';
import { FigmaMCPServerConfig } from '../types/index.js';

// Mock configuration
const mockConfig: FigmaMCPServerConfig = {
  figmaAccessToken: 'test_token',
  figmaTeamId: 'test_team',
  figmaProjectId: 'test_project',
  designSystemFileKey: 'test_file',
  webhookUrl: 'https://test.com/webhook',
  syncInterval: 300000,
  maxRetries: 3,
  retryDelay: 1000
};

describe('FigmaService', () => {
  let figmaService: FigmaService;

  beforeEach(() => {
    figmaService = new FigmaService(mockConfig);
  });

  describe('constructor', () => {
    it('should create a FigmaService instance with valid config', () => {
      expect(figmaService).toBeInstanceOf(FigmaService);
    });

    it('should throw error with invalid config', () => {
      expect(() => {
        new FigmaService({
          ...mockConfig,
          figmaAccessToken: ''
        });
      }).toThrow();
    });
  });

  describe('rgbaToHex', () => {
    it('should convert RGBA values to hex', () => {
      // Test with a private method using type assertion
      const service = figmaService as any;
      
      expect(service.rgbaToHex(1, 0, 0, 1)).toBe('#ff0000'); // Red
      expect(service.rgbaToHex(0, 1, 0, 1)).toBe('#00ff00'); // Green
      expect(service.rgbaToHex(0, 0, 1, 1)).toBe('#0000ff'); // Blue
      expect(service.rgbaToHex(0, 0, 0, 0.5)).toBe('#00000080'); // Black with alpha
    });
  });

  describe('validation', () => {
    it('should validate configuration', () => {
      expect(mockConfig.figmaAccessToken).toBeTruthy();
      expect(mockConfig.figmaTeamId).toBeTruthy();
      expect(mockConfig.figmaProjectId).toBeTruthy();
    });
  });
});

describe('Type Definitions', () => {
  it('should have correct type structure', () => {
    // This test ensures our types are properly exported
    expect(typeof FigmaMCPServerConfig).toBe('function');
  });
});
