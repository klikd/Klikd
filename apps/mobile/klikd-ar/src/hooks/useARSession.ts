import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setARSupported, setSessionActive, setTrackingState, addAnchor, removeAnchor, updateAnchor } from '../store/slices/arSlice';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';

export interface ARAnchor {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number, number];
  type: 'zone' | 'booth' | 'ncp' | 'mission' | 'user_created';
  metadata?: any;
  timestamp: number;
}

export interface ARSessionConfig {
  worldAlignment: 'gravity' | 'gravityAndHeading' | 'camera';
  planeDetection: 'horizontal' | 'vertical' | 'both' | 'none';
  lightEstimation: boolean;
  occlusionEnabled: boolean;
  peopleOcclusionEnabled: boolean;
  faceTrackingEnabled: boolean;
  handTrackingEnabled: boolean;
}

export const useARSession = () => {
  const dispatch = useDispatch();
  const arState = useSelector((state: RootState) => state.ar);
  
  const [userPosition, setUserPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [userRotation, setUserRotation] = useState<[number, number, number, number]>([0, 0, 0, 1]);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [sessionConfig, setSessionConfig] = useState<ARSessionConfig>({
    worldAlignment: 'gravityAndHeading',
    planeDetection: 'horizontal',
    lightEstimation: true,
    occlusionEnabled: true,
    peopleOcclusionEnabled: false,
    faceTrackingEnabled: false,
    handTrackingEnabled: false,
  });

  // Request necessary permissions
  const requestPermissions = useCallback(async () => {
    try {
      // Camera permission
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      
      // Location permission
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      
      const allGranted = cameraStatus === 'granted' && locationStatus === 'granted';
      setHasPermissions(allGranted);
      
      if (allGranted) {
        dispatch(setARSupported(true));
      }
      
      return allGranted;
    } catch (error) {
      console.error('Permission request failed:', error);
      setHasPermissions(false);
      return false;
    }
  }, [dispatch]);

  // Start AR session
  const startSession = useCallback(async (config?: Partial<ARSessionConfig>) => {
    if (!hasPermissions) {
      const granted = await requestPermissions();
      if (!granted) return false;
    }

    try {
      if (config) {
        setSessionConfig(prev => ({ ...prev, ...config }));
      }

      dispatch(setSessionActive(true));
      dispatch(setTrackingState('normal'));
      
      // Start location tracking
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setUserPosition([
        location.coords.latitude,
        location.coords.longitude,
        location.coords.altitude || 0,
      ]);

      return true;
    } catch (error) {
      console.error('Failed to start AR session:', error);
      dispatch(setSessionActive(false));
      return false;
    }
  }, [hasPermissions, requestPermissions, dispatch]);

  // Stop AR session
  const stopSession = useCallback(() => {
    dispatch(setSessionActive(false));
    dispatch(setTrackingState('not_available'));
  }, [dispatch]);

  // Add anchor to AR session
  const addARanchor = useCallback((anchor: Omit<ARAnchor, 'id' | 'timestamp'>) => {
    const newAnchor: ARAnchor = {
      ...anchor,
      id: `anchor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    
    dispatch(addAnchor(newAnchor));
    return newAnchor.id;
  }, [dispatch]);

  // Remove anchor from AR session
  const removeARanchor = useCallback((anchorId: string) => {
    dispatch(removeAnchor(anchorId));
  }, [dispatch]);

  // Update anchor position/rotation
  const updateARanchor = useCallback((anchorId: string, updates: Partial<ARAnchor>) => {
    dispatch(updateAnchor({ id: anchorId, updates }));
  }, [dispatch]);

  // Get anchors by type
  const getAnchorsByType = useCallback((type: ARAnchor['type']) => {
    return arState.anchors.filter(anchor => anchor.type === type);
  }, [arState.anchors]);

  // Get nearby anchors within radius
  const getNearbyAnchors = useCallback((position: [number, number, number], radius: number) => {
    return arState.anchors.filter(anchor => {
      const distance = Math.sqrt(
        Math.pow(anchor.position[0] - position[0], 2) +
        Math.pow(anchor.position[1] - position[1], 2) +
        Math.pow(anchor.position[2] - position[2], 2)
      );
      return distance <= radius;
    });
  }, [arState.anchors]);

  // Convert world coordinates to AR coordinates
  const worldToAR = useCallback((worldPos: [number, number, number]): [number, number, number] => {
    // This would implement proper coordinate transformation
    // For now, return relative to user position
    return [
      worldPos[0] - userPosition[0],
      worldPos[1] - userPosition[1],
      worldPos[2] - userPosition[2],
    ];
  }, [userPosition]);

  // Convert AR coordinates to world coordinates
  const arToWorld = useCallback((arPos: [number, number, number]): [number, number, number] => {
    return [
      arPos[0] + userPosition[0],
      arPos[1] + userPosition[1],
      arPos[2] + userPosition[2],
    ];
  }, [userPosition]);

  // Hit test for plane detection
  const hitTest = useCallback((screenPoint: [number, number]) => {
    // This would integrate with AR engine's hit testing
    // Return mock data for now
    return {
      position: [0, 0, -1] as [number, number, number],
      normal: [0, 1, 0] as [number, number, number],
      planeType: 'horizontal' as const,
    };
  }, []);

  // Ray casting for object selection
  const raycast = useCallback((origin: [number, number, number], direction: [number, number, number]) => {
    // This would implement proper ray casting
    const intersectedAnchors = arState.anchors.filter(anchor => {
      // Simple distance-based intersection for demo
      const distance = Math.sqrt(
        Math.pow(anchor.position[0] - origin[0], 2) +
        Math.pow(anchor.position[1] - origin[1], 2) +
        Math.pow(anchor.position[2] - origin[2], 2)
      );
      return distance < 1.0; // 1 meter threshold
    });

    return intersectedAnchors;
  }, [arState.anchors]);

  // Update user position (called by AR engine)
  const updateUserPosition = useCallback((position: [number, number, number], rotation?: [number, number, number, number]) => {
    setUserPosition(position);
    if (rotation) {
      setUserRotation(rotation);
    }
  }, []);

  // Session state management
  useEffect(() => {
    if (arState.sessionActive) {
      // Set up location watching
      const watchLocation = async () => {
        try {
          await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 1000,
              distanceInterval: 1,
            },
            (location) => {
              setUserPosition([
                location.coords.latitude,
                location.coords.longitude,
                location.coords.altitude || 0,
              ]);
            }
          );
        } catch (error) {
          console.error('Location watching failed:', error);
        }
      };

      watchLocation();
    }
  }, [arState.sessionActive]);

  return {
    // State
    isSupported: arState.isSupported,
    sessionActive: arState.sessionActive,
    trackingState: arState.trackingState,
    anchors: arState.anchors,
    userPosition,
    userRotation,
    hasPermissions,
    sessionConfig,

    // Actions
    requestPermissions,
    startSession,
    stopSession,
    addAnchor: addARanchor,
    removeAnchor: removeARanchor,
    updateAnchor: updateARanchor,
    
    // Queries
    getAnchorsByType,
    getNearbyAnchors,
    
    // Utilities
    worldToAR,
    arToWorld,
    hitTest,
    raycast,
    updateUserPosition,
  };
};
