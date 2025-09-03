# Developer Onboarding

## Prerequisites

### Required Tools
- **Node.js 18+**: Use nvm with `.nvmrc`
- **pnpm 8+**: Package manager (see `.tool-versions`)
- **Docker & Docker Compose**: Local infrastructure
- **Git**: Version control

### Optional Tools
- **asdf**: Multi-language version manager
- **VSCode**: Recommended IDE with workspace settings
- **Xcode**: iOS development (macOS only)
- **Android Studio**: Android development

## Quick Setup

### 1. Environment Setup
```bash
# Clone repository
git clone <repo-url>
cd klikd-platform

# Install Node.js version
nvm install
nvm use

# Install pnpm
npm install -g pnpm@8.15.0

# Install dependencies
pnpm install
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your local settings
# Required: Database URLs, API keys, etc.
```

### 3. Local Infrastructure
```bash
# Start local services
docker-compose up -d

# Verify services are running
docker-compose ps
```

### 4. Database Setup
```bash
# Run migrations
pnpm run migrate

# Seed with sample data
pnpm run seed
```

### 5. Verification
```bash
# Check environment
pnpm run check:env

# Run tests
pnpm run test

# Start development
pnpm run dev
```

## Workspace Structure

### Apps Overview
- `mobile/klikd-ar/` - Main consumer mobile app
- `business-console/` - Brand/merchant dashboard
- `creator-console/` - Influencer management
- `agency-console/` - Agency portal
- `web-admin/` - Super admin (scaffold)

### Packages Overview
- `api/` - Backend API and business logic
- `contracts/` - Shared schemas and validation
- `design-system/` - UI tokens and components
- Domain packages: `ar-engine`, `gamification`, `commerce`, etc.

## Development Workflow

### Daily Commands
```bash
# Start all apps in development
make dev

# Run specific app
cd apps/business-console
pnpm run dev

# Run specific package tests
cd packages/api
pnpm run test
```

### Code Quality
```bash
# Lint and fix
pnpm run lint:fix

# Type checking
pnpm run typecheck

# Run all checks
make lint && make typecheck && make test
```

### Git Workflow
```bash
# Conventional commits are enforced
git commit -m "feat(mobile): add AR anchor creation"
git commit -m "fix(api): resolve mission completion bug"
git commit -m "docs(readme): update setup instructions"
```

## Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Check what's using ports
lsof -i :3000  # Next.js dev server
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis
lsof -i :7700  # MeiliSearch

# Kill processes if needed
kill -9 <PID>
```

#### Docker Issues
```bash
# Reset Docker state
docker-compose down -v
docker system prune -f
docker-compose up -d
```

#### Node/pnpm Issues
```bash
# Clear node_modules and reinstall
pnpm run clean
pnpm install

# Reset pnpm cache
pnpm store prune
```

#### Database Issues
```bash
# Reset database
docker-compose down postgres
docker volume rm klikd-platform_postgres_data
docker-compose up -d postgres
pnpm run migrate
pnpm run seed
```

### Environment Validation
```bash
# Check all environment variables
pnpm run check:env

# Validate API contracts
pnpm run check:contracts

# Test database connection
node -e "require('./packages/api/src/db').testConnection()"
```

### IDE Setup

#### VSCode Configuration
The `.vscode/settings.json` includes:
- TypeScript workspace configuration
- Path alias IntelliSense
- Format on save
- ESLint integration

#### Recommended Extensions
- TypeScript and JavaScript Language Features
- ESLint
- Prettier
- GitLens
- Thunder Client (API testing)
- React Native Tools

## Testing Strategy

### Unit Tests
```bash
# Run all unit tests
pnpm run test:unit

# Run specific package tests
cd packages/gamification
pnpm run test

# Watch mode
pnpm run test --watch
```

### Integration Tests
```bash
# Start test database
docker-compose -f docker-compose.test.yml up -d

# Run integration tests
pnpm run test:integration
```

### E2E Tests
```bash
# Start all services
make dev

# Run E2E tests
pnpm run test:e2e
```

## Mobile Development

### React Native Setup
```bash
# Install Expo CLI
npm install -g @expo/cli

# Start mobile development
cd apps/mobile/klikd-ar
expo start
```

### iOS Development
```bash
# Install iOS dependencies
cd apps/mobile/klikd-ar/ios
pod install

# Run on iOS simulator
expo run:ios
```

### Android Development
```bash
# Start Android emulator
# Then run:
expo run:android
```

## API Development

### tRPC Development
```bash
# Start API server
cd packages/api
pnpm run dev

# Generate OpenAPI docs
pnpm run generate:openapi
```

### Database Migrations
```bash
# Create new migration
cd packages/api
npx prisma migrate dev --name add_user_table

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset
```

## Performance Monitoring

### Local Monitoring
```bash
# View Docker logs
docker-compose logs -f

# Monitor resource usage
docker stats

# Check API performance
curl -w "@curl-format.txt" http://localhost:3001/api/health
```

### Bundle Analysis
```bash
# Analyze web bundle
cd apps/business-console
pnpm run build:analyze

# Analyze mobile bundle
cd apps/mobile/klikd-ar
expo export --dump-sourcemap
```

## Getting Help

### Documentation
- [Architecture](./architecture.md) - System design
- [API Spec](./api-spec.md) - API documentation
- [Multi-tenancy](./multi-tenancy.md) - Tenant management
- [Compliance](./compliance.md) - Regulatory requirements

### Team Communication
- **Slack**: #klikd-dev channel
- **GitHub**: Issues and discussions
- **Confluence**: Detailed specifications
- **Figma**: Design system and mockups

### Code Reviews
- All PRs require review
- Follow [PR template](./.github/PULL_REQUEST_TEMPLATE.md)
- Ensure CI passes before review
- Address feedback promptly
