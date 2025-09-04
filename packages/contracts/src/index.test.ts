import { describe, it, expect } from 'vitest';
import type { BaseContract, UserContract, ApiResponse } from './index.js';

describe('Klikd Contracts', () => {
  it('should export contract types', () => {
    // Test BaseContract
    const baseContract: BaseContract = {
      id: 'test-id',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    };

    expect(baseContract.id).toBe('test-id');
    expect(baseContract.createdAt).toBeDefined();
    expect(baseContract.updatedAt).toBeDefined();
  });

  it('should work with UserContract', () => {
    const userContract: UserContract = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    };

    expect(userContract.email).toBe('test@example.com');
    expect(userContract.role).toBe('user');
  });

  it('should work with ApiResponse', () => {
    const successResponse: ApiResponse<string> = {
      success: true,
      data: 'test data',
      message: 'Success'
    };

    const errorResponse: ApiResponse<never> = {
      success: false,
      error: 'Something went wrong'
    };

    expect(successResponse.success).toBe(true);
    expect(successResponse.data).toBe('test data');
    expect(errorResponse.success).toBe(false);
    expect(errorResponse.error).toBe('Something went wrong');
  });
});
