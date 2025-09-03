// Category 1: Onboarding & Authentication Navigator (10 screens)
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import all onboarding screens
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import RoleSelectionScreen from '../screens/onboarding/RoleSelectionScreen';
import SignupScreen from '../screens/onboarding/SignupScreen';
import LoginScreen from '../screens/onboarding/LoginScreen';
import ForgotPasswordScreen from '../screens/onboarding/ForgotPasswordScreen';
import PhoneVerificationScreen from '../screens/onboarding/PhoneVerificationScreen';
import PermissionsScreen from '../screens/onboarding/PermissionsScreen';
import FirstTimeTutorialScreen from '../screens/onboarding/FirstTimeTutorialScreen';
import TermsPrivacyScreen from '../screens/onboarding/TermsPrivacyScreen';
import OnboardingCompletionScreen from '../screens/onboarding/OnboardingCompletionScreen';

const Stack = createStackNavigator();

export type OnboardingStackParamList = {
  Welcome: undefined;
  RoleSelection: undefined;
  Signup: { role?: string };
  Login: undefined;
  ForgotPassword: undefined;
  PhoneVerification: { phoneNumber: string };
  Permissions: undefined;
  FirstTimeTutorial: undefined;
  TermsPrivacy: undefined;
  OnboardingCompletion: { role: string; userName: string };
};

const OnboardingNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="PhoneVerification" component={PhoneVerificationScreen} />
      <Stack.Screen name="Permissions" component={PermissionsScreen} />
      <Stack.Screen name="FirstTimeTutorial" component={FirstTimeTutorialScreen} />
      <Stack.Screen name="TermsPrivacy" component={TermsPrivacyScreen} />
      <Stack.Screen name="OnboardingCompletion" component={OnboardingCompletionScreen} />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;
