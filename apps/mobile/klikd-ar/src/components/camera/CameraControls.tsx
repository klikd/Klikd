import React from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CameraControlsProps {
  mode: {
    type: 'photo' | 'video' | 'ar_story' | 'ar_snap';
  };
  isRecording: boolean;
  onCapture: () => void;
  recordingProgress: Animated.Value;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  mode,
  isRecording,
  onCapture,
  recordingProgress,
}) => {
  const getCaptureButtonStyle = () => {
    if (mode.type === 'video' || mode.type === 'ar_story') {
      return isRecording ? styles.recordingButton : styles.videoButton;
    }
    return styles.photoButton;
  };

  const getCaptureIcon = () => {
    if (mode.type === 'video' || mode.type === 'ar_story') {
      return isRecording ? 'stop' : 'videocam';
    }
    return 'camera';
  };

  return (
    <View style={styles.container}>
      {/* Recording Progress Ring */}
      {(mode.type === 'video' || mode.type === 'ar_story') && (
        <Animated.View
          style={[
            styles.progressRing,
            {
              transform: [
                {
                  rotate: recordingProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        />
      )}

      {/* Main Capture Button */}
      <TouchableOpacity
        style={[styles.captureButton, getCaptureButtonStyle()]}
        onPress={onCapture}
        activeOpacity={0.8}
      >
        <Ionicons
          name={getCaptureIcon()}
          size={mode.type === 'photo' || mode.type === 'ar_snap' ? 32 : 28}
          color="#ffffff"
        />
      </TouchableOpacity>

      {/* Camera Flip Button */}
      <TouchableOpacity style={styles.flipButton}>
        <Ionicons name="camera-reverse" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  photoButton: {
    backgroundColor: 'transparent',
  },
  videoButton: {
    backgroundColor: 'transparent',
  },
  recordingButton: {
    backgroundColor: '#ff3333',
    borderColor: '#ff3333',
  },
  progressRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#ff3333',
    borderTopColor: 'transparent',
  },
  flipButton: {
    position: 'absolute',
    right: -60,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
