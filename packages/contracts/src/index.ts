// Klikd Contracts Package
// This package provides shared contracts and schemas

export interface BaseContract {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserContract extends BaseContract {
  email: string;
  name: string;
  role: 'user' | 'admin' | 'moderator';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Types are already exported as interfaces above
