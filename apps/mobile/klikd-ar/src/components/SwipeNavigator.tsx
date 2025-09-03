import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SwipeNavigatorProps {
  children: React.ReactNode;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  swipeThreshold?: number;
}

export default function SwipeNavigator({
  children,
  onSwipeUp,
  onSwipeDown,
  onSwipeLeft,
  onSwipeRight,
  swipeThreshold = 50,
}: SwipeNavigatorProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      // Optional: Add haptic feedback or visual indication
    },
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      
      // Add subtle opacity change during swipe
      const distance = Math.sqrt(
        Math.pow(event.translationX, 2) + Math.pow(event.translationY, 2)
      );
      opacity.value = Math.max(0.7, 1 - distance / (SCREEN_WIDTH * 0.5));
    },
    onEnd: (event) => {
      const { translationX, translationY, velocityX, velocityY } = event;
      
      // Determine swipe direction based on translation and velocity
      const absX = Math.abs(translationX);
      const absY = Math.abs(translationY);
      
      // Check if swipe meets threshold requirements
      const meetsThreshold = absX > swipeThreshold || absY > swipeThreshold;
      const hasVelocity = Math.abs(velocityX) > 500 || Math.abs(velocityY) > 500;
      
      if (meetsThreshold || hasVelocity) {
        // Determine primary direction
        if (absY > absX) {
          // Vertical swipe
          if (translationY < 0 && onSwipeUp) {
            runOnJS(onSwipeUp)();
          } else if (translationY > 0 && onSwipeDown) {
            runOnJS(onSwipeDown)();
          }
        } else {
          // Horizontal swipe
          if (translationX < 0 && onSwipeLeft) {
            runOnJS(onSwipeLeft)();
          } else if (translationX > 0 && onSwipeRight) {
            runOnJS(onSwipeRight)();
          }
        }
      }
      
      // Reset animation values
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      opacity.value = withSpring(1);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value * 0.1 }, // Subtle movement
      { translateY: translateY.value * 0.1 },
    ],
    opacity: opacity.value,
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
