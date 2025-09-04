import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

// Mock the navigation
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock expo modules
jest.mock('expo-splash-screen', () => ({
  hideAsync: jest.fn(),
  preventAutoHideAsync: jest.fn(),
}));

describe('App', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<App />);
    // Basic test to ensure the app renders
    expect(getByTestId).toBeDefined();
  });
});
