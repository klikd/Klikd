import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import FeedScreen from '../screens/FeedScreen';
import CameraScreen from '../screens/CameraScreen';
import StoryScreen from '../screens/StoryScreen';
import ARZonesScreen from '../screens/ARZonesScreen';
import ARBoothScreen from '../screens/ARBoothScreen';
import NCPsScreen from '../screens/NCPsScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Feed">
      <Stack.Screen name="Feed" component={FeedScreen} />
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Story" component={StoryScreen} />
      <Stack.Screen name="ARZones" component={ARZonesScreen} />
      <Stack.Screen name="ARBooth" component={ARBoothScreen} />
      <Stack.Screen name="NCPs" component={NCPsScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
