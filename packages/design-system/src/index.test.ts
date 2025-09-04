import { describe, it, expect } from 'vitest';
import { KlikdDesignSystem, type DesignToken, type DesignTokenGroup, type DesignSystem } from './index.js';

describe('Klikd Design System', () => {
  it('should export the design system', () => {
    expect(KlikdDesignSystem).toBeDefined();
    expect(KlikdDesignSystem.name).toBe('Klikd Design System');
    expect(KlikdDesignSystem.version).toBe('1.0.0');
  });

  it('should have correct structure', () => {
    expect(KlikdDesignSystem.tokens).toBeInstanceOf(Array);
    expect(KlikdDesignSystem.metadata).toBeDefined();
    expect(KlikdDesignSystem.metadata?.generatedAt).toBeDefined();
  });

  it('should export types', () => {
    // Test that types are properly exported
    const token: DesignToken = {
      name: 'test.color.primary',
      value: '#FF0000',
      type: 'color',
      description: 'Test color'
    };
    
    const group: DesignTokenGroup = {
      name: 'test',
      tokens: [token]
    };
    
    const system: DesignSystem = {
      name: 'Test System',
      version: '1.0.0',
      tokens: [group]
    };

    expect(token.name).toBe('test.color.primary');
    expect(group.tokens).toHaveLength(1);
    expect(system.tokens).toHaveLength(1);
  });
});
