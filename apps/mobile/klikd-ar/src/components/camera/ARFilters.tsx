import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ARFilter {
  id: string;
  name: string;
  icon: string;
  type: 'face' | 'world' | 'color' | 'effect';
  premium: boolean;
}

interface ARFiltersProps {
  visible: boolean;
  onFilterSelect: (filterId: string) => void;
  activeFilter: string | null;
  onClose: () => void;
}

const AVAILABLE_FILTERS: ARFilter[] = [
  { id: 'none', name: 'None', icon: '🚫', type: 'effect', premium: false },
  { id: 'dog_ears', name: 'Dog Ears', icon: '🐕', type: 'face', premium: false },
  { id: 'cat_whiskers', name: 'Cat', icon: '🐱', type: 'face', premium: false },
  { id: 'rainbow', name: 'Rainbow', icon: '🌈', type: 'world', premium: false },
  { id: 'vintage', name: 'Vintage', icon: '📸', type: 'color', premium: false },
  { id: 'neon', name: 'Neon', icon: '💫', type: 'effect', premium: true },
  { id: 'hologram', name: 'Hologram', icon: '✨', type: 'effect', premium: true },
  { id: 'cyberpunk', name: 'Cyberpunk', icon: '🤖', type: 'world', premium: true },
];

export const ARFilters: React.FC<ARFiltersProps> = ({
  visible,
  onFilterSelect,
  activeFilter,
  onClose,
}) => {
  const handleFilterSelect = (filterId: string) => {
    onFilterSelect(filterId === 'none' ? '' : filterId);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>AR Filters</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Filter Categories */}
          <View style={styles.categories}>
            {(['face', 'world', 'color', 'effect'] as const).map(category => (
              <TouchableOpacity key={category} style={styles.categoryButton}>
                <Text style={styles.categoryText}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Filters Grid */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            {AVAILABLE_FILTERS.map(filter => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterButton,
                  activeFilter === filter.id && styles.activeFilterButton,
                  filter.premium && styles.premiumFilter,
                ]}
                onPress={() => handleFilterSelect(filter.id)}
              >
                <Text style={styles.filterIcon}>{filter.icon}</Text>
                <Text style={[
                  styles.filterName,
                  activeFilter === filter.id && styles.activeFilterName,
                ]}>
                  {filter.name}
                </Text>
                {filter.premium && (
                  <View style={styles.premiumBadge}>
                    <Ionicons name="diamond" size={12} color="#FFD700" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Filter Info */}
          <View style={styles.info}>
            <Text style={styles.infoText}>
              Tap a filter to apply • Premium filters require subscription
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categories: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    backgroundColor: '#333333',
    borderRadius: 16,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  filterButton: {
    width: 80,
    height: 100,
    marginRight: 15,
    borderRadius: 12,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeFilterButton: {
    borderColor: '#007AFF',
    backgroundColor: '#1A1A2E',
  },
  premiumFilter: {
    borderColor: '#FFD700',
    borderWidth: 1,
  },
  filterIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  filterName: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  activeFilterName: {
    color: '#007AFF',
    fontWeight: '600',
  },
  premiumBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  infoText: {
    color: '#999999',
    fontSize: 12,
    textAlign: 'center',
  },
});
