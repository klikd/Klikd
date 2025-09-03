import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import SwipeNavigator from '../components/SwipeNavigator';

// Mock data for story avatars
const MOCK_STORIES = [
  { id: '1', username: 'Your Story', avatar: 'https://via.placeholder.com/60', hasStory: true, isOwn: true },
  { id: '2', username: 'sarah_k', avatar: 'https://via.placeholder.com/60', hasStory: true, isOwn: false },
  { id: '3', username: 'alex_m', avatar: 'https://via.placeholder.com/60', hasStory: true, isOwn: false },
  { id: '4', username: 'maya_r', avatar: 'https://via.placeholder.com/60', hasStory: false, isOwn: false },
  { id: '5', username: 'john_d', avatar: 'https://via.placeholder.com/60', hasStory: true, isOwn: false },
];

interface FeedScreenProps {
  navigation: any;
}

export default function FeedScreen({ navigation }: FeedScreenProps) {
  const handleStoryTap = (story: any) => {
    if (story.isOwn) {
      // Navigate to camera for creating new story
      navigation.navigate('Camera');
    } else {
      // Navigate to story viewer
      navigation.navigate('Story', { storyId: story.id, username: story.username });
    }
  };

  const handleCameraPress = () => {
    navigation.navigate('Camera');
  };

  const handleSwipeUp = () => {
    navigation.navigate('Camera');
  };

  const handleSwipeLeft = () => {
    navigation.navigate('Chat');
  };

  const handleSwipeRight = () => {
    navigation.navigate('Profile');
  };

  return (
    <SwipeNavigator 
      onSwipeUp={handleSwipeUp}
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
    >
      <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Klikd</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stories Section */}
      <View style={styles.storiesSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesContainer}
        >
          {MOCK_STORIES.map((story) => (
            <TouchableOpacity 
              key={story.id} 
              style={styles.storyItem}
              onPress={() => handleStoryTap(story)}
            >
              <View style={[
                styles.storyAvatar,
                story.hasStory && styles.storyAvatarWithStory,
                story.isOwn && styles.ownStoryAvatar
              ]}>
                <Image source={{ uri: story.avatar }} style={styles.avatarImage} />
                {story.isOwn && (
                  <View style={styles.addStoryIcon}>
                    <Ionicons name="add" size={16} color="#fff" />
                  </View>
                )}
              </View>
              <Text style={styles.storyUsername} numberOfLines={1}>
                {story.username}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        <View style={styles.placeholderContent}>
          <Ionicons name="camera" size={64} color="#ccc" />
          <Text style={styles.placeholderText}>Tap camera to start creating</Text>
          <Text style={styles.placeholderSubtext}>
            Capture AR experiences, share stories, and explore zones
          </Text>
        </View>
      </View>

      {/* Bottom Navigation Hint */}
      <View style={styles.bottomHint}>
        <View style={styles.swipeIndicator}>
          <Ionicons name="chevron-up" size={20} color="#999" />
          <Text style={styles.swipeText}>Swipe up for Camera</Text>
        </View>
      </View>

      {/* Floating Camera Button */}
      <TouchableOpacity 
        style={styles.cameraButton}
        onPress={handleCameraPress}
      >
        <Ionicons name="camera" size={28} color="#fff" />
      </TouchableOpacity>
      </SafeAreaView>
    </SwipeNavigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
    padding: 4,
  },
  storiesSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  storiesContainer: {
    paddingHorizontal: 16,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 2,
    marginBottom: 4,
  },
  storyAvatarWithStory: {
    borderWidth: 2,
    borderColor: '#ff6b35',
  },
  ownStoryAvatar: {
    borderColor: '#007AFF',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
  },
  addStoryIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  storyUsername: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  placeholderContent: {
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomHint: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  swipeIndicator: {
    alignItems: 'center',
  },
  swipeText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
