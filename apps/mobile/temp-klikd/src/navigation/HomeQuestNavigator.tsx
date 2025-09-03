// Category 2: Home & QuestHub Navigator (10 screens)
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import Home & Quest screens
import HomeScreen from '../screens/home/HomeScreen';
import QuestHubScreen from '../screens/home/QuestHubScreen';
import QuestMapScreen from '../screens/home/QuestMapScreen';
import QuestDetailsScreen from '../screens/home/QuestDetailsScreen';
import QuestProgressScreen from '../screens/home/QuestProgressScreen';
import RewardsScreen from '../screens/home/RewardsScreen';
import LeaderboardScreen from '../screens/home/LeaderboardScreen';
import NotificationsScreen from '../screens/home/NotificationsScreen';
import SearchScreen from '../screens/home/SearchScreen';
import TrendingScreen from '../screens/home/TrendingScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export type HomeQuestStackParamList = {
  Home: undefined;
  QuestHub: undefined;
  QuestMap: undefined;
  QuestDetails: { questId: string };
  QuestProgress: { questId: string };
  Rewards: undefined;
  Leaderboard: undefined;
  Notifications: undefined;
  Search: { query?: string };
  Trending: undefined;
};

// Main Home Tab Navigator
const HomeTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0B0B0B',
          borderTopColor: '#333',
          height: 80,
          paddingBottom: 20,
        },
        tabBarActiveTintColor: '#ECFF00',
        tabBarInactiveTintColor: '#666',
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="QuestHubTab" 
        component={QuestHubScreen}
        options={{
          tabBarLabel: 'Quests',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="MapTab" 
        component={QuestMapScreen}
        options={{
          tabBarLabel: 'Map',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="RewardsTab" 
        component={RewardsScreen}
        options={{
          tabBarLabel: 'Rewards',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="gift" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main Stack Navigator for Home & Quest flows
const HomeQuestNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeTabs" component={HomeTabNavigator} />
      <Stack.Screen name="QuestDetails" component={QuestDetailsScreen} />
      <Stack.Screen name="QuestProgress" component={QuestProgressScreen} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Trending" component={TrendingScreen} />
    </Stack.Navigator>
  );
};

export default HomeQuestNavigator;
