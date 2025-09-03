# API Specification

## Overview

Klikd API follows REST principles with tRPC for type-safe client-server communication. All endpoints support JSON and follow OpenAPI 3.0 specification.

## Authentication

### JWT Token Flow
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

Response:
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "role": "explorer",
    "tenantId": "tenant_456"
  }
}
```

### Authorization Header
```http
Authorization: Bearer <accessToken>
X-Tenant-ID: <tenantId>
```

## Core Endpoints

### Users & Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | User registration |
| POST | `/auth/login` | User login |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | User logout |
| GET | `/auth/me` | Get current user |
| PUT | `/users/profile` | Update user profile |
| GET | `/users/{id}` | Get user by ID |

### Missions & Campaigns

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/missions` | List available missions |
| GET | `/missions/{id}` | Get mission details |
| POST | `/missions/{id}/start` | Start a mission |
| POST | `/missions/{id}/complete` | Complete a mission |
| GET | `/campaigns` | List campaigns |
| POST | `/campaigns` | Create campaign (Business+) |
| PUT | `/campaigns/{id}` | Update campaign |

### AR & Spatial Data

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/ar/anchors` | Get nearby AR anchors |
| POST | `/ar/anchors` | Create AR anchor |
| PUT | `/ar/anchors/{id}` | Update AR anchor |
| DELETE | `/ar/anchors/{id}` | Delete AR anchor |
| GET | `/ar/assets/{id}` | Get AR asset metadata |
| POST | `/ar/assets/upload` | Upload AR asset |

### Gamification & Rewards

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/rewards/balance` | Get user reward balance |
| GET | `/rewards/history` | Get reward history |
| POST | `/rewards/redeem` | Redeem rewards |
| GET | `/leaderboard` | Get leaderboard |
| GET | `/achievements` | Get user achievements |

### Commerce & Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/wallet` | Get wallet balance |
| POST | `/wallet/topup` | Top up wallet |
| POST | `/payments/stripe/webhook` | Stripe webhook |
| POST | `/payments/stc/webhook` | STC Pay webhook |
| GET | `/orders` | Get order history |
| POST | `/orders` | Create order |

### Analytics & Insights

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/analytics/events` | Track analytics event |
| GET | `/analytics/dashboard` | Get dashboard data |
| GET | `/analytics/reports` | Generate reports |
| GET | `/analytics/funnels` | Get conversion funnels |

## Request/Response Schemas

### Mission Schema
```typescript
interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'ar_scan' | 'social_share' | 'location_visit' | 'purchase';
  reward: {
    xp: number;
    coins: number;
    items?: string[];
  };
  requirements: {
    location?: GeoPoint;
    radius?: number;
    products?: string[];
    socialPlatforms?: string[];
  };
  status: 'active' | 'completed' | 'expired';
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}
```

### AR Anchor Schema
```typescript
interface ARanchor {
  id: string;
  position: {
    latitude: number;
    longitude: number;
    altitude?: number;
  };
  orientation: {
    x: number;
    y: number;
    z: number;
    w: number;
  };
  assets: {
    modelUrl: string;
    textureUrl?: string;
    animationUrl?: string;
  };
  metadata: {
    title: string;
    description?: string;
    tags: string[];
  };
  visibility: 'public' | 'private' | 'tenant';
  createdBy: string;
  tenantId: string;
}
```

### Analytics Event Schema
```typescript
interface AnalyticsEvent {
  eventName: string;
  userId: string;
  tenantId: string;
  sessionId: string;
  timestamp: string;
  properties: Record<string, any>;
  context: {
    app: string;
    version: string;
    platform: string;
    location?: GeoPoint;
  };
}
```

## Pagination

All list endpoints support cursor-based pagination:

```http
GET /missions?cursor=eyJ...&limit=20
```

Response:
```json
{
  "data": [...],
  "pagination": {
    "nextCursor": "eyJ...",
    "hasMore": true,
    "total": 150
  }
}
```

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  },
  "requestId": "req_123456"
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or expired token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `RATE_LIMITED` | 429 | Rate limit exceeded |
| `INTERNAL_ERROR` | 500 | Internal server error |

## Rate Limiting

Rate limits are enforced per tenant and user:

- **Free Plan**: 1000 requests/hour
- **Pro Plan**: 10,000 requests/hour  
- **Premium Plan**: 100,000 requests/hour
- **Enterprise**: Custom limits

Headers:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Webhooks

### Stripe Webhook
```http
POST /payments/stripe/webhook
Stripe-Signature: t=1640995200,v1=...

{
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_123",
      "amount": 2000,
      "currency": "usd"
    }
  }
}
```

### STC Pay Webhook
```http
POST /payments/stc/webhook
X-STC-Signature: ...

{
  "transactionId": "txn_123",
  "status": "completed",
  "amount": 100.00,
  "currency": "SAR"
}
```

## OpenAPI Generation

API documentation is auto-generated from `@klikd/contracts` schemas:

```bash
pnpm run generate:openapi
```

This creates:
- `docs/openapi.json` - OpenAPI 3.0 specification
- `docs/api-docs.html` - Interactive documentation
