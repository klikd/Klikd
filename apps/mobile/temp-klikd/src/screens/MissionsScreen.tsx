import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'challenge' | 'brand' | 'social' | 'ar';
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  coinReward: number;
  badge?: string;
  timeLimit?: string;
  participants: number;
  maxParticipants?: number;
  requirements: string[];
  location?: string;
  distance?: number;
  isCompleted: boolean;
  isActive: boolean;
  progress: number;
  createdBy?: string;
  isSponsored: boolean;
}

interface UserStats {
  totalXP: number;
  level: number;
  coins: number;
  streak: number;
  completedMissions: number;
  badges: string[];
  rank: number;
}

const MOCK_USER_STATS: UserStats = {
  totalXP: 2450,
  level: 12,
  coins: 380,
  streak: 7,
  completedMissions: 23,
  badges: ['First Explorer', 'Social Butterfly', 'AR Master'],
  rank: 156,
};

const MOCK_MISSIONS: Mission[] = [
  {
    id: '1',
    title: 'Morning AR Hunt',
    description: 'Find 5 hidden AR objects around downtown before 10 AM',
    type: 'daily',
    difficulty: 'easy',
    xpReward: 50,
    coinReward: 25,
    timeLimit: '3h 45m',
    participants: 12,
    requirements: ['Visit 3 AR zones', 'Scan 5 objects', 'Share 1 memory'],
    location: 'Downtown Riyadh',
    distance: 0.8,
    isCompleted: false,
    isActive: true,
    progress: 60,
    isSponsored: false,
  },
  {
    id: '2',
    title: 'Starbucks AR Experience',
    description: 'Try the new AR coffee filter and share your experience',
    type: 'brand',
    difficulty: 'easy',
    xpReward: 75,
    coinReward: 50,
    badge: 'Coffee Lover',
    participants: 8,
    maxParticipants: 20,
    requirements: ['Visit Starbucks', 'Use AR filter', 'Make purchase'],
    location: 'Kingdom Mall',
    distance: 1.2,
    isCompleted: false,
    isActive: true,
    progress: 0,
    isSponsored: true,
  },
  {
    id: '3',
    title: 'Weekly Explorer Challenge',
    description: 'Complete 10 missions this week to unlock exclusive rewards',
    type: 'weekly',
    difficulty: 'medium',
    xpReward: 200,
    coinReward: 100,
    badge: 'Weekly Champion',
    participants: 156,
    requirements: ['Complete 10 missions', 'Visit 5 different zones', 'Invite 1 friend'],
    isCompleted: false,
    isActive: true,
    progress: 70,
    isSponsored: false,
  },
  {
    id: '4',
    title: 'Friend Collaboration Quest',
    description: 'Team up with friends to solve AR puzzles together',
    type: 'social',
    difficulty: 'medium',
    xpReward: 120,
    coinReward: 60,
    participants: 24,
    requirements: ['Invite 2 friends', 'Complete team challenge', 'Share group photo'],
    location: 'Boulevard City',
    distance: 2.1,
    isCompleted: true,
    isActive: false,
    progress: 100,
    createdBy: 'Sarah',
    isSponsored: false,
  },
];

const MISSION_CATEGORIES = [
  { id: 'all', name: 'All', icon: 'apps', count: 12 },
  { id: 'daily', name: 'Daily', icon: 'today', count: 3 },
  { id: 'weekly', name: 'Weekly', icon: 'calendar', count: 2 },
  { id: 'brand', name: 'Sponsored', icon: 'storefront', count: 4 },
  { id: 'social', name: 'Social', icon: 'people', count: 6 },
  { id: 'ar', name: 'AR', icon: 'camera', count: 8 },
];

export default function MissionsScreen({ navigation }: any) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [showMissionDetails, setShowMissionDetails] = useState(false);
  const [showCreateMission, setShowCreateMission] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const getFilteredMissions = () => {
    if (selectedCategory === 'all') return MOCK_MISSIONS;
    return MOCK_MISSIONS.filter(mission => mission.type === selectedCategory);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#00C851';
      case 'medium': return '#FF8800';
      case 'hard': return '#FF4444';
      default: return '#007AFF';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'daily': return 'today';
      case 'weekly': return 'calendar';
      case 'brand': return 'storefront';
      case 'social': return 'people';
      case 'ar': return 'camera';
      case 'challenge': return 'trophy';
      default: return 'flag';
    }
  };

  const joinMission = (mission: Mission) => {
    setShowMissionDetails(false);
    Alert.alert(
      'Mission Joined!',
      `You've joined "${mission.title}". Check your progress in the missions tab.`,
      [{ text: 'OK' }]
    );
  };

  const renderUserStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statsHeader}>
        <View style={styles.levelContainer}>
          <Text style={styles.levelText}>Level {MOCK_USER_STATS.level}</Text>
          <View style={styles.xpBar}>
            <View style={[styles.xpFill, { width: '65%' }]} />
          </View>
          <Text style={styles.xpText}>{MOCK_USER_STATS.totalXP} XP</Text>
        </View>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Ionicons name="flame" size={20} color="#FF8800" />
            <Text style={styles.statValue}>{MOCK_USER_STATS.streak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="diamond" size={20} color="#FFD700" />
            <Text style={styles.statValue}>{MOCK_USER_STATS.coins}</Text>
            <Text style={styles.statLabel}>Coins</Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="trophy" size={20} color="#007AFF" />
            <Text style={styles.statValue}>#{MOCK_USER_STATS.rank}</Text>
            <Text style={styles.statLabel}>Rank</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderMissionCard = (mission: Mission) => (
    <TouchableOpacity
      key={mission.id}
      style={[
        styles.missionCard,
        mission.isCompleted && styles.completedMissionCard,
        mission.isSponsored && styles.sponsoredMissionCard
      ]}
      onPress={() => {
        setSelectedMission(mission);
        setShowMissionDetails(true);
      }}
    >
      <View style={styles.missionHeader}>
        <View style={styles.missionIconContainer}>
          <Ionicons name={getTypeIcon(mission.type)} size={24} color="white" />
          {mission.isSponsored && (
            <View style={styles.sponsoredBadge}>
              <Ionicons name="star" size={12} color="#FFD700" />
            </View>
          )}
        </View>
        
        <View style={styles.missionInfo}>
          <Text style={styles.missionTitle}>{mission.title}</Text>
          <Text style={styles.missionDescription} numberOfLines={2}>
            {mission.description}
          </Text>
        </View>
        
        <View style={styles.missionMeta}>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(mission.difficulty) }]}>
            <Text style={styles.difficultyText}>{mission.difficulty.toUpperCase()}</Text>
          </View>
          {mission.timeLimit && (
            <Text style={styles.timeLimit}>{mission.timeLimit}</Text>
          )}
        </View>
      </View>

      {mission.progress > 0 && !mission.isCompleted && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${mission.progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{mission.progress}% complete</Text>
        </View>
      )}

      <View style={styles.missionFooter}>
        <View style={styles.rewardContainer}>
          <View style={styles.rewardItem}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rewardText}>{mission.xpReward} XP</Text>
          </View>
          <View style={styles.rewardItem}>
            <Ionicons name="diamond" size={16} color="#007AFF" />
            <Text style={styles.rewardText}>{mission.coinReward} coins</Text>
          </View>
          {mission.badge && (
            <View style={styles.rewardItem}>
              <Ionicons name="medal" size={16} color="#FF8800" />
              <Text style={styles.rewardText}>{mission.badge}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.participantsContainer}>
          <Ionicons name="people" size={16} color="#999" />
          <Text style={styles.participantsText}>
            {mission.participants}{mission.maxParticipants ? `/${mission.maxParticipants}` : ''}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMissionDetails = () => (
    <Modal
      visible={showMissionDetails}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowMissionDetails(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowMissionDetails(false)}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Mission Details</Text>
          <TouchableOpacity>
            <Ionicons name="share" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {selectedMission && (
          <ScrollView style={styles.modalContent}>
            <View style={styles.detailsHeader}>
              <View style={styles.detailsIconContainer}>
                <Ionicons name={getTypeIcon(selectedMission.type)} size={32} color="white" />
              </View>
              <View style={styles.detailsInfo}>
                <Text style={styles.detailsTitle}>{selectedMission.title}</Text>
                <Text style={styles.detailsDescription}>{selectedMission.description}</Text>
              </View>
            </View>

            <View style={styles.detailsStats}>
              <View style={styles.detailsStatItem}>
                <Ionicons name="star" size={20} color="#FFD700" />
                <Text style={styles.detailsStatText}>{selectedMission.xpReward} XP</Text>
              </View>
              <View style={styles.detailsStatItem}>
                <Ionicons name="diamond" size={20} color="#007AFF" />
                <Text style={styles.detailsStatText}>{selectedMission.coinReward} coins</Text>
              </View>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(selectedMission.difficulty) }]}>
                <Text style={styles.difficultyText}>{selectedMission.difficulty.toUpperCase()}</Text>
              </View>
            </View>

            {selectedMission.location && (
              <View style={styles.locationContainer}>
                <Ionicons name="location" size={20} color="#007AFF" />
                <Text style={styles.locationText}>{selectedMission.location}</Text>
                {selectedMission.distance && (
                  <Text style={styles.distanceText}>{selectedMission.distance}km away</Text>
                )}
              </View>
            )}

            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>Requirements:</Text>
              {selectedMission.requirements.map((req, index) => (
                <View key={index} style={styles.requirementItem}>
                  <Ionicons name="checkmark-circle-outline" size={16} color="#999" />
                  <Text style={styles.requirementText}>{req}</Text>
                </View>
              ))}
            </View>

            {selectedMission.createdBy && (
              <View style={styles.creatorContainer}>
                <Text style={styles.creatorLabel}>Created by:</Text>
                <Text style={styles.creatorName}>{selectedMission.createdBy}</Text>
              </View>
            )}

            {!selectedMission.isCompleted && (
              <TouchableOpacity 
                style={styles.joinButton}
                onPress={() => joinMission(selectedMission)}
              >
                <Text style={styles.joinButtonText}>
                  {selectedMission.progress > 0 ? 'Continue Mission' : 'Join Mission'}
                </Text>
                <Ionicons name="arrow-forward" size={24} color="white" />
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Missions</Text>
        <TouchableOpacity onPress={() => setShowLeaderboard(true)}>
          <Ionicons name="trophy" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Stats */}
        {renderUserStats()}

        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {MISSION_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.selectedCategory
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons 
                name={category.icon as any} 
                size={16} 
                color={selectedCategory === category.id ? 'white' : '#999'} 
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.selectedCategoryText
              ]}>
                {category.name} ({category.count})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Missions List */}
        <View style={styles.missionsContainer}>
          <View style={styles.missionsHeader}>
            <Text style={styles.missionsTitle}>Available Missions</Text>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => setShowCreateMission(true)}
            >
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
          </View>

          {getFilteredMissions().map(renderMissionCard)}
        </View>
      </ScrollView>

      {/* Mission Details Modal */}
      {renderMissionDetails()}
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
  statsContainer: {
    margin: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
  },
  statsHeader: {
    gap: 15,
  },
  levelContainer: {
    alignItems: 'center',
    gap: 8,
  },
  levelText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  xpBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  xpText: {
    color: '#999',
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#999',
    fontSize: 12,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: 'white',
  },
  missionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  missionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  missionsTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  createButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  missionCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  completedMissionCard: {
    opacity: 0.7,
    borderColor: '#00C851',
  },
  sponsoredMissionCard: {
    borderColor: '#FFD700',
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  missionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  sponsoredBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  missionInfo: {
    flex: 1,
    marginRight: 12,
  },
  missionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  missionDescription: {
    color: '#999',
    fontSize: 14,
    lineHeight: 18,
  },
  missionMeta: {
    alignItems: 'flex-end',
    gap: 4,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  difficultyText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  timeLimit: {
    color: '#FF8800',
    fontSize: 12,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  progressText: {
    color: '#999',
    fontSize: 12,
  },
  missionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  participantsText: {
    color: '#999',
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailsIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  detailsInfo: {
    flex: 1,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  detailsDescription: {
    fontSize: 14,
    color: '#999',
    lineHeight: 18,
  },
  detailsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
  },
  detailsStatItem: {
    alignItems: 'center',
    gap: 5,
  },
  detailsStatText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
  },
  locationText: {
    flex: 1,
    color: 'white',
    fontSize: 14,
  },
  distanceText: {
    color: '#999',
    fontSize: 12,
  },
  requirementsContainer: {
    marginBottom: 20,
  },
  requirementsTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  requirementText: {
    color: '#ccc',
    fontSize: 14,
  },
  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 30,
  },
  creatorLabel: {
    color: '#999',
    fontSize: 14,
  },
  creatorName: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  joinButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
