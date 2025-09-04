// Klikd Web Admin Package
// This package provides the web-based admin interface

export interface AdminConfig {
  apiUrl: string;
  authToken: string;
  features: string[];
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super-admin';
  permissions: string[];
}

export class WebAdminApp {
  private config: AdminConfig;

  constructor(config: AdminConfig) {
    this.config = config;
  }

  initialize(): void {
    console.log('Initializing Klikd Web Admin application');
    // Implementation would go here
  }

  getUserPermissions(_userId: string): string[] {
    // Mock implementation
    return ['read', 'write', 'delete'];
  }
}

// Export admin types and classes
export type { AdminConfig, AdminUser };
export { WebAdminApp };
