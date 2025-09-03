// TikTok/Snapchat-Inspired UI System with Klikd Branding
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { KlikdBrandSystem } from './KlikdBrandSystem';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Swipeable Story/Quest Cards (TikTok-style)
export const SwipeableQuestCard: React.FC<{
  quest: {
    id: string;
    title: string;
    description: string;
    xp: number;
    difficulty: string;
    image?: string;
    participants: number;
    timeLeft: string;
  };
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
}> = ({ quest, onSwipeLeft, onSwipeRight, onTap, onDoubleTap }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [lastTap, setLastTap] = useState<number | null>(null);

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const handleSwipeLeft = () => {
    onSwipeLeft?.();
    Vibration.vibrate(50);
  };

  const handleSwipeRight = () => {
    onSwipeRight?.();
    Vibration.vibrate(50);
  };

  const handleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (lastTap && (now - lastTap) < DOUBLE_TAP_DELAY) {
      // Double tap
      onDoubleTap?.();
      setLastTap(null);
      
      // Heart animation
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      
      Vibration.vibrate(30);
    } else {
      // Single tap
      setLastTap(now);
      setTimeout(() => {
        if (lastTap === now) {
          onTap?.();
          setLastTap(null);
        }
      }, DOUBLE_TAP_DELAY);
    }
  };

  return (
    <Animated.View style={[
      styles.swipeableCard,
      {
        transform: [
          { translateX },
          { scale }
        ]
      }
    ]}>
      <TouchableOpacity 
        style={styles.cardTouchable}
        onPress={handleTap}
        activeOpacity={1}
      >
          {/* Background gradient */}
          <View style={styles.cardBackground} />
          
          {/* Content */}
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{quest.title}</Text>
              <View style={styles.xpBadge}>
                <Ionicons name="star" size={12} color={KlikdBrandSystem.colors.primary.klikd_black} />
                <Text style={styles.xpText}>{quest.xp}</Text>
              </View>
            </View>
            
            <Text style={styles.cardDescription}>{quest.description}</Text>
            
            <View style={styles.cardFooter}>
              <View style={styles.cardStats}>
                <View style={styles.statItem}>
                  <Ionicons name="people" size={14} color={KlikdBrandSystem.colors.primary.klikd_green} />
                  <Text style={styles.statText}>{quest.participants}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="time" size={14} color={KlikdBrandSystem.colors.primary.klikd_green} />
                  <Text style={styles.statText}>{quest.timeLeft}</Text>
                </View>
              </View>
              
              <View style={styles.difficultyBadge}>
                <Text style={styles.difficultyText}>{quest.difficulty.toUpperCase()}</Text>
              </View>
            </View>
          </View>
          
          {/* Swipe indicators */}
          <View style={styles.swipeIndicators}>
            <View style={[styles.swipeIndicator, styles.swipeLeft]}>
              <Ionicons name="close" size={24} color="white" />
              <Text style={styles.swipeText}>Skip</Text>
            </View>
            <View style={[styles.swipeIndicator, styles.swipeRight]}>
              <Ionicons name="checkmark" size={24} color="white" />
              <Text style={styles.swipeText}>Join</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
};

// Snapchat-style Action Buttons
export const SnapchatActionButton: React.FC<{
  icon: string;
  label: string;
  count?: number;
  active?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  glowEffect?: boolean;
}> = ({ icon, label, count, active, onPress, onLongPress, glowEffect }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (glowEffect) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [glowEffect]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      tension: 300,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 8,
    }).start();
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.8],
  });

  return (
    <Animated.View style={[
      styles.actionButton,
      {
        transform: [{ scale: scaleAnim }],
        shadowOpacity: glowEffect ? glowOpacity : 0.3,
      }
    ]}>
      <TouchableOpacity
        style={[
          styles.actionButtonInner,
          active && styles.actionButtonActive
        ]}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <Ionicons 
          name={icon as any} 
          size={24} 
          color={active ? KlikdBrandSystem.colors.primary.klikd_black : 'white'} 
        />
        {count !== undefined && (
          <Text style={[
            styles.actionButtonCount,
            active && styles.actionButtonCountActive
          ]}>
            {count > 999 ? `${Math.floor(count / 1000)}k` : count}
          </Text>
        )}
      </TouchableOpacity>
      <Text style={styles.actionButtonLabel}>{label}</Text>
    </Animated.View>
  );
};

// TikTok-style Bottom Sheet
export const TikTokBottomSheet: React.FC<{
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: string[];
}> = ({ visible, onClose, children, snapPoints = ['25%', '50%', '90%'] }) => {
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: screenHeight,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.bottomSheetContainer}>
      <Animated.View 
        style={[
          styles.bottomSheetBackdrop,
          { opacity: backdropOpacity }
        ]}
      >
        <TouchableOpacity 
          style={styles.backdropTouchable}
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>
      
      <Animated.View style={[
        styles.bottomSheet,
        {
          transform: [{ translateY }]
        }
      ]}>
        <View style={styles.bottomSheetHandle} />
        <ScrollView 
          style={styles.bottomSheetContent}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

// Snapchat-style Story Ring
export const StoryRing: React.FC<{
  size: number;
  progress: number;
  hasStory?: boolean;
  isViewed?: boolean;
  children: React.ReactNode;
  onPress?: () => void;
}> = ({ size, progress, hasStory, isViewed, children, onPress }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (hasStory && !isViewed) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [hasStory, isViewed]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const strokeColor = hasStory 
    ? (isViewed ? KlikdBrandSystem.colors.ui.soft_gray : KlikdBrandSystem.colors.primary.klikd_green)
    : 'transparent';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View style={[
        styles.storyRing,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ rotate }],
        }
      ]}>
        <View style={[
          styles.storyRingInner,
          {
            width: size - 4,
            height: size - 4,
            borderRadius: (size - 4) / 2,
            borderColor: strokeColor,
            borderWidth: hasStory ? 2 : 0,
          }
        ]}>
          <View style={[
            styles.storyContent,
            {
              width: size - 8,
              height: size - 8,
              borderRadius: (size - 8) / 2,
            }
          ]}>
            {children}
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// TikTok-style Floating Hearts Animation
export const FloatingHeart: React.FC<{
  onComplete: () => void;
}> = ({ onComplete }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -200,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: (Math.random() - 0.5) * 100,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 1800,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.delay(1000),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]).start(onComplete);
  }, []);

  return (
    <Animated.View style={[
      styles.floatingHeart,
      {
        transform: [
          { translateY },
          { translateX },
          { scale }
        ],
        opacity,
      }
    ]}>
      <Ionicons name="heart" size={24} color={KlikdBrandSystem.colors.primary.klikd_green} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // Swipeable Card
  swipeableCard: {
    width: screenWidth - 32,
    height: 200,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  cardTouchable: {
    flex: 1,
  },
  cardBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: KlikdBrandSystem.colors.ui.dark_bg,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    flex: 1,
    marginRight: 12,
    fontFamily: 'Inter',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: KlikdBrandSystem.colors.primary.klikd_green,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  xpText: {
    fontSize: 12,
    fontWeight: '700',
    color: KlikdBrandSystem.colors.primary.klikd_black,
    fontFamily: 'Inter',
  },
  cardDescription: {
    fontSize: 14,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    lineHeight: 20,
    fontFamily: 'Inter',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: 'white',
    fontFamily: 'Inter',
  },
  difficultyBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
    fontFamily: 'Inter',
  },
  swipeIndicators: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  swipeIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  swipeLeft: {
    backgroundColor: 'rgba(244, 67, 54, 0.8)',
  },
  swipeRight: {
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
  },
  swipeText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
    marginTop: 4,
    fontFamily: 'Inter',
  },

  // Action Button
  actionButton: {
    alignItems: 'center',
    marginVertical: 12,
    shadowColor: KlikdBrandSystem.colors.primary.klikd_green,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    elevation: 8,
  },
  actionButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  actionButtonActive: {
    backgroundColor: KlikdBrandSystem.colors.primary.klikd_green,
  },
  actionButtonCount: {
    position: 'absolute',
    bottom: -6,
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
    fontFamily: 'Inter',
  },
  actionButtonCountActive: {
    color: KlikdBrandSystem.colors.primary.klikd_black,
  },
  actionButtonLabel: {
    fontSize: 10,
    color: 'white',
    marginTop: 4,
    fontFamily: 'Inter',
  },

  // Bottom Sheet
  bottomSheetContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  bottomSheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: KlikdBrandSystem.colors.ui.dark_bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.9,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: KlikdBrandSystem.colors.ui.soft_gray,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  bottomSheetContent: {
    paddingHorizontal: 20,
    paddingBottom: 34,
  },

  // Story Ring
  storyRing: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyRingInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyContent: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Floating Heart
  floatingHeart: {
    position: 'absolute',
    bottom: 100,
    right: 20,
  },
});
