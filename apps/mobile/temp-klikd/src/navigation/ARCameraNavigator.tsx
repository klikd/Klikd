// Category 8: AR & Camera UX Navigator (11 screens)
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import AR & Camera screens
import ARCameraScreen from '../screens/ar/ARCameraScreen';
import ARScanResultScreen from '../screens/ar/ARScanResultScreen';
import ARObjectViewerScreen from '../screens/ar/ARObjectViewerScreen';
import ARFiltersScreen from '../screens/ar/ARFiltersScreen';
import ARGalleryScreen from '../screens/ar/ARGalleryScreen';
import ARShareScreen from '../screens/ar/ARShareScreen';
import CameraSettingsScreen from '../screens/ar/CameraSettingsScreen';
import ARTutorialScreen from '../screens/ar/ARTutorialScreen';
import ARPermissionsScreen from '../screens/ar/ARPermissionsScreen';
import ARCalibrationScreen from '../screens/ar/ARCalibrationScreen';
import ARTroubleshootScreen from '../screens/ar/ARTroubleshootScreen';

const Stack = createStackNavigator();

export type ARCameraStackParamList = {
  ARCamera: undefined;
  ARScanResult: { scanData: any; questId?: string };
  ARObjectViewer: { objectId: string; questId?: string };
  ARFilters: { currentFilter?: string };
  ARGallery: undefined;
  ARShare: { contentId: string; type: 'photo' | 'video' | 'ar_object' };
  CameraSettings: undefined;
  ARTutorial: { step?: number };
  ARPermissions: { requestType: 'camera' | 'location' | 'microphone' };
  ARCalibration: undefined;
  ARTroubleshoot: { issue?: string };
};

const ARCameraNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <Stack.Screen name="ARCamera" component={ARCameraScreen} />
      <Stack.Screen name="ARScanResult" component={ARScanResultScreen} />
      <Stack.Screen name="ARObjectViewer" component={ARObjectViewerScreen} />
      <Stack.Screen name="ARFilters" component={ARFiltersScreen} />
      <Stack.Screen name="ARGallery" component={ARGalleryScreen} />
      <Stack.Screen name="ARShare" component={ARShareScreen} />
      <Stack.Screen name="CameraSettings" component={CameraSettingsScreen} />
      <Stack.Screen name="ARTutorial" component={ARTutorialScreen} />
      <Stack.Screen name="ARPermissions" component={ARPermissionsScreen} />
      <Stack.Screen name="ARCalibration" component={ARCalibrationScreen} />
      <Stack.Screen name="ARTroubleshoot" component={ARTroubleshootScreen} />
    </Stack.Navigator>
  );
};

export default ARCameraNavigator;
