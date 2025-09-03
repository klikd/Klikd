#!/usr/bin/env node

import { config } from 'dotenv';
import { FigmaService } from './src/services/FigmaService.js';
import { FigmaMCPServerConfig } from './src/types/index.js';

// Load environment variables
config();

// Klikd Design System from your repository
const KlikdDesignSystem = {
  colors: {
    primary: {
      klikd_green: '#ECFF00',
      klikd_black: '#0B0B0B',
      klikd_white: '#FFFFFF',
    },
    ui: {
      dark_bg: '#0B0B0B',
      soft_gray: '#999999',
      border_gray: '#333333',
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#FF6B6B',
      info: '#2196F3',
    },
    gradients: {
      primary: ['#ECFF00', '#B8CC00'],
      dark: ['#0B0B0B', '#1A1A1A'],
    },
  },
  typography: {
    fontFamily: 'Inter',
    sizes: {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
      xxl: 20,
      xxxl: 24,
    },
    weights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 20,
  },
};

async function testKlikdSystem() {
  console.log('🎨 Klikd Design System Test');
  console.log('============================\n');

  // Test 1: Display the design system
  console.log('📋 Design System Overview:');
  console.log(`Colors: ${Object.keys(KlikdDesignSystem.colors.primary).length} primary, ${Object.keys(KlikdDesignSystem.colors.ui).length} UI`);
  console.log(`Typography: ${Object.keys(KlikdDesignSystem.typography.sizes).length} sizes, ${Object.keys(KlikdDesignSystem.typography.weights).length} weights`);
  console.log(`Spacing: ${Object.keys(KlikdDesignSystem.spacing).length} scale units`);
  console.log(`Border Radius: ${Object.keys(KlikdDesignSystem.borderRadius).length} radius values\n`);

  // Test 2: Test Figma connection
  const figmaAccessToken = process.env.FIGMA_ACCESS_TOKEN;
  if (!figmaAccessToken) {
    console.log('❌ FIGMA_ACCESS_TOKEN not found in .env file');
    return;
  }

  console.log('🔗 Testing Figma Connection...');
  const config: FigmaMCPServerConfig = {
    figmaAccessToken,
  };

  try {
    const figmaService = new FigmaService(config);
    
    // Test with your current file
    const fileKey = '2M5cftWvofNAYTV5yuFVkY';
    console.log(`📁 Testing with file: ${fileKey}`);
    
    const file = await figmaService.getFile(fileKey);
    console.log(`✅ File loaded: ${file.name}`);
    
    // Test 3: Generate design tokens from your system
    console.log('\n🎯 Generating Design Tokens from Klikd System...');
    
    const designTokens = [];
    
    // Convert colors to tokens
    Object.entries(KlikdDesignSystem.colors.primary).forEach(([name, value]) => {
      designTokens.push({
        name: `color.primary.${name}`,
        value,
        type: 'color',
        category: 'primary',
        description: `Klikd primary brand color: ${name}`
      });
    });
    
    Object.entries(KlikdDesignSystem.colors.ui).forEach(([name, value]) => {
      designTokens.push({
        name: `color.ui.${name}`,
        value,
        type: 'color',
        category: 'ui',
        description: `Klikd UI color: ${name}`
      });
    });
    
    // Convert typography to tokens
    Object.entries(KlikdDesignSystem.typography.sizes).forEach(([name, value]) => {
      designTokens.push({
        name: `typography.size.${name}`,
        value,
        type: 'typography',
        category: 'typography',
        description: `Font size: ${name}`
      });
    });
    
    // Convert spacing to tokens
    Object.entries(KlikdDesignSystem.spacing).forEach(([name, value]) => {
      designTokens.push({
        name: `spacing.${name}`,
        value,
        type: 'spacing',
        category: 'spacing',
        description: `Spacing unit: ${name}`
      });
    });
    
    // Convert border radius to tokens
    Object.entries(KlikdDesignSystem.borderRadius).forEach(([name, value]) => {
      designTokens.push({
        name: `borderRadius.${name}`,
        value,
        type: 'borderRadius',
        category: 'borderRadius',
        description: `Border radius: ${name}`
      });
    });
    
    console.log(`✅ Generated ${designTokens.length} design tokens`);
    console.log('\n📊 Token Breakdown:');
    
    const categories = {};
    designTokens.forEach(token => {
      if (!categories[token.category]) categories[token.category] = 0;
      categories[token.category]++;
    });
    
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} tokens`);
    });
    
    // Test 4: Export tokens
    console.log('\n💾 Exporting tokens to JSON...');
    const fs = await import('fs');
    const tokenData = {
      name: 'Klikd Design System',
      version: '1.0.0',
      description: 'Official Klikd brand design system',
      tokens: designTokens,
      metadata: {
        generatedAt: new Date().toISOString(),
        source: 'Klikd Repository',
        totalTokens: designTokens.length
      }
    };
    
    fs.writeFileSync('./klikd-design-tokens.json', JSON.stringify(tokenData, null, 2));
    console.log('✅ Tokens exported to: klikd-design-tokens.json');
    
    // Test 5: Generate TypeScript types
    console.log('\n🔧 Generating TypeScript types...');
    let typeScriptCode = `// Klikd Design System Types
// Generated from design tokens

export namespace KlikdTokens {
`;

    Object.entries(categories).forEach(([category, count]) => {
      const categoryTokens = designTokens.filter(t => t.category === category);
      typeScriptCode += `\n  // ${category} tokens (${count})\n`;
      
      categoryTokens.forEach(token => {
        const typeName = token.name.replace(/[.-]/g, '_');
        const value = typeof token.value === 'string' ? `'${token.value}'` : token.value;
        typeScriptCode += `  export const ${typeName} = ${value}; // ${token.description}\n`;
      });
    });
    
    typeScriptCode += `\n  // All tokens\n  export const all = {\n`;
    designTokens.forEach(token => {
      const typeName = token.name.replace(/[.-]/g, '_');
      typeScriptCode += `    ${typeName},\n`;
    });
    typeScriptCode += `  } as const;\n}\n`;
    
    fs.writeFileSync('./klikd-design-types.ts', typeScriptCode);
    console.log('✅ TypeScript types generated: klikd-design-types.ts');
    
    console.log('\n🎉 Klikd Design System Test Complete!');
    console.log('\n📁 Generated Files:');
    console.log('  - klikd-design-tokens.json (Design tokens)');
    console.log('  - klikd-design-types.ts (TypeScript types)');
    
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : 'Unknown error');
  }
}

// Run the test
testKlikdSystem().catch(console.error);
