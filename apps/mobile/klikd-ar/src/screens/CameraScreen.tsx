import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CameraScreenProps {
  navigation: any;
}

const AR_FILTERS = [
  { id: 'none', name: 'None', icon: 'close-circle-outline' },
  { id: 'face', name: 'Face', icon: 'happy-outline' },
  { id: 'world', name: 'World', icon: 'globe-outline' },
  { id: 'beauty', name: 'Beauty', icon: 'sparkles-outline' },
  { id: 'vintage', name: 'Vintage', icon: 'camera-outline' },
];

export default function CameraScreen({ navigation }: CameraScreenProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [showFilters, setShowFilters] = useState(false);
  
  const cameraRef = useRef<Camera>(null);
  const recordingProgress = useSharedValue(0);
  const filterPanelY = useSharedValue(200);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        // Navigate to story creation with the captured photo
        navigation.navigate('Story', { 
          type: 'create',
          media: { type: 'photo', uri: photo.uri }
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const startRecording = async () => {
    if (cameraRef.current && !isRecording) {
      try {
        setIsRecording(true);
        recordingProgress.value = withSpring(1, { duration: 10000 });
        
        const video = await cameraRef.current.recordAsync({
          quality: Camera.Constants.VideoQuality['720p'],
          maxDuration: 10,
        });
        
        navigation.navigate('Story', { 
          type: 'create',
          media: { type: 'video', uri: video.uri }
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to record video');
      } finally {
        setIsRecording(false);
        recordingProgress.value = 0;
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
      recordingProgress.value = withSpring(0);
    }
  };

  const toggleCameraType = () => {
    setCameraType(current => 
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const toggleFlash = () => {
    setFlashMode(current => {
      switch (current) {
        case FlashMode.off: return FlashMode.on;
        case FlashMode.on: return FlashMode.auto;
        case FlashMode.auto: return FlashMode.off;
        default: return FlashMode.off;
      }
    });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
    filterPanelY.value = withSpring(showFilters ? 200 : 0);
  };

  const selectFilter = (filterId: string) => {
    setSelectedFilter(filterId);
    setShowFilters(false);
    filterPanelY.value = withSpring(200);
  };

  const recordingProgressStyle = useAnimatedStyle(() => ({
    width: `${recordingProgress.value * 100}%`,
  }));

  const filterPanelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: filterPanelY.value }],
  }));

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>No access to camera</Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.permissionButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Camera View */}
      <Camera 
        ref={cameraRef}
        style={styles.camera}
        type={cameraType}
        flashMode={flashMode}
      >
        {/* AR Overlay */}
        <View style={styles.arOverlay}>
          {selectedFilter !== 'none' && (
            <View style={styles.filterIndicator}>
              <Text style={styles.filterText}>{selectedFilter.toUpperCase()}</Text>
            </View>
          )}
        </View>

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
              onPress={toggleFlash}
            >
              <Ionicons 
                name={
                  flashMode === FlashMode.off ? 'flash-off' :
                  flashMode === FlashMode.on ? 'flash' : 'flash-outline'
                } 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.topButton}
              onPress={() => navigation.navigate('ARZones')}
            >
              <Ionicons name="location" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Recording Progress */}
        {isRecording && (
          <View style={styles.recordingProgress}>
            <Animated.View style={[styles.progressBar, recordingProgressStyle]} />
          </View>
        )}

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          {/* Filter Button */}
          <TouchableOpacity 
            style={styles.sideButton}
            onPress={toggleFilters}
          >
            <Ionicons name="color-filter" size={28} color="white" />
          </TouchableOpacity>

          {/* Capture Button */}
          <TouchableOpacity
            style={[styles.captureButton, isRecording && styles.captureButtonRecording]}
            onPress={takePicture}
            onLongPress={startRecording}
            onPressOut={stopRecording}
          >
            <View style={[styles.captureInner, isRecording && styles.captureInnerRecording]} />
          </TouchableOpacity>

          {/* Flip Camera Button */}
          <TouchableOpacity 
            style={styles.sideButton}
            onPress={toggleCameraType}
          >
            <Ionicons name="camera-reverse" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* AR Filter Panel */}
        <Animated.View style={[styles.filterPanel, filterPanelStyle]}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>AR Filters</Text>
            <TouchableOpacity onPress={toggleFilters}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.filterGrid}>
            {AR_FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterItem,
                  selectedFilter === filter.id && styles.filterItemSelected
                ]}
                onPress={() => selectFilter(filter.id)}
              >
                <Ionicons name={filter.icon as any} size={24} color="white" />
                <Text style={styles.filterName}>{filter.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  permissionText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    margin: 20,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    margin: 20,
  },
  permissionButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  arOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  filterIndicator: {
    position: 'absolute',
    top: 100,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  topControls: {
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  recordingProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#ff3040',
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
  sideButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  captureButtonRecording: {
    borderColor: '#ff3040',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  captureInnerRecording: {
    borderRadius: 8,
    backgroundColor: '#ff3040',
  },
  filterPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  filterTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    justifyContent: 'space-around',
  },
  filterItem: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    margin: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    minWidth: 80,
  },
  filterItemSelected: {
    backgroundColor: '#007AFF',
  },
  filterName: {
    color: 'white',
    fontSize: 12,
    marginTop: 8,
  },
});
