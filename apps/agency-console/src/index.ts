// Klikd Agency Console Package
// This package provides the agency management interface

export interface AgencyConfig {
  apiUrl: string;
  authToken: string;
  features: string[];
}

export interface AgencyUser {
  id: string;
  email: string;
  role: 'agent' | 'manager' | 'admin';
  permissions: string[];
}

export class AgencyConsoleApp {
  private config: AgencyConfig;

  constructor(config: AgencyConfig) {
    this.config = config;
  }

  initialize(): void {
    console.log('Initializing Klikd Agency Console application');
    // Implementation would go here
  }

  getUserPermissions(_userId: string): string[] {
    // Mock implementation
    return ['read', 'write', 'manage'];
  }
}

// Export agency types and classes
export type { AgencyConfig, AgencyUser };
export { AgencyConsoleApp };
