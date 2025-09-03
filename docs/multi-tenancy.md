# Multi-Tenancy Architecture

## Tenant Isolation Strategy

### Database-Level Isolation
```typescript
interface Tenant {
  id: string;
  name: string;
  plan: 'free' | 'pro' | 'premium' | 'enterprise';
  region: string;
  settings: TenantSettings;
  limits: PlanLimits;
  createdAt: Date;
  status: 'active' | 'suspended' | 'deleted';
}

// Row-level security with tenant_id
CREATE POLICY tenant_isolation ON users
  FOR ALL TO authenticated
  USING (tenant_id = current_setting('app.current_tenant')::uuid);
```

### Middleware Enforcement
```typescript
class TenantMiddleware {
  async extractTenant(request: Request): Promise<Tenant> {
    const tenantId = request.headers['x-tenant-id'];
    const token = request.headers['authorization'];
    
    // Validate tenant access from JWT
    const decoded = jwt.verify(token, secret);
    if (decoded.tenantId !== tenantId) {
      throw new UnauthorizedError('Tenant mismatch');
    }
    
    return await this.tenantService.getTenant(tenantId);
  }
  
  async enforceLimits(tenant: Tenant, operation: string): Promise<void> {
    const usage = await this.usageService.getCurrentUsage(tenant.id);
    const limits = this.planService.getLimits(tenant.plan);
    
    if (usage[operation] >= limits[operation]) {
      throw new RateLimitError(`${operation} limit exceeded`);
    }
  }
}
```

## Plan Management

### Plan Definitions
```yaml
# tenants/plans/free.yaml
name: "Free"
price: 0
currency: "USD"
billing_cycle: null
limits:
  api_requests_per_hour: 1000
  storage_mb: 100
  users: 5
  campaigns: 1
  ar_anchors: 10
  missions_per_month: 100
features:
  - basic_analytics
  - community_support
restrictions:
  - no_custom_branding
  - no_api_access
  - no_priority_support
```

```yaml
# tenants/plans/enterprise.yaml
name: "Enterprise"
price: 999
currency: "USD"
billing_cycle: "monthly"
limits:
  api_requests_per_hour: 1000000
  storage_gb: 1000
  users: -1  # unlimited
  campaigns: -1
  ar_anchors: -1
  missions_per_month: -1
features:
  - advanced_analytics
  - priority_support
  - custom_branding
  - api_access
  - sso_integration
  - audit_logs
  - custom_domains
restrictions: []
```

### Plan Enforcement Engine
```typescript
class PlanEnforcer {
  async checkFeatureAccess(tenantId: string, feature: string): Promise<boolean> {
    const tenant = await this.getTenant(tenantId);
    const plan = await this.getPlan(tenant.plan);
    return plan.features.includes(feature);
  }
  
  async enforceLimit(tenantId: string, resource: string, increment: number = 1): Promise<void> {
    const usage = await this.getUsage(tenantId, resource);
    const limit = await this.getLimit(tenantId, resource);
    
    if (limit !== -1 && usage + increment > limit) {
      throw new PlanLimitExceededError(resource, limit);
    }
    
    await this.incrementUsage(tenantId, resource, increment);
  }
}
```

## RBAC (Role-Based Access Control)

### Role Hierarchy
```typescript
enum UserRole {
  EXPLORER = 'explorer',
  INFLUENCER = 'influencer', 
  BUSINESS = 'business',
  AGENCY = 'agency',
  ADMIN = 'admin'
}

interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
  conditions?: PermissionCondition[];
}

interface RoleDefinition {
  role: UserRole;
  permissions: Permission[];
  inherits?: UserRole[];
}
```

### Permission Matrix
```typescript
const rolePermissions: RoleDefinition[] = [
  {
    role: UserRole.EXPLORER,
    permissions: [
      { resource: 'missions', action: 'read' },
      { resource: 'missions', action: 'create', conditions: [{ field: 'type', value: 'user_generated' }] },
      { resource: 'profile', action: 'update', conditions: [{ field: 'userId', value: 'self' }] },
      { resource: 'rewards', action: 'read', conditions: [{ field: 'userId', value: 'self' }] }
    ]
  },
  {
    role: UserRole.BUSINESS,
    inherits: [UserRole.EXPLORER],
    permissions: [
      { resource: 'campaigns', action: 'create' },
      { resource: 'campaigns', action: 'update', conditions: [{ field: 'ownerId', value: 'self' }] },
      { resource: 'analytics', action: 'read', conditions: [{ field: 'scope', value: 'own_campaigns' }] },
      { resource: 'billing', action: 'read' }
    ]
  },
  {
    role: UserRole.AGENCY,
    inherits: [UserRole.BUSINESS],
    permissions: [
      { resource: 'clients', action: 'create' },
      { resource: 'clients', action: 'read' },
      { resource: 'analytics', action: 'read', conditions: [{ field: 'scope', value: 'all_clients' }] }
    ]
  }
];
```

### Permission Checker
```typescript
class PermissionChecker {
  async hasPermission(
    userId: string, 
    resource: string, 
    action: string, 
    context?: any
  ): Promise<boolean> {
    const user = await this.getUser(userId);
    const permissions = await this.getRolePermissions(user.role);
    
    const permission = permissions.find(p => 
      p.resource === resource && p.action === action
    );
    
    if (!permission) return false;
    
    return this.evaluateConditions(permission.conditions, user, context);
  }
  
  private async evaluateConditions(
    conditions: PermissionCondition[], 
    user: User, 
    context: any
  ): Promise<boolean> {
    if (!conditions) return true;
    
    return conditions.every(condition => {
      switch (condition.field) {
        case 'userId':
          return condition.value === 'self' ? context.userId === user.id : context.userId === condition.value;
        case 'ownerId':
          return condition.value === 'self' ? context.ownerId === user.id : context.ownerId === condition.value;
        default:
          return context[condition.field] === condition.value;
      }
    });
  }
}
```

## Tenant Onboarding

### Onboarding Flow
```typescript
interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  required: boolean;
  completed: boolean;
  data?: any;
}

class TenantOnboarding {
  async createTenant(request: CreateTenantRequest): Promise<Tenant> {
    // 1. Validate tenant data
    await this.validateTenantRequest(request);
    
    // 2. Create tenant record
    const tenant = await this.tenantService.create(request);
    
    // 3. Initialize tenant database schema
    await this.initializeTenantSchema(tenant.id);
    
    // 4. Create default admin user
    await this.createAdminUser(tenant.id, request.adminUser);
    
    // 5. Set up default configurations
    await this.setupDefaults(tenant.id);
    
    // 6. Send welcome email
    await this.sendWelcomeEmail(tenant.id);
    
    return tenant;
  }
  
  async getOnboardingSteps(tenantId: string): Promise<OnboardingStep[]> {
    return [
      {
        id: 'profile',
        title: 'Complete Profile',
        description: 'Add company information and branding',
        required: true,
        completed: await this.checkProfileComplete(tenantId)
      },
      {
        id: 'payment',
        title: 'Set up Billing',
        description: 'Add payment method for paid plans',
        required: false,
        completed: await this.checkPaymentSetup(tenantId)
      },
      {
        id: 'integration',
        title: 'API Integration',
        description: 'Set up API keys and webhooks',
        required: false,
        completed: await this.checkIntegrationSetup(tenantId)
      }
    ];
  }
}
```

### Tenant Provisioning
```typescript
class TenantProvisioner {
  async provisionTenant(tenant: Tenant): Promise<void> {
    // Database setup
    await this.createTenantDatabase(tenant.id);
    await this.runMigrations(tenant.id);
    
    // Storage setup
    await this.createStorageBucket(tenant.id);
    await this.setupCDN(tenant.id);
    
    // Service configuration
    await this.configureServices(tenant.id, tenant.plan);
    
    // Monitoring setup
    await this.setupMonitoring(tenant.id);
  }
  
  async deprovisionTenant(tenantId: string): Promise<void> {
    // Data export for compliance
    await this.exportTenantData(tenantId);
    
    // Cleanup resources
    await this.deleteStorageBucket(tenantId);
    await this.removeCDNConfig(tenantId);
    await this.cleanupDatabase(tenantId);
    
    // Update tenant status
    await this.markTenantDeleted(tenantId);
  }
}
```

## Custom Domains & Branding

### Domain Management
```typescript
interface CustomDomain {
  tenantId: string;
  domain: string;
  verified: boolean;
  sslCertificate?: string;
  dnsRecords: DNSRecord[];
  createdAt: Date;
}

class DomainManager {
  async addCustomDomain(tenantId: string, domain: string): Promise<CustomDomain> {
    // Validate domain ownership
    const verificationToken = await this.generateVerificationToken();
    const dnsRecords = this.generateDNSRecords(domain, verificationToken);
    
    const customDomain = await this.domainService.create({
      tenantId,
      domain,
      verified: false,
      dnsRecords
    });
    
    // Start verification process
    await this.startDomainVerification(customDomain.id);
    
    return customDomain;
  }
  
  async verifyDomain(domainId: string): Promise<boolean> {
    const domain = await this.getDomain(domainId);
    const verified = await this.checkDNSRecords(domain.domain, domain.dnsRecords);
    
    if (verified) {
      await this.provisionSSLCertificate(domain.domain);
      await this.updateDomainStatus(domainId, true);
    }
    
    return verified;
  }
}
```

### Branding Customization
```typescript
interface TenantBranding {
  tenantId: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  customCSS?: string;
  whiteLabel: boolean;
}

class BrandingService {
  async updateBranding(tenantId: string, branding: Partial<TenantBranding>): Promise<void> {
    // Validate branding assets
    await this.validateBrandingAssets(branding);
    
    // Generate theme tokens
    const tokens = this.generateDesignTokens(branding);
    
    // Update tenant configuration
    await this.tenantService.updateBranding(tenantId, branding);
    
    // Invalidate CDN cache
    await this.invalidateBrandingCache(tenantId);
  }
}
```

## Usage Monitoring & Analytics

### Usage Tracking
```typescript
interface UsageMetric {
  tenantId: string;
  metric: string;
  value: number;
  period: 'hour' | 'day' | 'month';
  timestamp: Date;
}

class UsageTracker {
  async trackUsage(tenantId: string, metric: string, value: number = 1): Promise<void> {
    const usage: UsageMetric = {
      tenantId,
      metric,
      value,
      period: 'hour',
      timestamp: new Date()
    };
    
    await this.usageService.record(usage);
    
    // Check if approaching limits
    await this.checkUsageLimits(tenantId, metric);
  }
  
  async getUsageReport(tenantId: string, period: DateRange): Promise<UsageReport> {
    const metrics = await this.usageService.getMetrics(tenantId, period);
    const limits = await this.planService.getLimits(tenantId);
    
    return {
      period,
      metrics: metrics.map(m => ({
        ...m,
        limit: limits[m.metric],
        percentage: limits[m.metric] ? (m.value / limits[m.metric]) * 100 : 0
      }))
    };
  }
}
