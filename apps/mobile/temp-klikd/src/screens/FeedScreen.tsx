import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  ModernKlikdHeader, 
  ModernQuestCard, 
  ModernKlikdButton, 
  ModernKlikdTabBar,
  ModernFloatingButton 
} from '../design/FigmaModernUI';
import { KlikdBrandSystem } from '../design/KlikdBrandSystem';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface FeedScreenProps {
  navigation: any;
}

const STORIES = [
  { id: '1', name: 'Your Story', avatar: '👤', hasStory: false },
  { id: '2', name: 'Sarah', avatar: '👩', hasStory: true },
  { id: '3', name: 'Mike', avatar: '👨', hasStory: true },
  { id: '4', name: 'Emma', avatar: '👱‍♀️', hasStory: true },
  { id: '5', name: 'Alex', avatar: '🧑', hasStory: true },
];

export default function FeedScreen({ navigation }: FeedScreenProps) {
  const [activeRole, setActiveRole] = useState<'general' | 'creator' | 'business'>('general');
  const [activeTab, setActiveTab] = useState('feed');

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case 'camera':
        navigation.navigate('Camera');
        break;
      case 'map':
        navigation.navigate('Map');
        break;
      case 'missions':
        navigation.navigate('Missions');
        break;
      case 'profile':
        navigation.navigate('Profile');
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Modern Klikd Header */}
      <ModernKlikdHeader
        showLogo={true}
        showNotifications={true}
        showProfile={true}
        onNotificationPress={() => console.log('Notifications pressed')}
        onProfilePress={() => navigation.navigate('Profile')}
      />

      {/* Stories */}
      <View style={styles.storiesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesContent}
        >
          {STORIES.map((story) => (
            <TouchableOpacity key={story.id} style={styles.storyItem}>
              <View style={[
                styles.storyAvatar,
                story.hasStory && styles.storyAvatarWithStory
              ]}>
                <Text style={styles.storyAvatarText}>{story.avatar}</Text>
                {!story.hasStory && (
                  <View style={styles.addStoryButton}>
                    <Ionicons name="add" size={16} color="white" />
                  </View>
                )}
              </View>
              <Text style={styles.storyName}>{story.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Feed Content */}
      <ScrollView style={styles.feedContent}>
        {/* Welcome Section with Modern Styling */}
        <View style={styles.modernWelcomeSection}>
          <Text style={styles.modernWelcomeTitle}>Ready to Get Klikd?</Text>
          <Text style={styles.modernWelcomeSubtitle}>🔥 Live quests • 👥 Squad goals • ⚡ Epic rewards</Text>
        </View>

        {/* Featured Quest */}
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>🔥 Trending Quest</Text>
          <ModernQuestCard
            title="Downtown Riyadh AR Hunt"
            description="Discover hidden gems in the heart of Saudi Arabia using AR. Scan landmarks, collect rewards, and compete with your squad!"
            xp={500}
            difficulty="medium"
            participants={127}
            timeLeft="2h 15m"
            category="Exploration"
            onPress={() => navigation.navigate('Missions')}
            onJoin={() => console.log('Joined quest!')}
          />
        </View>

        {/* Active Quests */}
        <View style={styles.questsSection}>
          <Text style={styles.sectionTitle}>⚡ Your Active Quests</Text>
          
          <ModernQuestCard
            title="Coffee Shop Challenge"
            description="Visit 3 local coffee shops and share your experience"
            xp={150}
            difficulty="easy"
            participants={45}
            timeLeft="1d 5h"
            category="Social"
            onPress={() => navigation.navigate('Missions')}
            onJoin={() => console.log('Joined quest!')}
          />
          
          <ModernQuestCard
            title="King Fahd Road Photo Quest"
            description="Capture the perfect sunset shot from King Fahd Road"
            xp={300}
            difficulty="hard"
            participants={89}
            timeLeft="6h 30m"
            category="Photography"
            onPress={() => navigation.navigate('Missions')}
            onJoin={() => console.log('Joined quest!')}
          />
        </View>

        {/* Quick Actions with Modern Buttons */}
        <View style={styles.modernQuickActions}>
          <Text style={styles.sectionTitle}>🚀 Quick Actions</Text>
          
          <View style={styles.actionButtonsRow}>
            <ModernKlikdButton
              title="Start Quest"
              variant="primary"
              icon="flash"
              onPress={() => navigation.navigate('Missions')}
              style={styles.actionButton}
            />
            
            <ModernKlikdButton
              title="Scan Zone"
              variant="cta"
              icon="camera"
              onPress={() => navigation.navigate('Camera')}
              style={styles.actionButton}
            />
          </View>
          
          <View style={styles.actionButtonsRow}>
            <ModernKlikdButton
              title="Explore Map"
              variant="secondary"
              icon="map"
              onPress={() => navigation.navigate('Map')}
              style={styles.actionButton}
            />
            
            <ModernKlikdButton
              title="Squad Up"
              variant="cultural"
              icon="people"
              onPress={() => navigation.navigate('Social')}
              style={styles.actionButton}
            />
          </View>
        </View>

        {/* Modern Role Section */}
        <View style={styles.roleSection}>
          <Text style={styles.roleSectionTitle}>Choose Your Role</Text>
          <View style={styles.roleButtons}>
            <TouchableOpacity 
              style={styles.roleButton}
              onPress={() => navigation.navigate('InfluencerDashboard')}
            >
              <Ionicons name="star" size={24} color="#FFD700" />
              <Text style={styles.roleButtonText}>Creator Dashboard</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.roleButton}
              onPress={() => navigation.navigate('BusinessDashboard')}
            >
              <Ionicons name="business" size={24} color="white" />
              <Text style={styles.roleButtonText}>Business Dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modern Dev Tools */}
        <View style={styles.modernDevTools}>
          <Text style={styles.sectionTitle}>🛠️ Developer Tools</Text>
          <View style={styles.devToolsGrid}>
            <ModernKlikdButton
              title="Validate"
              variant="primary"
              size="small"
              icon="checkmark-circle"
              onPress={() => navigation.navigate('ValidationRunner')}
              style={styles.devToolButton}
            />
            
            <ModernKlikdButton
              title="Design"
              variant="cultural"
              size="small"
              icon="color-palette"
              onPress={() => navigation.navigate('DesignShowcase')}
              style={styles.devToolButton}
            />
            
            <ModernKlikdButton
              title="Recreate"
              variant="cta"
              size="small"
              icon="refresh"
              onPress={() => navigation.navigate('FigmaUIRecreation')}
              style={styles.devToolButton}
            />
            
            <ModernKlikdButton
              title="Brand"
              variant="neon"
              size="small"
              icon="star"
              onPress={() => navigation.navigate('KlikdBrandShowcase')}
              style={styles.devToolButton}
              glowEffect={true}
            />
          </View>
        </View>
      </ScrollView>

      {/* Modern Floating Camera Button */}
      <ModernFloatingButton
        icon="camera"
        variant="camera"
        size={64}
        onPress={() => navigation.navigate('Camera')}
      />
      
      {/* Modern Tab Bar */}
      <ModernKlikdTabBar
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KlikdBrandSystem.colors.ui.dark_bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  
  // Modern Welcome Section
  modernWelcomeSection: {
    paddingVertical: 24,
    paddingHorizontal: 8,
  },
  modernWelcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: KlikdBrandSystem.colors.primary.klikd_white,
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  modernWelcomeSubtitle: {
    fontSize: 16,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    fontFamily: 'Inter',
  },
  
  // Section Titles
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: KlikdBrandSystem.colors.primary.klikd_white,
    marginBottom: 16,
    fontFamily: 'Inter',
  },
  
  // Featured Section
  featuredSection: {
    marginBottom: 32,
  },
  
  // Quests Section
  questsSection: {
    marginBottom: 32,
  },
  
  // Modern Quick Actions
  modernQuickActions: {
    marginBottom: 32,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
  },
  
  // Modern Role Section
  modernRoleSection: {
    marginBottom: 32,
  },
  roleSectionSubtitle: {
    fontSize: 14,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    marginBottom: 20,
    fontFamily: 'Inter',
  },
  modernRoleButtons: {
    gap: 16,
  },
  modernRoleCard: {
    backgroundColor: KlikdBrandSystem.colors.ui.dark_bg,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  roleCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  modernRoleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: KlikdBrandSystem.colors.primary.klikd_white,
    fontFamily: 'Inter',
  },
  modernRoleDescription: {
    fontSize: 14,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    lineHeight: 20,
    fontFamily: 'Inter',
  },
  roleCardBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: KlikdBrandSystem.colors.primary.klikd_green,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleCardBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: KlikdBrandSystem.colors.primary.klikd_black,
    fontFamily: 'Inter',
  },
  
  // Modern Dev Tools
  modernDevTools: {
    marginBottom: 100, // Space for tab bar
  },
  devToolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  devToolButton: {
    flex: 1,
    minWidth: '45%',
  },
  
  // Stories
  storiesContainer: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 15,
  },
  storiesContent: {
    paddingHorizontal: 20,
    gap: 15,
  },
  storyItem: {
    alignItems: 'center',
    gap: 8,
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  storyAvatarWithStory: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  storyAvatarText: {
    fontSize: 24,
  },
  addStoryButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyName: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  feedContent: {
    flex: 1,
    padding: 20,
  },
  roleSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
  },
  roleSectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  roleButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  validationButton: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 10,
  },
  validationButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  devToolsContainer: {
    position: 'absolute',
    top: 100,
    right: 20,
    flexDirection: 'row',
    gap: 8,
    zIndex: 10,
  },
  devButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  devButtonText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
});
