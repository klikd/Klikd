import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import ARScene from '../components/ARScene';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ARZone {
  id: string;
  name: string;
  description: string;
  distance: number;
  type: 'retail' | 'entertainment' | 'social' | 'brand';
  isActive: boolean;
  rewards: number;
}

const MOCK_AR_ZONES: ARZone[] = [
  {
    id: '1',
    name: 'Mall AR Experience',
    description: 'Interactive shopping with AR try-ons',
    distance: 0.2,
    type: 'retail',
    isActive: true,
    rewards: 50,
  },
  {
    id: '2',
    name: 'Coffee Shop Quest',
    description: 'Find hidden AR collectibles',
    distance: 0.5,
    type: 'social',
    isActive: true,
    rewards: 25,
  },
  {
    id: '3',
    name: 'Nike AR Studio',
    description: 'Try on sneakers in AR',
    distance: 1.2,
    type: 'brand',
    isActive: false,
    rewards: 100,
  },
  {
    id: '4',
    name: 'Park Adventure',
    description: 'Nature-based AR challenges',
    distance: 2.1,
    type: 'entertainment',
    isActive: true,
    rewards: 75,
  },
];

interface ARZonesScreenProps {
  navigation: any;
}

export default function ARZonesScreen({ navigation }: ARZonesScreenProps) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [zones, setZones] = useState<ARZone[]>(MOCK_AR_ZONES);
  const [showARScene, setShowARScene] = useState(false);
  const [selectedZone, setSelectedZone] = useState<ARZone | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');
      
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get location permission');
    }
  };

  const handleZonePress = (zone: ARZone) => {
    if (!zone.isActive) {
      Alert.alert('Zone Inactive', `You need to be within ${zone.distance}km to activate this zone`);
      return;
    }

    setSelectedZone(zone);
    setShowARScene(true);
  };

  const closeARScene = () => {
    setShowARScene(false);
    setSelectedZone(null);
  };

  const getZoneIcon = (type: string) => {
    switch (type) {
      case 'retail': return 'storefront';
      case 'entertainment': return 'game-controller';
      case 'social': return 'people';
      case 'brand': return 'diamond';
      default: return 'location';
    }
  };

  const getZoneColor = (type: string) => {
    switch (type) {
      case 'retail': return '#FF6B35';
      case 'entertainment': return '#8E44AD';
      case 'social': return '#3498DB';
      case 'brand': return '#E74C3C';
      default: return '#95A5A6';
    }
  };

  const renderZoneItem = ({ item }: { item: ARZone }) => (
    <TouchableOpacity
      style={[
        styles.zoneCard,
        { borderLeftColor: getZoneColor(item.type) },
        !item.isActive && styles.inactiveZone
      ]}
      onPress={() => handleZonePress(item)}
    >
      <View style={styles.zoneHeader}>
        <View style={[styles.zoneIcon, { backgroundColor: getZoneColor(item.type) }]}>
          <Ionicons name={getZoneIcon(item.type) as any} size={24} color="white" />
        </View>
        <View style={styles.zoneInfo}>
          <Text style={styles.zoneName}>{item.name}</Text>
          <Text style={styles.zoneDescription}>{item.description}</Text>
        </View>
        <View style={styles.zoneStats}>
          <Text style={styles.zoneDistance}>{item.distance}km</Text>
          <Text style={styles.zoneRewards}>+{item.rewards}</Text>
        </View>
      </View>
      
      <View style={styles.zoneFooter}>
        <View style={[styles.statusIndicator, item.isActive && styles.activeIndicator]}>
          <Text style={[styles.statusText, item.isActive && styles.activeStatusText]}>
            {item.isActive ? 'Active' : 'Too Far'}
          </Text>
        </View>
        <TouchableOpacity style={styles.enterButton}>
          <Text style={styles.enterButtonText}>
            {item.isActive ? 'Enter AR' : 'Navigate'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (showARScene && selectedZone) {
    return (
      <ARScene
        onClose={closeARScene}
        sceneType="zone"
        arData={selectedZone}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>AR Zones</Text>
        
        <TouchableOpacity style={styles.mapButton}>
          <Ionicons name="map" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Location Status */}
      <View style={styles.locationStatus}>
        <Ionicons 
          name={hasLocationPermission ? "location" : "location-outline"} 
          size={16} 
          color={hasLocationPermission ? "#34C759" : "#FF3B30"} 
        />
        <Text style={styles.locationText}>
          {hasLocationPermission 
            ? `${zones.filter(z => z.isActive).length} zones nearby`
            : 'Location access required'
          }
        </Text>
      </View>

      {/* Zones List */}
      <FlatList
        data={zones}
        renderItem={renderZoneItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.zonesList}
        showsVerticalScrollIndicator={false}
      />

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('Camera')}
        >
          <Ionicons name="camera" size={20} color="white" />
          <Text style={styles.quickActionText}>Camera</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('ARBooth')}
        >
          <Ionicons name="business" size={20} color="white" />
          <Text style={styles.quickActionText}>AR Booth</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('NCPs')}
        >
          <Ionicons name="person" size={20} color="white" />
          <Text style={styles.quickActionText}>NCPs</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  mapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  zonesList: {
    padding: 16,
  },
  zoneCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inactiveZone: {
    opacity: 0.6,
  },
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  zoneIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  zoneInfo: {
    flex: 1,
  },
  zoneName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  zoneDescription: {
    fontSize: 14,
    color: '#666',
  },
  zoneStats: {
    alignItems: 'flex-end',
  },
  zoneDistance: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  zoneRewards: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#34C759',
  },
  zoneFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
  },
  activeIndicator: {
    backgroundColor: '#d4edda',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  activeStatusText: {
    color: '#155724',
  },
  enterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#007AFF',
  },
  enterButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  quickActionButton: {
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 4,
  },
  quickActionText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
});
