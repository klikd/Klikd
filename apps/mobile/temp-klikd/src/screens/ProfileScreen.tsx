import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  level: number;
  xp: number;
  totalXP: number;
  coins: number;
  streak: number;
  badges: Badge[];
  stats: UserStats;
  preferences: UserPreferences;
  achievements: Achievement[];
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: string;
}

interface UserStats {
  missionsCompleted: number;
  arZonesVisited: number;
  friendsInvited: number;
  totalDistance: number;
  timeSpent: number;
  contentCreated: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  reward: string;
  isCompleted: boolean;
}

interface UserPreferences {
  notifications: boolean;
  locationSharing: boolean;
  publicProfile: boolean;
  showOnlineStatus: boolean;
  culturalFilters: boolean;
  language: 'ar' | 'en';
  theme: 'dark' | 'light' | 'auto';
}

const MOCK_USER: UserProfile = {
  id: '1',
  name: 'Mohammed Al-Saud',
  username: '@mohammed_explorer',
  avatar: '👨🏻‍💼',
  bio: 'AR Explorer | Riyadh Native | Level 15 Adventurer 🎯',
  level: 15,
  xp: 2450,
  totalXP: 15750,
  coins: 380,
  streak: 12,
  badges: [
    {
      id: '1',
      name: 'First Explorer',
      icon: '🎯',
      description: 'Completed your first mission',
      rarity: 'common',
      earnedAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Social Butterfly',
      icon: '🦋',
      description: 'Invited 10 friends to Klikd',
      rarity: 'rare',
      earnedAt: '2024-02-01',
    },
    {
      id: '3',
      name: 'AR Master',
      icon: '🔮',
      description: 'Completed 50 AR missions',
      rarity: 'epic',
      earnedAt: '2024-02-20',
    },
  ],
  stats: {
    missionsCompleted: 127,
    arZonesVisited: 45,
    friendsInvited: 18,
    totalDistance: 89.5,
    timeSpent: 156,
    contentCreated: 23,
  },
  preferences: {
    notifications: true,
    locationSharing: true,
    publicProfile: true,
    showOnlineStatus: true,
    culturalFilters: true,
    language: 'en',
    theme: 'dark',
  },
  achievements: [
    {
      id: '1',
      title: 'Mission Master',
      description: 'Complete 150 missions',
      progress: 127,
      maxProgress: 150,
      reward: '500 XP + Exclusive Badge',
      isCompleted: false,
    },
    {
      id: '2',
      title: 'City Explorer',
      description: 'Visit 50 different AR zones',
      progress: 45,
      maxProgress: 50,
      reward: '300 XP + City Badge',
      isCompleted: false,
    },
  ],
};

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState(MOCK_USER);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'stats' | 'achievements'>('overview');

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#999';
      case 'rare': return '#007AFF';
      case 'epic': return '#9C27B0';
      case 'legendary': return '#FFD700';
      default: return '#999';
    }
  };

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.avatarSection}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{user.avatar}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{user.level}</Text>
          </View>
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userHandle}>{user.username}</Text>
          <Text style={styles.userBio}>{user.bio}</Text>
        </View>

        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setShowEditProfile(true)}
        >
          <Ionicons name="create" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.xpSection}>
        <View style={styles.xpBar}>
          <View style={[styles.xpFill, { width: `${(user.xp / 3000) * 100}%` }]} />
        </View>
        <Text style={styles.xpText}>{user.xp} / 3000 XP to Level {user.level + 1}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.coins}</Text>
          <Text style={styles.statLabel}>Coins</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.badges.length}</Text>
          <Text style={styles.statLabel}>Badges</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.stats.missionsCompleted}</Text>
          <Text style={styles.statLabel}>Missions</Text>
        </View>
      </View>
    </View>
  );

  const renderOverview = () => (
    <View style={styles.overviewContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Badges</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgesScroll}>
          {user.badges.slice(0, 5).map((badge) => (
            <View key={badge.id} style={styles.badgeCard}>
              <Text style={styles.badgeIcon}>{badge.icon}</Text>
              <Text style={styles.badgeName}>{badge.name}</Text>
              <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(badge.rarity) }]}>
                <Text style={styles.rarityText}>{badge.rarity.toUpperCase()}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <View style={styles.quickStats}>
          <View style={styles.quickStatItem}>
            <Ionicons name="location" size={20} color="#007AFF" />
            <Text style={styles.quickStatText}>{user.stats.arZonesVisited} zones visited</Text>
          </View>
          <View style={styles.quickStatItem}>
            <Ionicons name="walk" size={20} color="#00C851" />
            <Text style={styles.quickStatText}>{user.stats.totalDistance}km traveled</Text>
          </View>
          <View style={styles.quickStatItem}>
            <Ionicons name="people" size={20} color="#FF8800" />
            <Text style={styles.quickStatText}>{user.stats.friendsInvited} friends invited</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Achievements</Text>
        {user.achievements.filter(a => !a.isCompleted).map((achievement) => (
          <View key={achievement.id} style={styles.achievementCard}>
            <View style={styles.achievementHeader}>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementProgress}>
                {achievement.progress}/{achievement.maxProgress}
              </Text>
            </View>
            <Text style={styles.achievementDescription}>{achievement.description}</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(achievement.progress / achievement.maxProgress) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.achievementReward}>Reward: {achievement.reward}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderBadges = () => (
    <View style={styles.badgesGrid}>
      {user.badges.map((badge) => (
        <View key={badge.id} style={styles.badgeDetailCard}>
          <Text style={styles.badgeDetailIcon}>{badge.icon}</Text>
          <Text style={styles.badgeDetailName}>{badge.name}</Text>
          <Text style={styles.badgeDetailDescription}>{badge.description}</Text>
          <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(badge.rarity) }]}>
            <Text style={styles.rarityText}>{badge.rarity.toUpperCase()}</Text>
          </View>
          <Text style={styles.badgeEarnedDate}>Earned {badge.earnedAt}</Text>
        </View>
      ))}
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsContent}>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={32} color="#00C851" />
          <Text style={styles.statCardValue}>{user.stats.missionsCompleted}</Text>
          <Text style={styles.statCardLabel}>Missions Completed</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="location" size={32} color="#007AFF" />
          <Text style={styles.statCardValue}>{user.stats.arZonesVisited}</Text>
          <Text style={styles.statCardLabel}>AR Zones Visited</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="walk" size={32} color="#FF8800" />
          <Text style={styles.statCardValue}>{user.stats.totalDistance}km</Text>
          <Text style={styles.statCardLabel}>Distance Traveled</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="time" size={32} color="#9C27B0" />
          <Text style={styles.statCardValue}>{user.stats.timeSpent}h</Text>
          <Text style={styles.statCardLabel}>Time Spent</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="create" size={32} color="#FFD700" />
          <Text style={styles.statCardValue}>{user.stats.contentCreated}</Text>
          <Text style={styles.statCardLabel}>Content Created</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="people" size={32} color="#FF6B6B" />
          <Text style={styles.statCardValue}>{user.stats.friendsInvited}</Text>
          <Text style={styles.statCardLabel}>Friends Invited</Text>
        </View>
      </View>
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.achievementsContent}>
      {user.achievements.map((achievement) => (
        <View key={achievement.id} style={styles.achievementDetailCard}>
          <View style={styles.achievementDetailHeader}>
            <Text style={styles.achievementDetailTitle}>{achievement.title}</Text>
            <Text style={styles.achievementDetailProgress}>
              {achievement.progress}/{achievement.maxProgress}
            </Text>
          </View>
          <Text style={styles.achievementDetailDescription}>{achievement.description}</Text>
          <View style={styles.progressBarLarge}>
            <View 
              style={[
                styles.progressFillLarge, 
                { width: `${(achievement.progress / achievement.maxProgress) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.achievementDetailReward}>🎁 {achievement.reward}</Text>
          {achievement.isCompleted && (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#00C851" />
              <Text style={styles.completedText}>Completed</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'badges': return renderBadges();
      case 'stats': return renderStats();
      case 'achievements': return renderAchievements();
      default: return renderOverview();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => setShowSettings(true)}>
          <Ionicons name="settings" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        {renderProfileHeader()}

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'badges', label: 'Badges' },
            { key: 'stats', label: 'Stats' },
            { key: 'achievements', label: 'Goals' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key as any)}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    padding: 20,
    backgroundColor: '#1a1a1a',
    marginBottom: 20,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 48,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  levelText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userHandle: {
    color: '#007AFF',
    fontSize: 16,
    marginBottom: 8,
  },
  userBio: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 18,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  xpSection: {
    marginBottom: 20,
  },
  xpBar: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    marginBottom: 8,
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  xpText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#999',
    fontSize: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    marginRight: 8,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: 'white',
  },
  overviewContent: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  badgesScroll: {
    marginBottom: 8,
  },
  badgeCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  badgeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  badgeName: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  rarityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  rarityText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  quickStats: {
    gap: 12,
  },
  quickStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quickStatText: {
    color: '#ccc',
    fontSize: 14,
  },
  achievementCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementProgress: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  achievementDescription: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  achievementReward: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  badgesGrid: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeDetailCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '47%',
  },
  badgeDetailIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  badgeDetailName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  badgeDetailDescription: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
  },
  badgeEarnedDate: {
    color: '#999',
    fontSize: 10,
    marginTop: 8,
  },
  statsContent: {
    paddingHorizontal: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: '47%',
  },
  statCardValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  statCardLabel: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
  },
  achievementsContent: {
    paddingHorizontal: 20,
  },
  achievementDetailCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  achievementDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementDetailTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementDetailProgress: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementDetailDescription: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 16,
  },
  progressBarLarge: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFillLarge: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  achievementDetailReward: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  completedText: {
    color: '#00C851',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
