import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CapturedMedia {
  id: string;
  type: 'photo' | 'video';
  uri: string;
  timestamp: string;
  filter?: string | null;
  arData?: any;
}

interface StoryCaptureProps {
  visible: boolean;
  capturedMedia: CapturedMedia[];
  onShare: (storyData: any) => void;
}

export const StoryCapture: React.FC<StoryCaptureProps> = ({
  visible,
  capturedMedia,
  onShare,
}) => {
  const [selectedMedia, setSelectedMedia] = useState<CapturedMedia[]>([]);
  const [storyText, setStoryText] = useState('');
  const [storyMusic, setStoryMusic] = useState<string | null>(null);

  const handleMediaSelect = (media: CapturedMedia) => {
    setSelectedMedia(prev => {
      const isSelected = prev.find(m => m.id === media.id);
      if (isSelected) {
        return prev.filter(m => m.id !== media.id);
      }
      return [...prev, media];
    });
  };

  const handleShare = () => {
    const storyData = {
      id: `story_${Date.now()}`,
      media: selectedMedia,
      text: storyText,
      music: storyMusic,
      timestamp: new Date().toISOString(),
      duration: selectedMedia.reduce((acc, media) => {
        return acc + (media.type === 'video' ? 15 : 3); // 15s for video, 3s for photo
      }, 0),
    };

    onShare(storyData);
    setSelectedMedia([]);
    setStoryText('');
    setStoryMusic(null);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Story</Text>
            <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
              <Text style={styles.shareText}>Share</Text>
            </TouchableOpacity>
          </View>

          {/* Media Selection */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mediaContainer}
          >
            {capturedMedia.map(media => {
              const isSelected = selectedMedia.find(m => m.id === media.id);
              
              return (
                <TouchableOpacity
                  key={media.id}
                  style={[
                    styles.mediaItem,
                    isSelected && styles.selectedMediaItem,
                  ]}
                  onPress={() => handleMediaSelect(media)}
                >
                  <Image source={{ uri: media.uri }} style={styles.mediaThumbnail} />
                  
                  {media.type === 'video' && (
                    <View style={styles.videoIndicator}>
                      <Ionicons name="play" size={16} color="#ffffff" />
                    </View>
                  )}
                  
                  {media.filter && (
                    <View style={styles.filterBadge}>
                      <Text style={styles.filterText}>F</Text>
                    </View>
                  )}
                  
                  {isSelected && (
                    <View style={styles.selectionBadge}>
                      <Ionicons name="checkmark" size={16} color="#ffffff" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Story Tools */}
          <View style={styles.tools}>
            <TouchableOpacity style={styles.toolButton}>
              <Ionicons name="text" size={24} color="#ffffff" />
              <Text style={styles.toolText}>Text</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.toolButton}>
              <Ionicons name="musical-notes" size={24} color="#ffffff" />
              <Text style={styles.toolText}>Music</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.toolButton}>
              <Ionicons name="location" size={24} color="#ffffff" />
              <Text style={styles.toolText}>Location</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.toolButton}>
              <Ionicons name="people" size={24} color="#ffffff" />
              <Text style={styles.toolText}>Tag</Text>
            </TouchableOpacity>
          </View>

          {/* Selected Media Preview */}
          {selectedMedia.length > 0 && (
            <View style={styles.preview}>
              <Text style={styles.previewTitle}>
                Story Preview ({selectedMedia.length} items)
              </Text>
              
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.previewContainer}
              >
                {selectedMedia.map((media, index) => (
                  <View key={media.id} style={styles.previewItem}>
                    <Image source={{ uri: media.uri }} style={styles.previewThumbnail} />
                    <Text style={styles.previewIndex}>{index + 1}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '70%',
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
  shareButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
  },
  shareText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  mediaContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  mediaItem: {
    width: 80,
    height: 120,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedMediaItem: {
    borderColor: '#007AFF',
  },
  mediaThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333333',
  },
  videoIndicator: {
    position: 'absolute',
    top: 5,
    left: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  selectionBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tools: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  toolButton: {
    alignItems: 'center',
    padding: 10,
  },
  toolText: {
    color: '#ffffff',
    fontSize: 12,
    marginTop: 4,
  },
  preview: {
    padding: 20,
  },
  previewTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  previewContainer: {
    flexDirection: 'row',
  },
  previewItem: {
    width: 60,
    height: 80,
    marginRight: 8,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  previewThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333333',
  },
  previewIndex: {
    position: 'absolute',
    top: 2,
    left: 2,
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
