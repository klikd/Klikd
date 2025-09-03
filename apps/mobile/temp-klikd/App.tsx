import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import OnboardingScreen from './src/screens/OnboardingScreen';
import FeedScreen from './src/screens/FeedScreen';
import CameraScreen from './src/screens/CameraScreen';
import ModernCameraScreen from './src/screens/ModernCameraScreen';
import MapScreen from './src/screens/MapScreen';
import MissionsScreen from './src/screens/MissionsScreen';
import SocialScreen from './src/screens/SocialScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import InfluencerDashboard from './src/screens/InfluencerDashboard';
import BusinessDashboard from './src/screens/BusinessDashboard';
import ValidationRunner from './src/validation/ValidationRunner';
import DesignShowcaseScreen from './src/screens/DesignShowcaseScreen';
import FigmaUIRecreationScreen from './src/screens/FigmaUIRecreationScreen';
import KlikdBrandShowcaseScreen from './src/screens/KlikdBrandShowcaseScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      if (hasLaunched === null) {
        setIsFirstLaunch(true);
        await AsyncStorage.setItem('hasLaunched', 'true');
      } else {
        setIsFirstLaunch(false);
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
      setIsFirstLaunch(false);
    }
  };

  if (isFirstLaunch === null) {
    return null; // Loading state
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator 
        initialRouteName={isFirstLaunch ? "Onboarding" : "Feed"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Feed" component={FeedScreen} />
        <Stack.Screen name="Camera" component={ModernCameraScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Missions" component={MissionsScreen} />
        <Stack.Screen name="Social" component={SocialScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="InfluencerDashboard" component={InfluencerDashboard} />
        <Stack.Screen name="BusinessDashboard" component={BusinessDashboard} />
        <Stack.Screen name="ValidationRunner" component={ValidationRunner} />
        <Stack.Screen name="DesignShowcase" component={DesignShowcaseScreen} />
        <Stack.Screen name="FigmaUIRecreation" component={FigmaUIRecreationScreen} />
        <Stack.Screen name="KlikdBrandShowcase" component={KlikdBrandShowcaseScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
