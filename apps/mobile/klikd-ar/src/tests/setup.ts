// Jest setup file for mobile app tests
import 'react-native-gesture-handler/jestSetup';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock expo modules
jest.mock('expo-camera', () => ({
  Camera: 'Camera',
  CameraType: { front: 'front', back: 'back' },
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));

// Mock react-native modules
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock React Native modules that cause issues
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
jest.mock('@react-native/js-polyfills/error-guard', () => ({
  ErrorHandler: jest.fn(),
}));

// Mock the entire React Native jest setup to avoid polyfill issues
jest.mock('react-native/jest/setup', () => ({}));

// Mock specific problematic modules
jest.mock('@react-native/js-polyfills', () => ({
  errorGuard: {
    ErrorHandler: jest.fn(),
  },
}));

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock global variables
global.__DEV__ = true;
