// Klikd Business Console Package
// This package provides the business management interface

export interface BusinessConfig {
  apiUrl: string;
  authToken: string;
  features: string[];
}

export interface BusinessUser {
  id: string;
  email: string;
  role: 'owner' | 'manager' | 'employee';
  permissions: string[];
}

export class BusinessConsoleApp {
  private config: BusinessConfig;

  constructor(config: BusinessConfig) {
    this.config = config;
  }

  initialize(): void {
    console.log('Initializing Klikd Business Console application');
    // Implementation would go here
  }

  getUserPermissions(_userId: string): string[] {
    // Mock implementation
    return ['read', 'write', 'manage'];
  }
}

// Export business types and classes
export type { BusinessConfig, BusinessUser };
export { BusinessConsoleApp };
