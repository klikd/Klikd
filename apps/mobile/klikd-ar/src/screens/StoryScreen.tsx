import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import SwipeNavigator from '../components/SwipeNavigator';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface StoryScreenProps {
  navigation: any;
  route: {
    params?: {
      type?: 'view' | 'create';
      media?: {
        type: 'photo' | 'video';
        uri: string;
      };
      storyId?: string;
      username?: string;
    };
  };
}

const STORY_FILTERS = [
  { id: 'none', name: 'Original', color: '#fff' },
  { id: 'vintage', name: 'Vintage', color: '#D2691E' },
  { id: 'bw', name: 'B&W', color: '#808080' },
  { id: 'warm', name: 'Warm', color: '#FF6347' },
  { id: 'cool', name: 'Cool', color: '#4169E1' },
];

const STORY_STICKERS = [
  { id: 'fire', icon: 'flame', name: 'Fire' },
  { id: 'heart', icon: 'heart', name: 'Love' },
  { id: 'star', icon: 'star', name: 'Star' },
  { id: 'location', icon: 'location', name: 'Location' },
  { id: 'time', icon: 'time', name: 'Time' },
];

export default function StoryScreen({ navigation, route }: StoryScreenProps) {
  const { type = 'view', media, storyId, username } = route.params || {};
  
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [showFilters, setShowFilters] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const [storyText, setStoryText] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [stickers, setStickers] = useState<Array<{id: string, x: number, y: number, icon: string}>>([]);
  
  const filterPanelY = useSharedValue(200);
  const stickerPanelY = useSharedValue(200);
  const textScale = useSharedValue(0);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
    setShowStickers(false);
    filterPanelY.value = withSpring(showFilters ? 200 : 0);
    stickerPanelY.value = withSpring(200);
  };

  const toggleStickers = () => {
    setShowStickers(!showStickers);
    setShowFilters(false);
    stickerPanelY.value = withSpring(showStickers ? 200 : 0);
    filterPanelY.value = withSpring(200);
  };

  const toggleTextInput = () => {
    setShowTextInput(!showTextInput);
    textScale.value = withSpring(showTextInput ? 0 : 1);
  };

  const addSticker = (sticker: any) => {
    const newSticker = {
      id: `${sticker.id}_${Date.now()}`,
      x: SCREEN_WIDTH / 2,
      y: SCREEN_HEIGHT / 2,
      icon: sticker.icon,
    };
    setStickers([...stickers, newSticker]);
    setShowStickers(false);
    stickerPanelY.value = withSpring(200);
  };

  const shareStory = async () => {
    Alert.alert(
      'Share Story',
      'Story shared successfully!',
      [
        { text: 'View Feed', onPress: () => navigation.navigate('Feed') },
        { text: 'Create Another', onPress: () => navigation.navigate('Camera') },
      ]
    );
  };

  const handleSwipeDown = () => {
    navigation.goBack();
  };

  const filterPanelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: filterPanelY.value }],
  }));

  const stickerPanelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: stickerPanelY.value }],
  }));

  const textInputStyle = useAnimatedStyle(() => ({
    transform: [{ scale: textScale.value }],
    opacity: textScale.value,
  }));

  if (type === 'create' && media) {
    return (
      <SwipeNavigator onSwipeDown={handleSwipeDown}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          
          {/* Media Background */}
          <View style={styles.mediaContainer}>
            <Image 
              source={{ uri: media.uri }} 
              style={styles.media}
              resizeMode="cover"
            />
            
            {/* Filter Overlay */}
            <View style={[styles.filterOverlay, { backgroundColor: getFilterColor(selectedFilter) }]} />
          </View>

          {/* Story Text Overlay */}
          {storyText && (
            <View style={styles.textOverlay}>
              <Text style={styles.storyText}>{storyText}</Text>
            </View>
          )}

          {/* Stickers */}
          {stickers.map((sticker) => (
            <View
              key={sticker.id}
              style={[styles.stickerContainer, { left: sticker.x - 20, top: sticker.y - 20 }]}
            >
              <Ionicons name={sticker.icon as any} size={40} color="white" />
            </View>
          ))}

          {/* Top Controls */}
          <SafeAreaView style={styles.topControls}>
            <TouchableOpacity 
              style={styles.topButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
            
            <View style={styles.topRightControls}>
              <TouchableOpacity 
                style={styles.topButton}
                onPress={toggleTextInput}
              >
                <Ionicons name="text" size={24} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.topButton}
                onPress={toggleStickers}
              >
                <Ionicons name="happy" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={toggleFilters}
            >
              <Ionicons name="color-filter" size={24} color="white" />
              <Text style={styles.controlText}>Filters</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.shareButton}
              onPress={shareStory}
            >
              <Ionicons name="paper-plane" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => navigation.navigate('Feed')}
            >
              <Ionicons name="download" size={24} color="white" />
              <Text style={styles.controlText}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* Text Input Modal */}
          <Animated.View style={[styles.textInputModal, textInputStyle]}>
            <TextInput
              style={styles.textInput}
              placeholder="Add text to your story..."
              placeholderTextColor="#ccc"
              value={storyText}
              onChangeText={setStoryText}
              multiline
              autoFocus={showTextInput}
            />
            <TouchableOpacity 
              style={styles.textDoneButton}
              onPress={toggleTextInput}
            >
              <Text style={styles.textDoneText}>Done</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Filter Panel */}
          <Animated.View style={[styles.filterPanel, filterPanelStyle]}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Filters</Text>
              <TouchableOpacity onPress={toggleFilters}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.filterGrid}>
              {STORY_FILTERS.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  style={[
                    styles.filterItem,
                    selectedFilter === filter.id && styles.filterItemSelected
                  ]}
                  onPress={() => setSelectedFilter(filter.id)}
                >
                  <View style={[styles.filterPreview, { backgroundColor: filter.color }]} />
                  <Text style={styles.filterName}>{filter.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Sticker Panel */}
          <Animated.View style={[styles.stickerPanel, stickerPanelStyle]}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Stickers</Text>
              <TouchableOpacity onPress={toggleStickers}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.stickerGrid}>
              {STORY_STICKERS.map((sticker) => (
                <TouchableOpacity
                  key={sticker.id}
                  style={styles.stickerItem}
                  onPress={() => addSticker(sticker)}
                >
                  <Ionicons name={sticker.icon as any} size={32} color="white" />
                  <Text style={styles.stickerName}>{sticker.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </View>
      </SwipeNavigator>
    );
  }

  // Story viewer mode (placeholder for now)
  return (
    <SwipeNavigator onSwipeDown={handleSwipeDown}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        <View style={styles.viewerContainer}>
          <Text style={styles.viewerTitle}>Story Viewer</Text>
          <Text style={styles.viewerSubtitle}>
            {username ? `${username}'s Story` : 'Story content will appear here'}
          </Text>
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Back to Feed</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SwipeNavigator>
  );
}

const getFilterColor = (filterId: string) => {
  switch (filterId) {
    case 'vintage': return 'rgba(210, 105, 30, 0.2)';
    case 'bw': return 'rgba(128, 128, 128, 0.3)';
    case 'warm': return 'rgba(255, 99, 71, 0.2)';
    case 'cool': return 'rgba(65, 105, 225, 0.2)';
    default: return 'rgba(0, 0, 0, 0)';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  mediaContainer: {
    flex: 1,
    position: 'relative',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  filterOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  textOverlay: {
    position: 'absolute',
    top: '40%',
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  storyText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  stickerContainer: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  topRightControls: {
    flexDirection: 'row',
  },
  topButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  controlButton: {
    alignItems: 'center',
  },
  controlText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
  shareButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputModal: {
    position: 'absolute',
    top: '30%',
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 12,
    padding: 20,
  },
  textInput: {
    color: 'white',
    fontSize: 18,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  textDoneButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  textDoneText: {
    color: 'white',
    fontWeight: '600',
  },
  filterPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  stickerPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  panelTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterGrid: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-around',
  },
  filterItem: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  filterItemSelected: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  filterPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
  },
  filterName: {
    color: 'white',
    fontSize: 12,
  },
  stickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    justifyContent: 'space-around',
  },
  stickerItem: {
    alignItems: 'center',
    padding: 16,
    margin: 8,
  },
  stickerName: {
    color: 'white',
    fontSize: 12,
    marginTop: 8,
  },
  viewerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  viewerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  viewerSubtitle: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
