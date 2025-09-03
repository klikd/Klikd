# Figma MCP (Model Context Protocol) Package

A comprehensive Figma integration package for the Klikd platform that implements the Model Context Protocol (MCP) to enable seamless design-to-code workflows and design system management.

## 🚀 Features

- **MCP Server Implementation**: Full Model Context Protocol server for Figma integration
- **Design Token Extraction**: Automatically extract colors, spacing, typography, and component tokens
- **Multiple Output Formats**: Generate tokens in JSON, CSS, SCSS, and TypeScript formats
- **File Validation**: Comprehensive Figma file structure validation
- **CLI Tools**: Command-line utilities for token syncing and validation
- **TypeScript Support**: Full TypeScript support with generated types
- **Error Handling**: Robust error handling and retry mechanisms
- **Configuration**: Flexible configuration via environment variables

## 📦 Installation

```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Run tests
pnpm test
```

## 🔧 Configuration

Copy the example environment file and configure your Figma API credentials:

```bash
cp env.example .env
```

Required environment variables:

```bash
# Required: Your Figma personal access token
FIGMA_ACCESS_TOKEN=your_figma_access_token_here

# Optional: Team and project IDs for specific operations
FIGMA_TEAM_ID=your_team_id_here
FIGMA_PROJECT_ID=your_project_id_here
FIGMA_DESIGN_SYSTEM_FILE_KEY=your_design_system_file_key_here
```

### Getting Your Figma Access Token

1. Go to [Figma Account Settings](https://www.figma.com/settings)
2. Navigate to the "Personal access tokens" section
3. Click "Create new token"
4. Give it a name and copy the token value

## 🛠️ Usage

### MCP Server

Start the MCP server to enable Figma integration:

```bash
# Start the server
pnpm start

# Development mode
pnpm run dev:server
```

### CLI Tools

#### Sync Design Tokens

Extract design tokens from a Figma file:

```bash
# Basic sync to JSON
pnpm run sync:design-tokens --file-key YOUR_FILE_KEY --output-path ./tokens.json

# Generate CSS variables
pnpm run sync:design-tokens --file-key YOUR_FILE_KEY --output-path ./tokens.css --format css

# Generate SCSS variables
pnpm run sync:design-tokens --file-key YOUR_FILE_KEY --output-path ./tokens.scss --format scss

# Generate TypeScript
pnpm run sync:design-tokens --file-key YOUR_FILE_KEY --output-path ./tokens.ts --format ts

# Validate before syncing
pnpm run sync:design-tokens --file-key YOUR_FILE_KEY --output-path ./tokens.json --validate

# Dry run to see what would be synced
pnpm run sync:design-tokens --file-key YOUR_FILE_KEY --output-path ./tokens.json --dry-run
```

#### Validate Figma Files

Check the structure and content of Figma files:

```bash
# Basic validation
pnpm run validate:figma --file-key YOUR_FILE_KEY

# Detailed analysis
pnpm run validate:figma --file-key YOUR_FILE_KEY --detailed

# Check specific aspects
pnpm run validate:figma --file-key YOUR_FILE_KEY --detailed --check-components --check-styles --check-structure
```

#### Generate TypeScript Types

Create TypeScript type definitions from design tokens:

```bash
# Basic type generation
pnpm run generate:types --file-key YOUR_FILE_KEY --output-path ./types.ts

# With custom namespace
pnpm run generate:types --file-key YOUR_FILE_KEY --output-path ./types.ts --namespace KlikdTokens

# Include descriptions and metadata
pnpm run generate:types --file-key YOUR_FILE_KEY --output-path ./types.ts --include-descriptions --include-metadata

# Strict typing
pnpm run generate:types --file-key YOUR_FILE_KEY --output-path ./types.ts --strict
```

### Programmatic Usage

#### Using the Figma Service

```typescript
import { FigmaService } from '@klikd/figma-mcp';

const figmaService = new FigmaService({
  figmaAccessToken: process.env.FIGMA_ACCESS_TOKEN!,
  figmaTeamId: process.env.FIGMA_TEAM_ID,
  figmaProjectId: process.env.FIGMA_PROJECT_ID
});

// Extract design tokens
const tokens = await figmaService.extractDesignTokens('your_file_key');

// Get file details
const file = await figmaService.getFile('your_file_key');

// Validate file structure
const validation = await figmaService.validateFile('your_file_key');
```

#### Using the MCP Client

```typescript
import { FigmaMCPClient } from '@klikd/figma-mcp';

const client = new FigmaMCPClient();

// Connect to the MCP server
await client.connect();

// List available tools
const tools = await client.listTools();

// Extract design tokens
const tokens = await client.extractDesignTokens('your_file_key');

// Sync design system
const result = await client.syncDesignSystem('your_file_key', './output');

// Disconnect
await client.disconnect();
```

## 🏗️ Architecture

### Package Structure

```
src/
├── types/           # TypeScript type definitions and schemas
├── services/        # Core Figma API service
├── server/          # MCP server implementation
├── client/          # MCP client for external usage
├── scripts/         # CLI tools and utilities
└── index.ts         # Main package exports
```

### MCP Tools

The server provides the following MCP tools:

- `get_figma_file` - Retrieve Figma file details
- `extract_design_tokens` - Extract design tokens from a file
- `get_figma_project` - Get project information
- `get_team_projects` - List team projects
- `validate_figma_file` - Validate file structure
- `get_file_images` - Export images from nodes
- `sync_design_system` - Sync tokens to local system

### Design Token Types

Supported token categories:

- **Colors**: Fill and stroke colors with hex values
- **Spacing**: Dimensions, widths, heights, and corner radii
- **Typography**: Text styles and font properties
- **Components**: Figma component definitions
- **Shadows**: Shadow and effect properties
- **Animations**: Animation and transition properties

## 🔌 Integration

### With Design System

This package integrates seamlessly with the Klikd design system:

```typescript
import { designTokens } from '@klikd/figma-mcp';

// Use extracted tokens in your components
const buttonStyle = {
  backgroundColor: designTokens.colors.primary,
  padding: designTokens.spacing.medium,
  borderRadius: designTokens.spacing.small
};
```

### With Build Tools

Integrate with your build pipeline:

```json
{
  "scripts": {
    "build:tokens": "pnpm run sync:design-tokens --file-key YOUR_FILE_KEY --output-path ./src/tokens/index.ts --format ts",
    "build": "pnpm run build:tokens && pnpm run build:app"
  }
}
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run specific test files
pnpm test --run src/services/FigmaService.test.ts
```

## 📚 API Reference

### FigmaService

Core service for Figma API interactions.

#### Methods

- `getFile(fileKey: string): Promise<FigmaFile>`
- `extractDesignTokens(fileKey: string): Promise<DesignTokenGroup[]>`
- `validateFile(fileKey: string): Promise<ValidationResult>`
- `getFileImages(fileKey: string, nodeIds: string[]): Promise<Record<string, string>>`

### FigmaMCPServer

MCP server implementation for Figma integration.

#### Methods

- `start(): Promise<void>` - Start the MCP server
- `setupToolHandlers(): void` - Configure MCP tool handlers

### FigmaMCPClient

Client for interacting with the MCP server.

#### Methods

- `connect(): Promise<void>` - Connect to the MCP server
- `disconnect(): Promise<void>` - Disconnect from the server
- `extractDesignTokens(fileKey: string): Promise<DesignTokenGroup[]>`
- `syncDesignSystem(fileKey: string, outputPath?: string): Promise<FigmaSyncResult>`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the examples in the `examples/` directory

## 🔗 Related

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Figma API Documentation](https://www.figma.com/developers/api)
- [Klikd Design System](../design-system/README.md)
- [Klikd Platform](../README.md)
