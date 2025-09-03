import Constants from 'expo-constants';

const ENV = {
  dev: {
    API_URL: 'http://localhost:3001/api/v1',
    WS_URL: 'ws://localhost:3001',
    ANALYTICS_ENABLED: false,
  },
  staging: {
    API_URL: 'https://staging-api.klikd.com/v1',
    WS_URL: 'wss://staging-api.klikd.com',
    ANALYTICS_ENABLED: true,
  },
  production: {
    API_URL: 'https://api.klikd.com/v1',
    WS_URL: 'wss://api.klikd.com',
    ANALYTICS_ENABLED: true,
  },
};

const getEnvVars = () => {
  if (__DEV__) {
    return ENV.dev;
  } else if (Constants.expoConfig?.extra?.environment === 'staging') {
    return ENV.staging;
  } else {
    return ENV.production;
  }
};

export const config = {
  ...getEnvVars(),
  APP_VERSION: Constants.expoConfig?.version || '1.0.0',
  PLATFORM: Constants.platform?.ios ? 'ios' : 'android',
  
  // AR Configuration
  AR: {
    MAX_ANCHORS: 50,
    TRACKING_TIMEOUT: 30000,
    ASSET_CACHE_SIZE: 100 * 1024 * 1024, // 100MB
  },
  
  // Analytics
  ANALYTICS: {
    MIXPANEL_TOKEN: process.env.EXPO_PUBLIC_MIXPANEL_TOKEN,
    FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  },
  
  // Feature Flags
  FEATURES: {
    AR_ENABLED: true,
    SOCIAL_SHARING: true,
    PUSH_NOTIFICATIONS: true,
    BIOMETRIC_AUTH: true,
  },
};
