// Category 16: Story & Social Engagement Hub Navigator (8 screens)
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import Story & Social screens
import SocialFeedScreen from '../screens/social/SocialFeedScreen';
import StoryViewerScreen from '../screens/social/StoryViewerScreen';
import StoryCreatorScreen from '../screens/social/StoryCreatorScreen';
import UserProfileScreen from '../screens/social/UserProfileScreen';
import FollowersScreen from '../screens/social/FollowersScreen';
import MessagingScreen from '../screens/social/MessagingScreen';
import LiveStreamScreen from '../screens/social/LiveStreamScreen';
import CommunityHubScreen from '../screens/social/CommunityHubScreen';

const Stack = createStackNavigator();

export type SocialStoryStackParamList = {
  SocialFeed: undefined;
  StoryViewer: { storyId: string; userId?: string };
  StoryCreator: { type?: 'photo' | 'video' | 'ar'; questId?: string };
  UserProfile: { userId: string };
  Followers: { userId: string; type: 'followers' | 'following' };
  Messaging: { chatId?: string; userId?: string };
  LiveStream: { streamId?: string; isHost?: boolean };
  CommunityHub: { communityId?: string };
};

const SocialStoryNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <Stack.Screen name="SocialFeed" component={SocialFeedScreen} />
      <Stack.Screen 
        name="StoryViewer" 
        component={StoryViewerScreen}
        options={{
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: {
              opacity: current.progress,
            },
          }),
        }}
      />
      <Stack.Screen name="StoryCreator" component={StoryCreatorScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="Followers" component={FollowersScreen} />
      <Stack.Screen name="Messaging" component={MessagingScreen} />
      <Stack.Screen name="LiveStream" component={LiveStreamScreen} />
      <Stack.Screen name="CommunityHub" component={CommunityHubScreen} />
    </Stack.Navigator>
  );
};

export default SocialStoryNavigator;
