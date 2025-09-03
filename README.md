# Klikd Platform

A gamified, AR-powered social commerce platform targeting the MENA market with a 4-tier user ecosystem and 26+ experience layers.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start local development environment
make dev

# Run all checks
make lint && make typecheck && make test
```

## 🏗️ Architecture Overview

Klikd is built as a monorepo with the following structure:

- **4-tier User System**: Explorer (mobile), Influencer (creator-console), Business (business-console), Agency (agency-console)
- **AR-First Experience**: Unity/ARKit/ARCore integration with spatial interactions
- **Event-Driven Architecture**: Mission completion → rewards → payments flow
- **Multi-tenant SaaS**: Isolated tenant data with plan-based limits
- **MENA Compliance**: Mawthoq, PDPL/GDPR compliance built-in

## 📱 Applications

| App | Description | Status |
|-----|-------------|--------|
| `mobile/klikd-ar` | Main consumer app (Explorer console) | ✅ Active |
| `business-console` | Brand/merchant dashboard | ✅ Active |
| `creator-console` | Influencer dashboard | ✅ Active |
| `agency-console` | Agency management portal | ✅ Active |
| `explorer-console` | Web console for Explorers | 🚧 Deferred |
| `web-admin` | Super admin portal | 🚧 Scaffold |

## 📦 Packages

Core domain modules and shared libraries:

- `api` - Backend API (Fastify/tRPC + Prisma)
- `contracts` - HTTP/Event schemas and validation
- `ar-engine` - AR adapters and spatial logic
- `ai-orchestration` - AI companions (NCPs) and LangChain
- `gamification` - XP, rewards, challenges system
- `commerce` - Stripe/STC/Shopify integrations
- `analytics` - Event tracking and insights
- `design-system` - Tokens, themes, and UI primitives

## 🛠️ Development

### Prerequisites

- Node.js 18+ (see `.nvmrc`)
- pnpm 8+ (see `.tool-versions`)
- Docker & Docker Compose

### Environment Setup

1. Copy environment template:
   ```bash
   cp .env.example .env
   ```

2. Start local infrastructure:
   ```bash
   docker-compose up -d
   ```

3. Run environment checks:
   ```bash
   pnpm run check:env
   ```

### Available Commands

```bash
make dev          # Start all apps in development mode
make build        # Build all packages and apps
make test         # Run all tests
make test:e2e     # Run end-to-end tests
make lint         # Lint all code
make typecheck    # TypeScript type checking
make openapi      # Generate API documentation
```

## 📚 Documentation

- [Architecture](./docs/architecture.md) - System design and event flows
- [API Specification](./docs/api-spec.md) - OpenAPI contracts and endpoints
- [AR Modules](./docs/ar-modules.md) - AR implementation details
- [Multi-tenancy](./docs/multi-tenancy.md) - Tenant isolation and management
- [Compliance](./docs/compliance.md) - Mawthoq and privacy compliance
- [Developer Onboarding](./docs/onboarding.md) - Setup and troubleshooting

## 🌍 Localization

Supports Arabic (RTL), English, and French with region-specific features for MENA markets.

## 🔒 Security & Compliance

- Mawthoq compliance for Islamic finance
- PDPL/GDPR data protection
- Multi-tenant data isolation
- Secrets rotation and management

## 🚀 Deployment

- **Development**: Local Docker Compose
- **Staging**: Cloudflare + Supabase
- **Production**: Multi-region deployment with edge caching

## 🤝 Contributing

1. Read [conventions](./docs/conventions.md)
2. Follow [commit message format](./commitlint.config.js)
3. Ensure all checks pass: `make lint && make typecheck && make test`
4. Submit PR with proper [template](./.github/PULL_REQUEST_TEMPLATE.md)

## 📄 License

Proprietary - Klikd Platform
