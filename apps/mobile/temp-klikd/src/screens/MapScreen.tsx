import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MapScreenProps {
  navigation: any;
}

interface ARZone {
  id: string;
  name: string;
  type: 'mission' | 'brand' | 'social' | 'event';
  latitude: number;
  longitude: number;
  distance: number;
  participants: number;
  reward: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeRemaining?: string;
  isActive: boolean;
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  latitude: number;
  longitude: number;
  currentMission?: string;
  isOnline: boolean;
}

const MOCK_AR_ZONES: ARZone[] = [
  {
    id: '1',
    name: 'Downtown AR Hunt',
    type: 'mission',
    latitude: 24.7136,
    longitude: 46.6753,
    distance: 0.2,
    participants: 12,
    reward: '50 XP + Badge',
    difficulty: 'easy',
    timeRemaining: '2h 15m',
    isActive: true,
  },
  {
    id: '2',
    name: 'Starbucks AR Experience',
    type: 'brand',
    latitude: 24.7156,
    longitude: 46.6773,
    distance: 0.5,
    participants: 8,
    reward: '30% Discount',
    difficulty: 'easy',
    isActive: true,
  },
  {
    id: '3',
    name: 'Kingdom Tower Challenge',
    type: 'event',
    latitude: 24.7116,
    longitude: 46.6743,
    distance: 1.2,
    participants: 45,
    reward: '200 XP + Rare Badge',
    difficulty: 'hard',
    timeRemaining: '45m',
    isActive: true,
  },
];

const MOCK_FRIENDS: Friend[] = [
  {
    id: '1',
    name: 'Sarah',
    avatar: '👩',
    latitude: 24.7146,
    longitude: 46.6763,
    currentMission: 'Downtown AR Hunt',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Ahmed',
    avatar: '👨',
    latitude: 24.7126,
    longitude: 46.6783,
    isOnline: false,
  },
];

const MAP_FILTERS = [
  { id: 'all', name: 'All', icon: 'apps' },
  { id: 'missions', name: 'Missions', icon: 'flag' },
  { id: 'brands', name: 'Brands', icon: 'storefront' },
  { id: 'friends', name: 'Friends', icon: 'people' },
  { id: 'events', name: 'Events', icon: 'calendar' },
];

export default function MapScreen({ navigation }: MapScreenProps) {
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedZone, setSelectedZone] = useState<ARZone | null>(null);
  const [showZoneDetails, setShowZoneDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapMode, setMapMode] = useState<'standard' | 'radar' | 'heatmap'>('standard');
  const [showFriends, setShowFriends] = useState(true);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for AR experiences');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const getFilteredZones = () => {
    let zones = MOCK_AR_ZONES;
    
    if (selectedFilter !== 'all') {
      zones = zones.filter(zone => {
        switch (selectedFilter) {
          case 'missions': return zone.type === 'mission';
          case 'brands': return zone.type === 'brand';
          case 'events': return zone.type === 'event';
          default: return true;
        }
      });
    }

    if (searchQuery) {
      zones = zones.filter(zone => 
        zone.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return zones;
  };

  const handleZonePress = (zone: ARZone) => {
    setSelectedZone(zone);
    setShowZoneDetails(true);
  };

  const joinMission = (zone: ARZone) => {
    setShowZoneDetails(false);
    Alert.alert(
      'Mission Joined!',
      `You've joined "${zone.name}". Navigate to the location to begin.`,
      [
        { text: 'Navigate', onPress: () => navigation.navigate('Navigation', { zone }) },
        { text: 'OK' }
      ]
    );
  };

  const getZoneIcon = (type: string) => {
    switch (type) {
      case 'mission': return 'flag';
      case 'brand': return 'storefront';
      case 'event': return 'calendar';
      case 'social': return 'people';
      default: return 'location';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#00C851';
      case 'medium': return '#FF8800';
      case 'hard': return '#FF4444';
      default: return '#007AFF';
    }
  };

  const renderMapView = () => (
    <View style={styles.mapContainer}>
      {/* Mock Map Background */}
      <View style={styles.mockMap}>
        <Text style={styles.mapPlaceholder}>
          {mapMode === 'radar' ? '📡 Radar View' : 
           mapMode === 'heatmap' ? '🔥 Activity Heatmap' : '🗺️ Map View'}
        </Text>
        
        {/* AR Zones */}
        {getFilteredZones().map((zone, index) => (
          <TouchableOpacity
            key={zone.id}
            style={[
              styles.zoneMarker,
              { 
                top: 100 + (index * 80),
                left: 50 + (index * 60),
                backgroundColor: zone.isActive ? '#007AFF' : '#666'
              }
            ]}
            onPress={() => handleZonePress(zone)}
          >
            <Ionicons name={getZoneIcon(zone.type)} size={20} color="white" />
            {zone.timeRemaining && (
              <View style={styles.timerBadge}>
                <Text style={styles.timerText}>{zone.timeRemaining}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Friends */}
        {showFriends && MOCK_FRIENDS.map((friend, index) => (
          <TouchableOpacity
            key={friend.id}
            style={[
              styles.friendMarker,
              { 
                top: 150 + (index * 100),
                right: 80 + (index * 40),
                opacity: friend.isOnline ? 1 : 0.6
              }
            ]}
          >
            <Text style={styles.friendAvatar}>{friend.avatar}</Text>
            {friend.isOnline && <View style={styles.onlineIndicator} />}
          </TouchableOpacity>
        ))}

        {/* User Location */}
        <View style={styles.userLocation}>
          <Ionicons name="radio-button-on" size={24} color="#007AFF" />
        </View>
      </View>

      {/* Map Controls */}
      <View style={styles.mapControls}>
        <TouchableOpacity 
          style={styles.mapControlButton}
          onPress={() => setMapMode(mapMode === 'standard' ? 'radar' : mapMode === 'radar' ? 'heatmap' : 'standard')}
        >
          <Ionicons name="layers" size={24} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.mapControlButton}
          onPress={() => setShowFriends(!showFriends)}
        >
          <Ionicons name="people" size={24} color={showFriends ? '#007AFF' : 'white'} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.mapControlButton}
          onPress={getCurrentLocation}
        >
          <Ionicons name="locate" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderZoneDetails = () => (
    <Modal
      visible={showZoneDetails}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowZoneDetails(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowZoneDetails(false)}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Mission Details</Text>
          <View style={{ width: 28 }} />
        </View>

        {selectedZone && (
          <ScrollView style={styles.modalContent}>
            <View style={styles.zoneHeader}>
              <View style={styles.zoneIconContainer}>
                <Ionicons name={getZoneIcon(selectedZone.type)} size={32} color="white" />
              </View>
              <View style={styles.zoneInfo}>
                <Text style={styles.zoneName}>{selectedZone.name}</Text>
                <Text style={styles.zoneDistance}>{selectedZone.distance}km away</Text>
              </View>
            </View>

            <View style={styles.zoneStats}>
              <View style={styles.statItem}>
                <Ionicons name="people" size={20} color="#007AFF" />
                <Text style={styles.statText}>{selectedZone.participants} joined</Text>
              </View>
              
              <View style={styles.statItem}>
                <Ionicons name="trophy" size={20} color="#FFD700" />
                <Text style={styles.statText}>{selectedZone.reward}</Text>
              </View>
              
              <View style={styles.statItem}>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(selectedZone.difficulty) }]}>
                  <Text style={styles.difficultyText}>{selectedZone.difficulty.toUpperCase()}</Text>
                </View>
              </View>
            </View>

            {selectedZone.timeRemaining && (
              <View style={styles.timerContainer}>
                <Ionicons name="time" size={20} color="#FF8800" />
                <Text style={styles.timerLabel}>Time remaining: {selectedZone.timeRemaining}</Text>
              </View>
            )}

            <Text style={styles.zoneDescription}>
              Join this AR experience to explore, collect items, and earn rewards. 
              Complete challenges and interact with other participants in real-time.
            </Text>

            <View style={styles.participantsList}>
              <Text style={styles.participantsTitle}>Recent Participants</Text>
              {MOCK_FRIENDS.slice(0, 3).map((friend) => (
                <View key={friend.id} style={styles.participantItem}>
                  <Text style={styles.participantAvatar}>{friend.avatar}</Text>
                  <Text style={styles.participantName}>{friend.name}</Text>
                  <Text style={styles.participantStatus}>
                    {friend.currentMission === selectedZone.name ? 'Active' : 'Completed'}
                  </Text>
                </View>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.joinButton}
              onPress={() => joinMission(selectedZone)}
            >
              <Text style={styles.joinButtonText}>Join Mission</Text>
              <Ionicons name="arrow-forward" size={24} color="white" />
            </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Explore</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-circle" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search locations, brands, or missions"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {MAP_FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              selectedFilter === filter.id && styles.selectedFilter
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Ionicons 
              name={filter.icon as any} 
              size={16} 
              color={selectedFilter === filter.id ? 'white' : '#999'} 
            />
            <Text style={[
              styles.filterText,
              selectedFilter === filter.id && styles.selectedFilterText
            ]}>
              {filter.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Map */}
      {renderMapView()}

      {/* Zone Details Modal */}
      {renderZoneDetails()}

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('Camera')}
      >
        <Ionicons name="camera" size={28} color="white" />
      </TouchableOpacity>
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  filtersContainer: {
    marginBottom: 15,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  selectedFilter: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedFilterText: {
    color: 'white',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mockMap: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    margin: 20,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapPlaceholder: {
    color: '#666',
    fontSize: 18,
    fontWeight: '600',
  },
  zoneMarker: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  timerBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF8800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  timerText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  friendMarker: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  friendAvatar: {
    fontSize: 16,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00C851',
    borderWidth: 2,
    borderColor: '#000',
  },
  userLocation: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  mapControls: {
    position: 'absolute',
    top: 20,
    right: 20,
    gap: 10,
  },
  mapControlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  zoneIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  zoneInfo: {
    flex: 1,
  },
  zoneName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  zoneDistance: {
    fontSize: 14,
    color: '#999',
  },
  zoneStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#2a1a00',
    borderRadius: 8,
  },
  timerLabel: {
    color: '#FF8800',
    fontSize: 14,
    fontWeight: '600',
  },
  zoneDescription: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  participantsList: {
    marginBottom: 30,
  },
  participantsTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  participantAvatar: {
    fontSize: 20,
    width: 32,
  },
  participantName: {
    flex: 1,
    color: 'white',
    fontSize: 14,
  },
  participantStatus: {
    color: '#00C851',
    fontSize: 12,
    fontWeight: '500',
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
