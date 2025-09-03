// 2.1 Home Screen - Main dashboard with quest feed and quick actions
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, RefreshControl } from 'react-native';
import { KlikdScreenContainer, KlikdCard, KlikdBadge, KlikdAvatar, KlikdProgress } from '../../components/KlikdScalableComponents';
import { ModernKlikdButton, ModernQuestCard } from '../../design/FigmaModernUI';
import { KlikdBrandSystem } from '../../design/KlikdBrandSystem';
import { Ionicons } from '@expo/vector-icons';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [userStats, setUserStats] = useState({
    level: 12,
    xp: 2450,
    xpToNext: 3000,
    coins: 1250,
    completedQuests: 47,
    streak: 5,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const mockQuests = [
    {
      id: '1',
      title: 'Coffee Shop AR Hunt',
      description: 'Find 3 hidden AR treasures at local coffee shops',
      reward: '50 coins + Rare Badge',
      difficulty: 'Easy',
      timeLeft: '2h 30m',
      progress: 0.6,
      location: 'Riyadh City Center',
      category: 'Discovery',
      participants: 234,
      image: null,
    },
    {
      id: '2',
      title: 'Fashion Brand Challenge',
      description: 'Create content featuring new summer collection',
      reward: '200 coins + Brand Partnership',
      difficulty: 'Medium',
      timeLeft: '1d 5h',
      progress: 0.3,
      location: 'Mall of Arabia',
      category: 'Content',
      participants: 89,
      image: null,
    },
    {
      id: '3',
      title: 'Weekend Explorer',
      description: 'Visit 5 different neighborhoods and scan landmarks',
      reward: '100 coins + Explorer Badge',
      difficulty: 'Hard',
      timeLeft: '3d 12h',
      progress: 0.8,
      location: 'Multiple Locations',
      category: 'Adventure',
      participants: 156,
      image: null,
    },
  ];

  const quickActions = [
    { id: 'scan', title: 'Scan AR', icon: 'scan', color: KlikdBrandSystem.colors.primary.klikd_green },
    { id: 'map', title: 'Quest Map', icon: 'map', color: '#4CAF50' },
    { id: 'friends', title: 'Friends', icon: 'people', color: '#2196F3' },
    { id: 'rewards', title: 'Rewards', icon: 'gift', color: '#FF9800' },
  ];

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'scan':
        navigation.navigate('Camera');
        break;
      case 'map':
        navigation.navigate('QuestMap');
        break;
      case 'friends':
        navigation.navigate('Social');
        break;
      case 'rewards':
        navigation.navigate('Rewards');
        break;
    }
  };

  return (
    <KlikdScreenContainer>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <KlikdAvatar 
                size={48} 
                initials="MK" 
                online={true}
                tier="premium"
                onPress={() => navigation.navigate('Profile')}
              />
              <View style={styles.headerInfo}>
                <Text style={styles.welcomeText}>Welcome back!</Text>
                <Text style={styles.userName}>Mohammed K.</Text>
              </View>
            </View>
            
            <View style={styles.headerRight}>
              <ModernKlikdButton
                title=""
                variant="icon"
                size="small"
                icon="notifications"
                onPress={() => navigation.navigate('Notifications')}
                style={styles.notificationButton}
              />
              <ModernKlikdButton
                title=""
                variant="icon"
                size="small"
                icon="search"
                onPress={() => navigation.navigate('Search')}
                style={styles.searchButton}
              />
            </View>
          </View>

          {/* User Stats Card */}
          <KlikdCard variant="elevated" style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <Text style={styles.statsTitle}>Your Progress</Text>
              <KlikdBadge text={`Level ${userStats.level}`} variant="premium" />
            </View>
            
            <View style={styles.statsContent}>
              <View style={styles.xpSection}>
                <Text style={styles.xpText}>
                  {userStats.xp.toLocaleString()} / {userStats.xpToNext.toLocaleString()} XP
                </Text>
                <KlikdProgress 
                  progress={userStats.xp / userStats.xpToNext} 
                  height={8}
                  animated={true}
                />
              </View>
              
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Ionicons name="diamond" size={20} color={KlikdBrandSystem.colors.primary.klikd_green} />
                  <Text style={styles.statValue}>{userStats.coins}</Text>
                  <Text style={styles.statLabel}>Coins</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <Text style={styles.statValue}>{userStats.completedQuests}</Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="flame" size={20} color="#FF9800" />
                  <Text style={styles.statValue}>{userStats.streak}</Text>
                  <Text style={styles.statLabel}>Day Streak</Text>
                </View>
              </View>
            </View>
          </KlikdCard>

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action) => (
                <ModernKlikdButton
                  key={action.id}
                  title={action.title}
                  variant="secondary"
                  size="medium"
                  icon={action.icon}
                  onPress={() => handleQuickAction(action.id)}
                  style={[styles.quickActionButton, { borderColor: action.color }]}
                />
              ))}
            </View>
          </View>

          {/* Featured Quests */}
          <View style={styles.questsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Quests</Text>
              <ModernKlikdButton
                title="View All"
                variant="text"
                size="small"
                onPress={() => navigation.navigate('QuestHub')}
              />
            </View>
            
            {mockQuests.map((quest) => (
              <ModernQuestCard
                key={quest.id}
                quest={quest}
                onPress={() => navigation.navigate('QuestDetails', { questId: quest.id })}
                style={styles.questCard}
              />
            ))}
          </View>

          {/* Daily Challenge */}
          <KlikdCard variant="quest" style={styles.dailyChallengeCard}>
            <View style={styles.dailyChallengeHeader}>
              <Ionicons name="calendar" size={24} color={KlikdBrandSystem.colors.primary.klikd_green} />
              <Text style={styles.dailyChallengeTitle}>Daily Challenge</Text>
              <KlikdBadge text="24h left" variant="warning" size="small" />
            </View>
            
            <Text style={styles.dailyChallengeDescription}>
              Complete 3 AR scans at different locations to earn bonus XP and coins!
            </Text>
            
            <View style={styles.dailyChallengeProgress}>
              <Text style={styles.progressLabel}>Progress: 1/3 completed</Text>
              <KlikdProgress progress={0.33} height={6} />
            </View>
            
            <ModernKlikdButton
              title="Start Challenge"
              variant="primary"
              size="medium"
              icon="play"
              onPress={() => navigation.navigate('Camera')}
              style={styles.challengeButton}
            />
          </KlikdCard>

          {/* Trending Section */}
          <View style={styles.trendingSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Trending Now</Text>
              <ModernKlikdButton
                title="See More"
                variant="text"
                size="small"
                onPress={() => navigation.navigate('Trending')}
              />
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.trendingItems}>
                {['#ARHunt', '#CoffeeQuest', '#WeekendChallenge'].map((tag, index) => (
                  <KlikdBadge 
                    key={index}
                    text={tag}
                    variant="info"
                    size="medium"
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        </Animated.View>
      </ScrollView>
    </KlikdScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 44,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerInfo: {
    marginLeft: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    fontFamily: 'Inter',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: KlikdBrandSystem.colors.primary.klikd_white,
    fontFamily: 'Inter',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  notificationButton: {
    width: 40,
    height: 40,
  },
  searchButton: {
    width: 40,
    height: 40,
  },
  statsCard: {
    marginBottom: 24,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: KlikdBrandSystem.colors.primary.klikd_white,
    fontFamily: 'Inter',
  },
  statsContent: {
    gap: 16,
  },
  xpSection: {
    gap: 8,
  },
  xpText: {
    fontSize: 14,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    fontFamily: 'Inter',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: KlikdBrandSystem.colors.primary.klikd_white,
    fontFamily: 'Inter',
  },
  statLabel: {
    fontSize: 12,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    fontFamily: 'Inter',
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: KlikdBrandSystem.colors.primary.klikd_white,
    marginBottom: 16,
    fontFamily: 'Inter',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    minWidth: '45%',
  },
  questsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  questCard: {
    marginBottom: 16,
  },
  dailyChallengeCard: {
    marginBottom: 24,
    backgroundColor: 'rgba(236, 255, 0, 0.05)',
  },
  dailyChallengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  dailyChallengeTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: KlikdBrandSystem.colors.primary.klikd_white,
    fontFamily: 'Inter',
  },
  dailyChallengeDescription: {
    fontSize: 14,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    lineHeight: 20,
    marginBottom: 16,
    fontFamily: 'Inter',
  },
  dailyChallengeProgress: {
    marginBottom: 16,
    gap: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    fontFamily: 'Inter',
  },
  challengeButton: {
    alignSelf: 'flex-start',
  },
  trendingSection: {
    marginBottom: 24,
  },
  trendingItems: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
  },
});
