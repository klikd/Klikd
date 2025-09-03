# Role-Based Permissions Matrix

## User Roles Overview

| Role | Description | Primary Use Case |
|------|-------------|------------------|
| **Explorer** | End consumers using mobile app | AR experiences, missions, social sharing |
| **Influencer** | Content creators and social media personalities | Campaign participation, audience engagement |
| **Business** | Brands, merchants, and retailers | Campaign creation, analytics, customer acquisition |
| **Agency** | Marketing agencies managing multiple clients | Multi-client management, advanced analytics |
| **Admin** | Platform administrators | System management, compliance, support |

## Permissions Matrix

### Core Features

| Feature | Explorer | Influencer | Business | Agency | Admin |
|---------|----------|------------|----------|---------|-------|
| **Profile Management** | ✅ Self | ✅ Self | ✅ Self | ✅ Self | ✅ All |
| **Mission Participation** | ✅ | ✅ | ❌ | ❌ | ✅ |
| **AR Experiences** | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Social Sharing** | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Rewards & Wallet** | ✅ | ✅ | ❌ | ❌ | ✅ |

### Campaign Management

| Feature | Explorer | Influencer | Business | Agency | Admin |
|---------|----------|------------|----------|---------|-------|
| **View Campaigns** | ✅ Public | ✅ Invited | ✅ Own | ✅ Clients | ✅ All |
| **Create Campaigns** | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Edit Campaigns** | ❌ | ❌ | ✅ Own | ✅ Clients | ✅ All |
| **Delete Campaigns** | ❌ | ❌ | ✅ Own | ✅ Clients | ✅ All |
| **Campaign Analytics** | ❌ | ✅ Participated | ✅ Own | ✅ Clients | ✅ All |
| **Budget Management** | ❌ | ❌ | ✅ | ✅ | ✅ |

### Content & Assets

| Feature | Explorer | Influencer | Business | Agency | Admin |
|---------|----------|------------|----------|---------|-------|
| **Upload AR Assets** | ❌ | ✅ Limited | ✅ | ✅ | ✅ |
| **Manage Asset Library** | ❌ | ✅ Own | ✅ Own | ✅ Clients | ✅ All |
| **Content Moderation** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Brand Guidelines** | ❌ | ✅ View | ✅ Manage | ✅ Manage | ✅ |

### Analytics & Reporting

| Feature | Explorer | Influencer | Business | Agency | Admin |
|---------|----------|------------|----------|---------|-------|
| **Personal Analytics** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Campaign Performance** | ❌ | ✅ Participated | ✅ Own | ✅ Clients | ✅ All |
| **Audience Insights** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Revenue Reports** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Platform Analytics** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Export Data** | ❌ | ✅ Limited | ✅ | ✅ | ✅ |

### Financial & Billing

| Feature | Explorer | Influencer | Business | Agency | Admin |
|---------|----------|------------|----------|---------|-------|
| **Wallet Management** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Payment Methods** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Billing History** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Invoice Generation** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Tax Documents** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Refund Processing** | ❌ | ❌ | ❌ | ❌ | ✅ |

### User Management

| Feature | Explorer | Influencer | Business | Agency | Admin |
|---------|----------|------------|----------|---------|-------|
| **View Users** | ❌ | ❌ | ❌ | ✅ Team | ✅ All |
| **Invite Users** | ❌ | ❌ | ✅ Team | ✅ Team | ✅ |
| **Manage Permissions** | ❌ | ❌ | ✅ Team | ✅ Team | ✅ |
| **User Suspension** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Account Deletion** | ✅ Self | ✅ Self | ✅ Self | ✅ Self | ✅ All |

### System Administration

| Feature | Explorer | Influencer | Business | Agency | Admin |
|---------|----------|------------|----------|---------|-------|
| **System Settings** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Feature Flags** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Audit Logs** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Support Tickets** | ✅ Create | ✅ Create | ✅ Create | ✅ Create | ✅ Manage |
| **Compliance Reports** | ❌ | ❌ | ❌ | ❌ | ✅ |

## Role-Specific Limitations

### Explorer Limits
- Cannot create campaigns or manage business features
- Limited to personal data and experiences
- Cannot access business analytics or financial tools

### Influencer Limits
- Cannot manage other users or access admin features
- Limited campaign creation (user-generated content only)
- Cannot access platform-wide analytics

### Business Limits
- Cannot access other businesses' data
- Cannot manage platform settings or users outside their organization
- Limited to their own campaigns and team management

### Agency Limits
- Can only manage assigned client accounts
- Cannot access platform administration features
- Limited to client-specific data and analytics

### Admin Privileges
- Full platform access with audit logging
- Can override most restrictions for support purposes
- Access to compliance and regulatory features

## Implementation Example

```typescript
enum Permission {
  // Profile
  PROFILE_READ_SELF = 'profile:read:self',
  PROFILE_READ_ALL = 'profile:read:all',
  PROFILE_UPDATE_SELF = 'profile:update:self',
  
  // Campaigns
  CAMPAIGN_CREATE = 'campaign:create',
  CAMPAIGN_READ_OWN = 'campaign:read:own',
  CAMPAIGN_READ_ALL = 'campaign:read:all',
  CAMPAIGN_UPDATE_OWN = 'campaign:update:own',
  
  // Analytics
  ANALYTICS_READ_PERSONAL = 'analytics:read:personal',
  ANALYTICS_READ_CAMPAIGN = 'analytics:read:campaign',
  ANALYTICS_READ_PLATFORM = 'analytics:read:platform',
  
  // Admin
  ADMIN_USERS = 'admin:users',
  ADMIN_SYSTEM = 'admin:system',
  ADMIN_COMPLIANCE = 'admin:compliance'
}

const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.EXPLORER]: [
    Permission.PROFILE_READ_SELF,
    Permission.PROFILE_UPDATE_SELF,
    Permission.ANALYTICS_READ_PERSONAL
  ],
  
  [UserRole.BUSINESS]: [
    Permission.PROFILE_READ_SELF,
    Permission.PROFILE_UPDATE_SELF,
    Permission.CAMPAIGN_CREATE,
    Permission.CAMPAIGN_READ_OWN,
    Permission.CAMPAIGN_UPDATE_OWN,
    Permission.ANALYTICS_READ_PERSONAL,
    Permission.ANALYTICS_READ_CAMPAIGN
  ],
  
  [UserRole.ADMIN]: [
    // All permissions
    ...Object.values(Permission)
  ]
};
```
