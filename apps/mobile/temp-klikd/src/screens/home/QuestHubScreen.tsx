// 2.2 Quest Hub Screen - Browse and filter all available quests
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, TextInput } from 'react-native';
import { KlikdScreenContainer, KlikdCard, KlikdBadge, KlikdList } from '../../components/KlikdScalableComponents';
import { ModernKlikdButton, ModernQuestCard } from '../../design/FigmaModernUI';
import { KlikdBrandSystem } from '../../design/KlikdBrandSystem';
import { Ionicons } from '@expo/vector-icons';

interface QuestHubScreenProps {
  navigation: any;
}

const QuestHubScreen: React.FC<QuestHubScreenProps> = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const filters = [
    { id: 'all', label: 'All Quests', count: 156 },
    { id: 'discovery', label: 'Discovery', count: 45 },
    { id: 'content', label: 'Content', count: 32 },
    { id: 'adventure', label: 'Adventure', count: 28 },
    { id: 'social', label: 'Social', count: 23 },
    { id: 'brand', label: 'Brand', count: 18 },
    { id: 'daily', label: 'Daily', count: 10 },
  ];

  const sortOptions = [
    { id: 'newest', label: 'Newest First' },
    { id: 'reward', label: 'Highest Reward' },
    { id: 'difficulty', label: 'Easiest First' },
    { id: 'popular', label: 'Most Popular' },
    { id: 'ending', label: 'Ending Soon' },
  ];

  const mockQuests = [
    {
      id: '1',
      title: 'Coffee Shop AR Hunt',
      description: 'Find 3 hidden AR treasures at local coffee shops in Riyadh',
      reward: '50 coins + Rare Badge',
      difficulty: 'Easy',
      timeLeft: '2h 30m',
      progress: 0,
      location: 'Riyadh City Center',
      category: 'Discovery',
      participants: 234,
      image: null,
      featured: true,
    },
    {
      id: '2',
      title: 'Fashion Brand Challenge',
      description: 'Create engaging content featuring the new summer collection',
      reward: '200 coins + Brand Partnership',
      difficulty: 'Medium',
      timeLeft: '1d 5h',
      progress: 0,
      location: 'Mall of Arabia',
      category: 'Content',
      participants: 89,
      image: null,
      featured: false,
    },
    {
      id: '3',
      title: 'Weekend Explorer',
      description: 'Visit 5 different neighborhoods and scan landmarks',
      reward: '100 coins + Explorer Badge',
      difficulty: 'Hard',
      timeLeft: '3d 12h',
      progress: 0,
      location: 'Multiple Locations',
      category: 'Adventure',
      participants: 156,
      image: null,
      featured: false,
    },
    {
      id: '4',
      title: 'Social Media Boost',
      description: 'Share your Klikd experience on social media',
      reward: '25 coins + Social Badge',
      difficulty: 'Easy',
      timeLeft: '12h',
      progress: 0,
      location: 'Anywhere',
      category: 'Social',
      participants: 67,
      image: null,
      featured: false,
    },
    {
      id: '5',
      title: 'Restaurant Review Quest',
      description: 'Visit and review 3 partner restaurants',
      reward: '75 coins + Foodie Badge',
      difficulty: 'Medium',
      timeLeft: '2d 8h',
      progress: 0,
      location: 'Jeddah',
      category: 'Discovery',
      participants: 123,
      image: null,
      featured: true,
    },
  ];

  const filteredQuests = mockQuests.filter(quest => {
    const matchesFilter = activeFilter === 'all' || quest.category.toLowerCase() === activeFilter;
    const matchesSearch = quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quest.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <KlikdScreenContainer 
      showHeader={true}
      headerTitle="Quest Hub"
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={KlikdBrandSystem.colors.ui.soft_gray} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search quests..."
              placeholderTextColor={KlikdBrandSystem.colors.ui.soft_gray}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Ionicons 
                name="close-circle" 
                size={20} 
                color={KlikdBrandSystem.colors.ui.soft_gray}
                onPress={() => setSearchQuery('')}
              />
            )}
          </View>
          
          <ModernKlikdButton
            title=""
            variant="icon"
            size="medium"
            icon="options"
            onPress={() => {/* Open sort/filter modal */}}
            style={styles.filterButton}
          />
        </View>

        {/* Filter Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map((filter) => (
            <ModernKlikdButton
              key={filter.id}
              title={`${filter.label} (${filter.count})`}
              variant={activeFilter === filter.id ? 'primary' : 'secondary'}
              size="small"
              onPress={() => setActiveFilter(filter.id)}
              style={[
                styles.filterChip,
                activeFilter === filter.id && styles.activeFilterChip
              ]}
            />
          ))}
        </ScrollView>

        {/* Quest Stats */}
        <View style={styles.statsContainer}>
          <KlikdCard variant="outlined" style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{filteredQuests.length}</Text>
                <Text style={styles.statLabel}>Available</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {filteredQuests.filter(q => q.featured).length}
                </Text>
                <Text style={styles.statLabel}>Featured</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {filteredQuests.reduce((sum, q) => sum + q.participants, 0)}
                </Text>
                <Text style={styles.statLabel}>Participants</Text>
              </View>
            </View>
          </KlikdCard>
        </View>

        {/* Sort Options */}
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.sortOptions}>
              {sortOptions.map((option) => (
                <KlikdBadge
                  key={option.id}
                  text={option.label}
                  variant={sortBy === option.id ? 'premium' : 'info'}
                  size="small"
                />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Featured Quests Section */}
        {filteredQuests.some(q => q.featured) && (
          <View style={styles.featuredSection}>
            <Text style={styles.sectionTitle}>🌟 Featured Quests</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.featuredQuests}>
                {filteredQuests.filter(q => q.featured).map((quest) => (
                  <ModernQuestCard
                    key={quest.id}
                    quest={quest}
                    onPress={() => navigation.navigate('QuestDetails', { questId: quest.id })}
                    style={styles.featuredQuestCard}
                    variant="featured"
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* All Quests List */}
        <View style={styles.questsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeFilter === 'all' ? 'All Quests' : filters.find(f => f.id === activeFilter)?.label}
            </Text>
            <Text style={styles.questCount}>
              {filteredQuests.length} quest{filteredQuests.length !== 1 ? 's' : ''}
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredQuests.map((quest) => (
              <ModernQuestCard
                key={quest.id}
                quest={quest}
                onPress={() => navigation.navigate('QuestDetails', { questId: quest.id })}
                style={styles.questCard}
              />
            ))}
            
            {filteredQuests.length === 0 && (
              <KlikdCard style={styles.emptyState}>
                <View style={styles.emptyStateContent}>
                  <Ionicons 
                    name="search" 
                    size={48} 
                    color={KlikdBrandSystem.colors.ui.soft_gray} 
                  />
                  <Text style={styles.emptyStateTitle}>No quests found</Text>
                  <Text style={styles.emptyStateDescription}>
                    Try adjusting your search or filter criteria
                  </Text>
                  <ModernKlikdButton
                    title="Clear Filters"
                    variant="secondary"
                    size="medium"
                    onPress={() => {
                      setActiveFilter('all');
                      setSearchQuery('');
                    }}
                    style={styles.clearFiltersButton}
                  />
                </View>
              </KlikdCard>
            )}
          </ScrollView>
        </View>

        {/* Quick Actions FAB */}
        <View style={styles.fabContainer}>
          <ModernKlikdButton
            title=""
            variant="primary"
            size="large"
            icon="add"
            onPress={() => navigation.navigate('CreateQuest')}
            style={styles.fab}
          />
        </View>
      </Animated.View>
    </KlikdScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: 'white',
    fontFamily: 'Inter',
  },
  filterButton: {
    width: 48,
    height: 48,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  activeFilterChip: {
    borderWidth: 2,
    borderColor: KlikdBrandSystem.colors.primary.klikd_green,
  },
  statsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statsCard: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: KlikdBrandSystem.colors.primary.klikd_white,
    fontFamily: 'Inter',
  },
  statLabel: {
    fontSize: 12,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    marginTop: 4,
    fontFamily: 'Inter',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#333',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  sortLabel: {
    fontSize: 14,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    fontFamily: 'Inter',
  },
  sortOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  featuredSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: KlikdBrandSystem.colors.primary.klikd_white,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontFamily: 'Inter',
  },
  featuredQuests: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 16,
  },
  featuredQuestCard: {
    width: 280,
  },
  questsSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  questCount: {
    fontSize: 14,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    fontFamily: 'Inter',
  },
  questCard: {
    marginBottom: 16,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateContent: {
    alignItems: 'center',
    gap: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: KlikdBrandSystem.colors.primary.klikd_white,
    fontFamily: 'Inter',
  },
  emptyStateDescription: {
    fontSize: 14,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  clearFiltersButton: {
    marginTop: 8,
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
