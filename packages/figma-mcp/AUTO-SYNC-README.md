# 🚀 Klikd Design System Auto-Sync

Automatically keep your design system in sync between code and Figma with this powerful automation system.

## ✨ Features

- **🔄 Automatic Syncing** - Sync design tokens between code and Figma
- **📝 Multi-Format Export** - Generate JSON, TypeScript, CSS, SCSS, and Storybook configs
- **👀 Watch Mode** - Real-time syncing with configurable intervals
- **🔍 Validation** - Validate Figma files during sync
- **🤖 CI/CD Integration** - GitHub Actions workflow for automated syncing
- **📊 Progress Tracking** - Monitor sync status and history

## 🚀 Quick Start

### 1. Basic Sync
```bash
# Sync once with default settings
pnpm auto:sync -f YOUR_FIGMA_FILE_KEY

# Sync with custom output directory
pnpm auto:sync -f YOUR_FIGMA_FILE_KEY -o ./my-design-system
```

### 2. Watch Mode (Real-time)
```bash
# Watch for changes and sync every 30 seconds
pnpm auto:sync:watch -f YOUR_FIGMA_FILE_KEY -w

# Custom interval (every 10 seconds)
pnpm auto:sync:watch -f YOUR_FIGMA_FILE_KEY -w -i 10000
```

### 3. CI/CD Mode
```bash
# Generate all formats for CI/CD
pnpm auto:sync:ci -f YOUR_FIGMA_FILE_KEY
```

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `pnpm auto:sync` | Single sync with default settings |
| `pnpm auto:sync:watch` | Watch mode for real-time syncing |
| `pnpm auto:sync:ci` | CI/CD mode with all formats |

## ⚙️ Configuration Options

### Command Line Options
- `-f, --file-key <key>` - Figma file key (required)
- `-o, --output-dir <path>` - Output directory (default: `./design-system-output`)
- `-w, --watch` - Enable watch mode
- `-i, --interval <ms>` - Sync interval in milliseconds (default: 30000)
- `-v, --validate` - Validate Figma file during sync (default: true)
- `--generate-types` - Generate TypeScript types (default: true)
- `--generate-css` - Generate CSS variables (default: true)
- `--generate-scss` - Generate SCSS variables (default: true)
- `--generate-storybook` - Generate Storybook configuration (default: true)

### Configuration File
Edit `sync-config.json` to customize default behavior:

```json
{
  "figma": {
    "fileKey": "2M5cftWvofNAYTV5yuFVkY"
  },
  "output": {
    "directory": "./design-system-output",
    "formats": {
      "json": true,
      "typescript": true,
      "css": true,
      "scss": true,
      "storybook": true
    }
  },
  "sync": {
    "watch": false,
    "interval": 30000,
    "validate": true
  }
}
```

## 🔄 How It Works

### 1. **Code Analysis**
- Scans your codebase for design system definitions
- Extracts colors, typography, spacing, and other design tokens
- Generates structured token data

### 2. **Figma Integration**
- Connects to your Figma file using the MCP API
- Validates file structure and content
- Syncs tokens between code and Figma

### 3. **Multi-Format Export**
- **JSON**: Raw token data for processing
- **TypeScript**: Type-safe design system constants
- **CSS**: CSS custom properties for web projects
- **SCSS**: SCSS variables for styling systems
- **Storybook**: Configuration for design system documentation

### 4. **Automation**
- **Watch Mode**: Real-time syncing with configurable intervals
- **CI/CD**: GitHub Actions workflow for automated syncing
- **Validation**: Ensures design system consistency

## 🎯 Use Cases

### **Development Workflow**
```bash
# Start development with auto-sync
pnpm auto:sync:watch -f YOUR_FILE_KEY -w

# Make changes to your design system
# Auto-sync will detect changes and update all formats
```

### **CI/CD Pipeline**
```yaml
# GitHub Actions workflow
- name: Auto-sync design system
  run: pnpm auto:sync:ci -f ${{ secrets.FIGMA_FILE_KEY }}
  env:
    FIGMA_ACCESS_TOKEN: ${{ secrets.FIGMA_ACCESS_TOKEN }}
```

### **Design System Maintenance**
```bash
# Validate and sync design system
pnpm auto:sync -f YOUR_FILE_KEY --validate

# Generate specific formats
pnpm auto:sync -f YOUR_FILE_KEY --generate-types --generate-css
```

## 📁 Output Structure

```
design-system-output/
├── design-tokens.json          # Complete design system
├── primary-tokens.json         # Primary brand colors
├── ui-tokens.json             # UI colors
├── typography-tokens.json     # Typography scale
├── spacing-tokens.json        # Spacing scale
├── borderRadius-tokens.json   # Border radius values
├── klikd-tokens.ts           # TypeScript types
├── storybook-config.json     # Storybook configuration
└── metadata.json             # Sync metadata
```

## 🔧 Advanced Configuration

### **Custom Design System Sources**
Modify the `KlikdDesignSystem` object in `auto-sync.ts` to match your design system structure.

### **Custom Export Formats**
Add new export methods to the `AutoSyncManager` class:

```typescript
private generateCustomFormat(designTokens: any[]) {
  // Your custom export logic
  const customOutput = this.formatTokens(designTokens);
  writeFileSync(join(this.options.outputDir, 'custom-format.ext'), customOutput);
}
```

### **Webhook Integration**
Configure webhooks in `sync-config.json` to trigger syncs from Figma changes:

```json
{
  "figma": {
    "webhookUrl": "https://your-domain.com/webhooks/figma"
  }
}
```

## 🚨 Troubleshooting

### **Common Issues**

1. **Figma API Errors**
   - Verify your `FIGMA_ACCESS_TOKEN` is valid
   - Check file permissions in Figma
   - Ensure file key is correct

2. **Sync Failures**
   - Check network connectivity
   - Verify output directory permissions
   - Review error logs for specific issues

3. **Watch Mode Issues**
   - Ensure sufficient file watchers: `ulimit -n 4096`
   - Check for file system limitations

### **Debug Mode**
Enable verbose logging by setting environment variables:

```bash
DEBUG=* pnpm auto:sync:watch -f YOUR_FILE_KEY -w
```

## 🔗 Integration Examples

### **With Your Build System**
```json
// package.json
{
  "scripts": {
    "build": "pnpm auto:sync:ci && pnpm build:app",
    "dev": "pnpm auto:sync:watch -w & pnpm dev:app"
  }
}
```

### **With Storybook**
```typescript
// .storybook/main.ts
import { klikdTokens } from '../design-system-output/klikd-tokens';

export default {
  parameters: {
    designTokens: klikdTokens
  }
};
```

### **With CSS-in-JS**
```typescript
// styles/theme.ts
import { KlikdTokens } from '../design-system-output/klikd-tokens';

export const theme = {
  colors: {
    primary: KlikdTokens.color_primary_klikd_green,
    background: KlikdTokens.color_ui_dark_bg
  },
  spacing: {
    xs: KlikdTokens.spacing_xs,
    md: KlikdTokens.spacing_md
  }
};
```

## 📚 Next Steps

1. **Configure your Figma file** with design tokens
2. **Set up GitHub Actions** for automated syncing
3. **Integrate with your build system** for seamless development
4. **Customize export formats** for your specific needs
5. **Set up webhooks** for real-time Figma updates

## 🆘 Support

- **Issues**: Create GitHub issues for bugs or feature requests
- **Documentation**: Check the main README for API reference
- **Examples**: Review the examples directory for usage patterns

---

**🎉 Your design system is now automatically synced between code and Figma!**
