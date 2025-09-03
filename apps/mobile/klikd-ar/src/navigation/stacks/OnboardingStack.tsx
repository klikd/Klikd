import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import { OnboardingWelcomeScreen } from '../../screens/onboarding/OnboardingWelcomeScreen';
import { RoleSelectionScreen } from '../../screens/onboarding/RoleSelectionScreen';
import { ProfileSetupScreen } from '../../screens/onboarding/ProfileSetupScreen';
import { PermissionsScreen } from '../../screens/onboarding/PermissionsScreen';
import { TutorialScreen } from '../../screens/onboarding/TutorialScreen';

const Stack = createNativeStackNavigator();

export function OnboardingStack() {
  return (
    <Stack.Navigator
      initialRouteName="OnboardingWelcome"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Prevent going back during onboarding
      }}
    >
      <Stack.Screen name="OnboardingWelcome" component={OnboardingWelcomeScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="Permissions" component={PermissionsScreen} />
      <Stack.Screen name="Tutorial" component={TutorialScreen} />
    </Stack.Navigator>
  );
}
