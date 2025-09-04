// Klikd Creator Console Package
// This package provides the creator management interface

export interface CreatorConfig {
  apiUrl: string;
  authToken: string;
  features: string[];
}

export interface CreatorUser {
  id: string;
  email: string;
  role: 'creator' | 'influencer' | 'brand';
  permissions: string[];
}

export class CreatorConsoleApp {
  private config: CreatorConfig;

  constructor(config: CreatorConfig) {
    this.config = config;
  }

  initialize(): void {
    console.log('Initializing Klikd Creator Console application');
    // Implementation would go here
  }

  getUserPermissions(userId: string): string[] {
    // Mock implementation
    return ['read', 'write', 'create'];
  }
}

// Export creator types and classes
export type { CreatorConfig, CreatorUser };
export { CreatorConsoleApp };
