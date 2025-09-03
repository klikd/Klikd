// 16.1 Social Feed Screen - TikTok/Snapchat-inspired social content feed
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { KlikdScreenContainer, KlikdCard, KlikdBadge, KlikdAvatar } from '../../components/KlikdScalableComponents';
import { ModernKlikdButton } from '../../design/FigmaModernUI';
import { TikTokStoryRing, SnapchatActionButton, FloatingHeartAnimation } from '../../design/TikTokSnapchatUI';
import { KlikdBrandSystem } from '../../design/KlikdBrandSystem';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface SocialFeedScreenProps {
  navigation: any;
}

const SocialFeedScreen: React.FC<SocialFeedScreenProps> = ({ navigation }) => {
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [showHearts, setShowHearts] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const mockStories = [
    { id: '1', userId: 'user1', username: 'ahmed_ksa', avatar: null, hasStory: true, isLive: false },
    { id: '2', userId: 'user2', username: 'sara_riyadh', avatar: null, hasStory: true, isLive: true },
    { id: '3', userId: 'user3', username: 'mohammed_jed', avatar: null, hasStory: true, isLive: false },
    { id: '4', userId: 'user4', username: 'fatima_dxb', avatar: null, hasStory: false, isLive: false },
    { id: '5', userId: 'user5', username: 'omar_kw', avatar: null, hasStory: true, isLive: false },
  ];

  const mockPosts = [
    {
      id: 'post1',
      userId: 'user1',
      username: 'ahmed_ksa',
      avatar: null,
      content: 'Just found an epic AR treasure at Mall of Arabia! 🏆✨',
      image: null,
      questTitle: 'Mall Explorer Quest',
      likes: 234,
      comments: 45,
      shares: 12,
      timestamp: '2h ago',
      location: 'Mall of Arabia, Jeddah',
      isQuestPost: true,
    },
    {
      id: 'post2',
      userId: 'user2',
      username: 'sara_riyadh',
      avatar: null,
      content: 'Coffee shop AR hunt complete! Who else is joining the weekend challenge? ☕️🎯',
      image: null,
      questTitle: 'Coffee Shop Hunt',
      likes: 156,
      comments: 28,
      shares: 8,
      timestamp: '4h ago',
      location: 'Riyadh City Center',
      isQuestPost: true,
    },
    {
      id: 'post3',
      userId: 'user3',
      username: 'mohammed_jed',
      avatar: null,
      content: 'Level 15 achieved! Thanks to all my quest buddies for the support 🚀',
      image: null,
      likes: 89,
      comments: 15,
      shares: 3,
      timestamp: '6h ago',
      location: null,
      isQuestPost: false,
    },
  ];

  const handleLike = (postId: string) => {
    const newLikedPosts = new Set(likedPosts);
    if (likedPosts.has(postId)) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
      setShowHearts(true);
      setTimeout(() => setShowHearts(false), 2000);
    }
    setLikedPosts(newLikedPosts);
  };

  const handleStoryPress = (storyId: string, userId: string) => {
    navigation.navigate('StoryViewer', { storyId, userId });
  };

  return (
    <KlikdScreenContainer>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Klikd Social</Text>
          <View style={styles.headerActions}>
            <ModernKlikdButton
              title=""
              variant="icon"
              size="medium"
              icon="search"
              onPress={() => navigation.navigate('Search')}
              style={styles.headerButton}
            />
            <ModernKlikdButton
              title=""
              variant="icon"
              size="medium"
              icon="chatbubbles"
              onPress={() => navigation.navigate('Messaging')}
              style={styles.headerButton}
            />
            <ModernKlikdButton
              title=""
              variant="icon"
              size="medium"
              icon="notifications"
              onPress={() => navigation.navigate('Notifications')}
              style={styles.headerButton}
            />
          </View>
        </View>

        {/* Stories Section */}
        <View style={styles.storiesSection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesContainer}
          >
            {/* Add Story Button */}
            <TouchableOpacity 
              style={styles.addStoryContainer}
              onPress={() => navigation.navigate('StoryCreator')}
            >
              <View style={styles.addStoryButton}>
                <Ionicons name="add" size={24} color="white" />
              </View>
              <Text style={styles.storyUsername}>Your Story</Text>
            </TouchableOpacity>

            {/* User Stories */}
            {mockStories.map((story, index) => (
              <TouchableOpacity
                key={story.id}
                style={styles.storyContainer}
                onPress={() => handleStoryPress(story.id, story.userId)}
              >
                <TikTokStoryRing
                  size={64}
                  hasStory={story.hasStory}
                  isViewed={false}
                  isLive={story.isLive}
                >
                  <KlikdAvatar 
                    size={60}
                    initials={story.username.substring(0, 2).toUpperCase()}
                    source={story.avatar}
                  />
                </TikTokStoryRing>
                <Text style={styles.storyUsername} numberOfLines={1}>
                  {story.username}
                </Text>
                {story.isLive && (
                  <KlikdBadge text="LIVE" variant="error" size="small" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Posts Feed */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.feedContainer}
          showsVerticalScrollIndicator={false}
        >
          {mockPosts.map((post) => (
            <KlikdCard key={post.id} variant="default" style={styles.postCard}>
              {/* Post Header */}
              <View style={styles.postHeader}>
                <View style={styles.postUserInfo}>
                  <KlikdAvatar 
                    size={40}
                    initials={post.username.substring(0, 2).toUpperCase()}
                    onPress={() => navigation.navigate('UserProfile', { userId: post.userId })}
                  />
                  <View style={styles.postUserDetails}>
                    <Text style={styles.postUsername}>{post.username}</Text>
                    <View style={styles.postMeta}>
                      <Text style={styles.postTimestamp}>{post.timestamp}</Text>
                      {post.location && (
                        <>
                          <Text style={styles.postMetaDot}>•</Text>
                          <Text style={styles.postLocation}>{post.location}</Text>
                        </>
                      )}
                    </View>
                  </View>
                </View>
                
                <ModernKlikdButton
                  title=""
                  variant="icon"
                  size="small"
                  icon="ellipsis-horizontal"
                  onPress={() => {/* Show post options */}}
                  style={styles.postOptionsButton}
                />
              </View>

              {/* Quest Badge */}
              {post.isQuestPost && (
                <View style={styles.questBadgeContainer}>
                  <KlikdBadge 
                    text={`🎯 ${post.questTitle}`}
                    variant="premium"
                    size="medium"
                    icon="compass"
                  />
                </View>
              )}

              {/* Post Content */}
              <View style={styles.postContent}>
                <Text style={styles.postText}>{post.content}</Text>
                
                {/* Mock Image Placeholder */}
                <View style={styles.postImagePlaceholder}>
                  <Ionicons name="image" size={48} color="#666" />
                  <Text style={styles.imagePlaceholderText}>Quest Image/Video</Text>
                </View>
              </View>

              {/* Post Actions */}
              <View style={styles.postActions}>
                <View style={styles.postActionsLeft}>
                  <SnapchatActionButton
                    icon={likedPosts.has(post.id) ? "heart" : "heart-outline"}
                    count={post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                    onPress={() => handleLike(post.id)}
                    active={likedPosts.has(post.id)}
                    glowColor={KlikdBrandSystem.colors.primary.klikd_green}
                  />
                  
                  <SnapchatActionButton
                    icon="chatbubble-outline"
                    count={post.comments}
                    onPress={() => {/* Open comments */}}
                  />
                  
                  <SnapchatActionButton
                    icon="share-outline"
                    count={post.shares}
                    onPress={() => navigation.navigate('ARShare', { 
                      contentId: post.id, 
                      type: 'photo' 
                    })}
                  />
                </View>
                
                <ModernKlikdButton
                  title=""
                  variant="icon"
                  size="small"
                  icon="bookmark-outline"
                  onPress={() => {/* Save post */}}
                  style={styles.saveButton}
                />
              </View>
            </KlikdCard>
          ))}

          {/* Load More Indicator */}
          <View style={styles.loadMoreContainer}>
            <ModernKlikdButton
              title="Load More Posts"
              variant="secondary"
              size="medium"
              icon="refresh"
              onPress={() => {/* Load more posts */}}
            />
          </View>
        </ScrollView>

        {/* Floating Action Button */}
        <View style={styles.fabContainer}>
          <ModernKlikdButton
            title=""
            variant="primary"
            size="large"
            icon="camera"
            onPress={() => navigation.navigate('StoryCreator', { type: 'photo' })}
            style={styles.fab}
          />
        </View>

        {/* Floating Hearts Animation */}
        {showHearts && (
          <FloatingHeartAnimation
            count={5}
            duration={2000}
            color={KlikdBrandSystem.colors.primary.klikd_green}
          />
        )}
      </Animated.View>
    </KlikdScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 44,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: KlikdBrandSystem.colors.primary.klikd_white,
    fontFamily: 'Inter',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  storiesSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  storiesContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  addStoryContainer: {
    alignItems: 'center',
    width: 70,
  },
  addStoryButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: KlikdBrandSystem.colors.primary.klikd_green,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  storyContainer: {
    alignItems: 'center',
    width: 70,
  },
  storyUsername: {
    fontSize: 12,
    color: KlikdBrandSystem.colors.primary.klikd_white,
    fontFamily: 'Inter',
    textAlign: 'center',
    marginTop: 4,
  },
  feedContainer: {
    flex: 1,
  },
  postCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  postUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  postUserDetails: {
    marginLeft: 12,
    flex: 1,
  },
  postUsername: {
    fontSize: 16,
    fontWeight: '600',
    color: KlikdBrandSystem.colors.primary.klikd_white,
    fontFamily: 'Inter',
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  postTimestamp: {
    fontSize: 12,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    fontFamily: 'Inter',
  },
  postMetaDot: {
    fontSize: 12,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    marginHorizontal: 4,
  },
  postLocation: {
    fontSize: 12,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    fontFamily: 'Inter',
  },
  postOptionsButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  questBadgeContainer: {
    marginBottom: 12,
  },
  postContent: {
    marginBottom: 16,
  },
  postText: {
    fontSize: 16,
    color: KlikdBrandSystem.colors.primary.klikd_white,
    lineHeight: 24,
    marginBottom: 12,
    fontFamily: 'Inter',
  },
  postImagePlaceholder: {
    height: 200,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postActionsLeft: {
    flexDirection: 'row',
    gap: 16,
  },
  saveButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  loadMoreContainer: {
    padding: 16,
    alignItems: 'center',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
});
