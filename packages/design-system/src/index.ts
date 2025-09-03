// Klikd Design System
// This package provides design tokens, themes, and UI primitives

export interface DesignToken {
  name: string;
  value: string | number | Record<string, unknown>;
  type: 'color' | 'spacing' | 'typography' | 'borderRadius' | 'shadow' | 'animation' | 'component';
  description?: string;
  category?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface DesignTokenGroup {
  name: string;
  tokens: DesignToken[];
  description?: string;
  category?: string;
}

export interface DesignSystem {
  name: string;
  version: string;
  description?: string;
  tokens: DesignTokenGroup[];
  metadata?: Record<string, unknown>;
}

// Export a basic design system structure
export const KlikdDesignSystem: DesignSystem = {
  name: 'Klikd Design System',
  version: '1.0.0',
  description: 'Official Klikd brand design system',
  tokens: [],
  metadata: {
    generatedAt: new Date().toISOString(),
    source: 'Klikd Repository'
  }
};

// Export types
export type { DesignToken, DesignTokenGroup, DesignSystem };
