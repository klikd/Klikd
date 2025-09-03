// Figma MCP Modern UI System - Klikd Brand Guidelines Implementation
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  ImageBackground,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { KlikdBrandSystem } from './KlikdBrandSystem';
import { KlikdLogo } from '../components/KlikdLogo';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Modern Klikd UI Components based on brand guidelines
export const ModernKlikdButton: React.FC<{
  title: string;
  variant?: 'primary' | 'secondary' | 'cta' | 'cultural' | 'neon';
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  onPress?: () => void;
  style?: any;
  glowEffect?: boolean;
}> = ({ 
  title, 
  variant = 'primary', 
  size = 'medium', 
  icon, 
  onPress, 
  style,
  glowEffect = false 
}) => {
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
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

  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: 12,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingHorizontal: size === 'small' ? 16 : size === 'large' ? 32 : 24,
      paddingVertical: size === 'small' ? 8 : size === 'large' ? 16 : 12,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: KlikdBrandSystem.colors.primary.klikd_green,
          ...KlikdBrandSystem.shadows.md,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: KlikdBrandSystem.colors.primary.klikd_green,
        };
      case 'cta':
        return {
          ...baseStyle,
          backgroundColor: KlikdBrandSystem.colors.ui.link_cta,
          ...KlikdBrandSystem.shadows.md,
        };
      case 'cultural':
        return {
          ...baseStyle,
          backgroundColor: KlikdBrandSystem.colors.tiers.creator_luxury,
          ...KlikdBrandSystem.shadows.md,
        };
      case 'neon':
        return {
          ...baseStyle,
          backgroundColor: KlikdBrandSystem.colors.primary.klikd_black,
          borderWidth: 2,
          borderColor: KlikdBrandSystem.colors.primary.klikd_green,
          ...KlikdBrandSystem.shadows.glow,
        };
      default:
        return baseStyle;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return KlikdBrandSystem.colors.primary.klikd_black;
      case 'secondary':
        return KlikdBrandSystem.colors.primary.klikd_green;
      case 'neon':
        return KlikdBrandSystem.colors.primary.klikd_green;
      default:
        return KlikdBrandSystem.colors.primary.klikd_white;
    }
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        style={[getButtonStyle(), glowEffect && KlikdBrandSystem.shadows.glow]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        {icon && (
          <Ionicons 
            name={icon as any} 
            size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
            color={getTextColor()} 
            style={{ marginRight: 8 }}
          />
        )}
        <Text style={[
          styles.buttonText,
          {
            color: getTextColor(),
            fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
            fontWeight: '700',
          }
        ]}>
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Modern Quest Card with TikTok-style interactions
export const ModernQuestCard: React.FC<{
  title: string;
  description: string;
  xp: number;
  difficulty: 'easy' | 'medium' | 'hard';
  participants: number;
  timeLeft: string;
  category: string;
  onPress?: () => void;
  onJoin?: () => void;
}> = ({ 
  title, 
  description, 
  xp, 
  difficulty, 
  participants, 
  timeLeft, 
  category,
  onPress,
  onJoin 
}) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [glowAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Subtle glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return KlikdBrandSystem.colors.primary.klikd_green;
    }
  };

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onPress?.();
  };

  return (
    <Animated.View style={[
      styles.questCard,
      {
        transform: [{ scale: scaleAnim }],
        shadowColor: KlikdBrandSystem.colors.primary.klikd_green,
        shadowOpacity: glowAnim,
      }
    ]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        {/* Quest Header */}
        <View style={styles.questHeader}>
          <View style={styles.questTitleSection}>
            <Text style={styles.questTitle}>{title}</Text>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor() }]}>
              <Text style={styles.difficultyText}>{difficulty.toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.questXP}>
            <Ionicons name="star" size={16} color={KlikdBrandSystem.colors.primary.klikd_green} />
            <Text style={styles.xpText}>{xp} XP</Text>
          </View>
        </View>

        {/* Quest Description */}
        <Text style={styles.questDescription}>{description}</Text>

        {/* Quest Stats */}
        <View style={styles.questStats}>
          <View style={styles.statItem}>
            <Ionicons name="people" size={14} color={KlikdBrandSystem.colors.ui.soft_gray} />
            <Text style={styles.statText}>{participants} joined</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="time" size={14} color={KlikdBrandSystem.colors.ui.soft_gray} />
            <Text style={styles.statText}>{timeLeft}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="pricetag" size={14} color={KlikdBrandSystem.colors.ui.soft_gray} />
            <Text style={styles.statText}>{category}</Text>
          </View>
        </View>

        {/* Join Button */}
        <ModernKlikdButton
          title="Join Quest"
          variant="primary"
          size="small"
          icon="flash"
          onPress={onJoin}
          style={styles.joinButton}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

// Modern Header with Klikd branding
export const ModernKlikdHeader: React.FC<{
  title?: string;
  showLogo?: boolean;
  showNotifications?: boolean;
  showProfile?: boolean;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
  backgroundColor?: string;
}> = ({
  title,
  showLogo = true,
  showNotifications = true,
  showProfile = true,
  onNotificationPress,
  onProfilePress,
  backgroundColor = KlikdBrandSystem.colors.ui.dark_bg
}) => {
  return (
    <View style={[styles.modernHeader, { backgroundColor }]}>
      <StatusBar barStyle="light-content" backgroundColor={backgroundColor} />
      
      {/* Left Section */}
      <View style={styles.headerLeft}>
        {showLogo && (
          <KlikdLogo size={32} variant="icon-only" />
        )}
        {title && !showLogo && (
          <Text style={styles.headerTitle}>{title}</Text>
        )}
      </View>

      {/* Center Section */}
      <View style={styles.headerCenter}>
        {title && showLogo && (
          <Text style={styles.headerTitle}>{title}</Text>
        )}
      </View>

      {/* Right Section */}
      <View style={styles.headerRight}>
        {showNotifications && (
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={onNotificationPress}
          >
            <Ionicons name="notifications" size={24} color="white" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        )}
        {showProfile && (
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={onProfilePress}
          >
            <View style={styles.profileAvatar}>
              <Ionicons name="person" size={20} color={KlikdBrandSystem.colors.primary.klikd_black} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Modern Tab Bar with Klikd styling
export const ModernKlikdTabBar: React.FC<{
  activeTab: string;
  onTabPress: (tab: string) => void;
}> = ({ activeTab, onTabPress }) => {
  const tabs = [
    { key: 'feed', icon: 'home', label: 'Feed' },
    { key: 'camera', icon: 'camera', label: 'Scan' },
    { key: 'map', icon: 'map', label: 'Zones' },
    { key: 'missions', icon: 'flash', label: 'Quests' },
    { key: 'profile', icon: 'person', label: 'Profile' },
  ];

  return (
    <View style={styles.modernTabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={styles.tabItem}
          onPress={() => onTabPress(tab.key)}
          activeOpacity={0.7}
        >
          <View style={[
            styles.tabIconContainer,
            activeTab === tab.key && styles.activeTabIconContainer
          ]}>
            <Ionicons 
              name={tab.icon as any} 
              size={24} 
              color={activeTab === tab.key 
                ? KlikdBrandSystem.colors.primary.klikd_black 
                : KlikdBrandSystem.colors.ui.soft_gray
              } 
            />
          </View>
          <Text style={[
            styles.tabLabel,
            activeTab === tab.key && styles.activeTabLabel
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Modern Floating Action Button
export const ModernFloatingButton: React.FC<{
  icon: string;
  onPress: () => void;
  variant?: 'primary' | 'camera' | 'quest';
  size?: number;
}> = ({ icon, onPress, variant = 'primary', size = 56 }) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [rotateAnim] = useState(new Animated.Value(0));

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        useNativeDriver: true,
        tension: 300,
        friction: 8,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 8,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getButtonStyle = () => {
    switch (variant) {
      case 'camera':
        return {
          backgroundColor: KlikdBrandSystem.colors.primary.klikd_green,
          borderWidth: 4,
          borderColor: KlikdBrandSystem.colors.primary.klikd_white,
        };
      case 'quest':
        return {
          backgroundColor: KlikdBrandSystem.colors.ui.link_cta,
          borderWidth: 2,
          borderColor: KlikdBrandSystem.colors.primary.klikd_green,
        };
      default:
        return {
          backgroundColor: KlikdBrandSystem.colors.primary.klikd_green,
        };
    }
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '15deg'],
  });

  return (
    <Animated.View style={[
      styles.floatingButton,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        transform: [{ scale: scaleAnim }, { rotate }],
        ...getButtonStyle(),
        ...KlikdBrandSystem.shadows.lg,
      }
    ]}>
      <TouchableOpacity
        style={styles.floatingButtonInner}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <Ionicons 
          name={icon as any} 
          size={size * 0.4} 
          color={variant === 'camera' 
            ? KlikdBrandSystem.colors.primary.klikd_black 
            : KlikdBrandSystem.colors.primary.klikd_white
          } 
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // Button styles
  buttonText: {
    fontFamily: 'Inter',
    fontWeight: '700',
  },

  // Quest Card styles
  questCard: {
    backgroundColor: KlikdBrandSystem.colors.ui.dark_bg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: KlikdBrandSystem.colors.primary.klikd_green,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  questTitleSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  questTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: KlikdBrandSystem.colors.primary.klikd_white,
    flex: 1,
    fontFamily: 'Inter',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
    fontFamily: 'Inter',
  },
  questXP: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  xpText: {
    fontSize: 14,
    fontWeight: '600',
    color: KlikdBrandSystem.colors.primary.klikd_green,
    fontFamily: 'Inter',
  },
  questDescription: {
    fontSize: 14,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    marginBottom: 16,
    lineHeight: 20,
    fontFamily: 'Inter',
  },
  questStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    fontFamily: 'Inter',
  },
  joinButton: {
    alignSelf: 'flex-start',
  },

  // Header styles
  modernHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 44, // Status bar height
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: KlikdBrandSystem.colors.primary.klikd_white,
    fontFamily: 'Inter',
  },
  headerButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: KlikdBrandSystem.colors.primary.klikd_green,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: KlikdBrandSystem.colors.primary.klikd_black,
    fontFamily: 'Inter',
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: KlikdBrandSystem.colors.primary.klikd_green,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Tab Bar styles
  modernTabBar: {
    flexDirection: 'row',
    backgroundColor: KlikdBrandSystem.colors.ui.dark_bg,
    paddingVertical: 8,
    paddingBottom: 20, // Safe area bottom
    borderTopWidth: 1,
    borderTopColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeTabIconContainer: {
    backgroundColor: KlikdBrandSystem.colors.primary.klikd_green,
  },
  tabLabel: {
    fontSize: 10,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  activeTabLabel: {
    color: KlikdBrandSystem.colors.primary.klikd_green,
    fontWeight: '700',
  },

  // Floating Button styles
  floatingButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Components are exported inline above
