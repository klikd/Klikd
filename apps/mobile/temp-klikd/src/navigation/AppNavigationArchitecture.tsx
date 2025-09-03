// Klikd App Navigation Architecture - 350+ Screens
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { KlikdBrandSystem } from '../design/KlikdBrandSystem';

// Import all screen categories
import OnboardingNavigator from './OnboardingNavigator';
import QuestHubNavigator from './QuestHubNavigator';
import QuestTypesNavigator from './QuestTypesNavigator';
import ProfileNavigator from './ProfileNavigator';
import ARCameraNavigator from './ARCameraNavigator';
import SocialNavigator from './SocialNavigator';
import CreatorToolsNavigator from './CreatorToolsNavigator';
import BrandToolsNavigator from './BrandToolsNavigator';
import CoachingNavigator from './CoachingNavigator';
import ComplianceNavigator from './ComplianceNavigator';
import AdminNavigator from './AdminNavigator';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Main Tab Navigation (Core User Journey)
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;
          
          switch (route.name) {
            case 'QuestHub':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'ARCamera':
              iconName = focused ? 'camera' : 'camera-outline';
              break;
            case 'QuestTypes':
              iconName = focused ? 'flash' : 'flash-outline';
              break;
            case 'Social':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'circle';
          }
          
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: KlikdBrandSystem.colors.primary.klikd_green,
        tabBarInactiveTintColor: KlikdBrandSystem.colors.ui.soft_gray,
        tabBarStyle: {
          backgroundColor: KlikdBrandSystem.colors.ui.dark_bg,
          borderTopColor: '#333',
          paddingBottom: 8,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="QuestHub" 
        component={QuestHubNavigator}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="ARCamera" 
        component={ARCameraNavigator}
        options={{ title: 'Scan' }}
      />
      <Tab.Screen 
        name="QuestTypes" 
        component={QuestTypesNavigator}
        options={{ title: 'Quests' }}
      />
      <Tab.Screen 
        name="Social" 
        component={SocialNavigator}
        options={{ title: 'Social' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileNavigator}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

// Role-Based Navigation (Drawer for Advanced Features)
const RoleBasedDrawer = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: KlikdBrandSystem.colors.ui.dark_bg,
          width: 280,
        },
        drawerActiveTintColor: KlikdBrandSystem.colors.primary.klikd_green,
        drawerInactiveTintColor: KlikdBrandSystem.colors.ui.soft_gray,
        headerShown: false,
      }}
    >
      <Drawer.Screen 
        name="MainTabs" 
        component={MainTabNavigator}
        options={{
          title: 'Home',
          drawerIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      
      {/* Creator Tools */}
      <Drawer.Screen 
        name="CreatorTools" 
        component={CreatorToolsNavigator}
        options={{
          title: 'Creator Studio',
          drawerIcon: ({ color }) => (
            <Ionicons name="create" size={24} color={color} />
          ),
        }}
      />
      
      {/* Brand Tools */}
      <Drawer.Screen 
        name="BrandTools" 
        component={BrandToolsNavigator}
        options={{
          title: 'Brand Dashboard',
          drawerIcon: ({ color }) => (
            <Ionicons name="business" size={24} color={color} />
          ),
        }}
      />
      
      {/* Coaching */}
      <Drawer.Screen 
        name="Coaching" 
        component={CoachingNavigator}
        options={{
          title: 'Coaching Hub',
          drawerIcon: ({ color }) => (
            <Ionicons name="school" size={24} color={color} />
          ),
        }}
      />
      
      {/* Compliance */}
      <Drawer.Screen 
        name="Compliance" 
        component={ComplianceNavigator}
        options={{
          title: 'Compliance Center',
          drawerIcon: ({ color }) => (
            <Ionicons name="shield-checkmark" size={24} color={color} />
          ),
        }}
      />
      
      {/* Admin Tools */}
      <Drawer.Screen 
        name="Admin" 
        component={AdminNavigator}
        options={{
          title: 'Admin Panel',
          drawerIcon: ({ color }) => (
            <Ionicons name="settings" size={24} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

// Root Navigation Stack
export const AppNavigationArchitecture = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: KlikdBrandSystem.colors.ui.dark_bg },
      }}
    >
      {/* Onboarding Flow */}
      <Stack.Screen 
        name="Onboarding" 
        component={OnboardingNavigator}
        options={{ gestureEnabled: false }}
      />
      
      {/* Main App */}
      <Stack.Screen 
        name="MainApp" 
        component={RoleBasedDrawer}
      />
      
      {/* Modal Screens */}
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="QuestDetail" component={QuestDetailModal} />
        <Stack.Screen name="ARCapture" component={ARCaptureModal} />
        <Stack.Screen name="StoryCreator" component={StoryCreatorModal} />
        <Stack.Screen name="PaymentFlow" component={PaymentFlowModal} />
        <Stack.Screen name="CoachBooking" component={CoachBookingModal} />
      </Stack.Group>
      
      {/* Full Screen Overlays */}
      <Stack.Group screenOptions={{ presentation: 'transparentModal' }}>
        <Stack.Screen name="QuestRadar" component={QuestRadarOverlay} />
        <Stack.Screen name="NotificationCenter" component={NotificationOverlay} />
        <Stack.Screen name="SecurityAlert" component={SecurityAlertOverlay} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

// Navigation Type Definitions
export type RootStackParamList = {
  Onboarding: undefined;
  MainApp: undefined;
  QuestDetail: { questId: string; questType: string };
  ARCapture: { questId?: string; mode: 'quest' | 'free' | 'story' };
  StoryCreator: { type: 'ar' | 'photo' | 'video' };
  PaymentFlow: { amount: number; type: 'subscription' | 'coins' | 'coaching' };
  CoachBooking: { coachId: string; sessionType: string };
  QuestRadar: undefined;
  NotificationCenter: undefined;
  SecurityAlert: { alertType: string; message: string };
};

export type MainTabParamList = {
  QuestHub: undefined;
  ARCamera: undefined;
  QuestTypes: undefined;
  Social: undefined;
  Profile: undefined;
};

// Placeholder Modal Components (to be implemented)
const QuestDetailModal = () => null;
const ARCaptureModal = () => null;
const StoryCreatorModal = () => null;
const PaymentFlowModal = () => null;
const CoachBookingModal = () => null;
const QuestRadarOverlay = () => null;
const NotificationOverlay = () => null;
const SecurityAlertOverlay = () => null;

export default AppNavigationArchitecture;
