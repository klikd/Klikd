// Enhanced UI Components using Figma Design System
// Improved visual design for Klikd platform

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { klikdDesignSystem } from './FigmaIntegration';

interface EnhancedMissionCardProps {
  title: string;
  description: string;
  xp: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  participants?: number;
  timeLeft?: string;
  onPress: () => void;
}

export const EnhancedMissionCard: React.FC<EnhancedMissionCardProps> = ({
  title,
  description,
  xp,
  difficulty,
  category,
  participants = 0,
  timeLeft,
  onPress
}) => {
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return klikdDesignSystem.colors.primary.klikd_green;
      case 'medium': return klikdDesignSystem.colors.primary.klikd_orange;
      case 'hard': return klikdDesignSystem.colors.primary.klikd_red;
      default: return klikdDesignSystem.colors.neutral.light_gray;
    }
  };

  return (
    <TouchableOpacity style={styles.missionCard} onPress={onPress}>
      {/* Header with category and difficulty */}
      <View style={styles.missionHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: getDifficultyColor() }]}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
        <View style={styles.difficultyIndicator}>
          <Text style={[styles.difficultyText, { color: getDifficultyColor() }]}>
            {difficulty.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Mission content */}
      <Text style={styles.missionTitle}>{title}</Text>
      <Text style={styles.missionDescription}>{description}</Text>

      {/* Mission stats */}
      <View style={styles.missionStats}>
        <View style={styles.statItem}>
          <Ionicons name="star" size={16} color={klikdDesignSystem.colors.primary.klikd_gold} />
          <Text style={styles.statText}>{xp} XP</Text>
        </View>
        
        {participants > 0 && (
          <View style={styles.statItem}>
            <Ionicons name="people" size={16} color={klikdDesignSystem.colors.neutral.light_gray} />
            <Text style={styles.statText}>{participants}</Text>
          </View>
        )}
        
        {timeLeft && (
          <View style={styles.statItem}>
            <Ionicons name="time" size={16} color={klikdDesignSystem.colors.neutral.light_gray} />
            <Text style={styles.statText}>{timeLeft}</Text>
          </View>
        )}
      </View>

      {/* Action indicator */}
      <View style={styles.actionIndicator}>
        <Ionicons name="chevron-forward" size={20} color={klikdDesignSystem.colors.primary.klikd_blue} />
      </View>
    </TouchableOpacity>
  );
};

interface EnhancedAvatarProps {
  size: 'small' | 'medium' | 'large';
  imageUrl?: string;
  status?: 'online' | 'offline' | 'away';
  badge?: boolean;
  level?: number;
  onPress?: () => void;
}

export const EnhancedAvatar: React.FC<EnhancedAvatarProps> = ({
  size,
  imageUrl,
  status = 'offline',
  badge = false,
  level,
  onPress
}) => {
  const getAvatarSize = () => {
    switch (size) {
      case 'small': return 40;
      case 'medium': return 60;
      case 'large': return 80;
      default: return 60;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'online': return klikdDesignSystem.colors.primary.klikd_green;
      case 'away': return klikdDesignSystem.colors.primary.klikd_orange;
      case 'offline': return klikdDesignSystem.colors.neutral.medium_gray;
      default: return klikdDesignSystem.colors.neutral.medium_gray;
    }
  };

  const avatarSize = getAvatarSize();

  return (
    <TouchableOpacity 
      style={[styles.avatarContainer, { width: avatarSize, height: avatarSize }]}
      onPress={onPress}
      disabled={!onPress}
    >
      {/* Avatar image placeholder */}
      <View style={[
        styles.avatarImage, 
        { 
          width: avatarSize, 
          height: avatarSize,
          borderRadius: avatarSize / 2 
        }
      ]}>
        <Ionicons 
          name="person" 
          size={avatarSize * 0.6} 
          color={klikdDesignSystem.colors.neutral.light_gray} 
        />
      </View>

      {/* Status indicator */}
      <View style={[
        styles.statusIndicator,
        {
          backgroundColor: getStatusColor(),
          width: avatarSize * 0.25,
          height: avatarSize * 0.25,
          borderRadius: (avatarSize * 0.25) / 2,
          bottom: 0,
          right: 0
        }
      ]} />

      {/* Level badge */}
      {badge && level && (
        <View style={[styles.levelBadge, { top: -8, right: -8 }]}>
          <Text style={styles.levelText}>{level}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

interface EnhancedButtonProps {
  title: string;
  variant: 'primary' | 'secondary' | 'cultural' | 'danger';
  size: 'small' | 'medium' | 'large';
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  title,
  variant,
  size,
  icon,
  disabled = false,
  loading = false,
  onPress
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle = {
      borderRadius: klikdDesignSystem.borderRadius.lg,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      ...klikdDesignSystem.shadows.md,
    };

    const sizeStyles = {
      small: { paddingHorizontal: 12, paddingVertical: 8 },
      medium: { paddingHorizontal: 16, paddingVertical: 12 },
      large: { paddingHorizontal: 24, paddingVertical: 16 }
    };

    const variantStyles = {
      primary: { backgroundColor: klikdDesignSystem.colors.primary.klikd_blue },
      secondary: { 
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: klikdDesignSystem.colors.primary.klikd_blue
      },
      cultural: { backgroundColor: klikdDesignSystem.colors.cultural.saudi_green },
      danger: { backgroundColor: klikdDesignSystem.colors.primary.klikd_red }
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      opacity: disabled ? 0.6 : 1
    };
  };

  const getTextStyle = (): TextStyle => {
    const sizeStyles = {
      small: { fontSize: 14 },
      medium: { fontSize: 16 },
      large: { fontSize: 18 }
    };

    const variantStyles = {
      primary: { color: klikdDesignSystem.colors.neutral.white },
      secondary: { color: klikdDesignSystem.colors.primary.klikd_blue },
      cultural: { color: klikdDesignSystem.colors.neutral.white },
      danger: { color: klikdDesignSystem.colors.neutral.white }
    };

    return {
      fontWeight: '600',
      ...sizeStyles[size],
      ...variantStyles[variant]
    };
  };

  return (
    <TouchableOpacity 
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {icon && (
        <Ionicons 
          name={icon as any} 
          size={size === 'small' ? 16 : size === 'medium' ? 20 : 24} 
          color={getTextStyle().color}
          style={{ marginRight: 8 }}
        />
      )}
      <Text style={getTextStyle()}>{loading ? 'Loading...' : title}</Text>
    </TouchableOpacity>
  );
};

interface EnhancedStatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: string;
}

export const EnhancedStatsCard: React.FC<EnhancedStatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  color = klikdDesignSystem.colors.primary.klikd_blue
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return klikdDesignSystem.colors.primary.klikd_green;
      case 'down': return klikdDesignSystem.colors.primary.klikd_red;
      case 'neutral': return klikdDesignSystem.colors.neutral.light_gray;
      default: return klikdDesignSystem.colors.neutral.light_gray;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return 'trending-up';
      case 'down': return 'trending-down';
      case 'neutral': return 'remove';
      default: return 'remove';
    }
  };

  return (
    <View style={styles.statsCard}>
      <View style={styles.statsHeader}>
        <View style={[styles.statsIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon as any} size={24} color={color} />
        </View>
        {trend && trendValue && (
          <View style={styles.trendContainer}>
            <Ionicons 
              name={getTrendIcon() as any} 
              size={16} 
              color={getTrendColor()} 
            />
            <Text style={[styles.trendText, { color: getTrendColor() }]}>
              {trendValue}
            </Text>
          </View>
        )}
      </View>
      
      <Text style={styles.statsValue}>{value}</Text>
      <Text style={styles.statsTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  // Mission Card Styles
  missionCard: {
    backgroundColor: klikdDesignSystem.colors.neutral.dark_gray,
    borderRadius: klikdDesignSystem.borderRadius.lg,
    padding: klikdDesignSystem.spacing.lg,
    marginBottom: klikdDesignSystem.spacing.md,
    ...klikdDesignSystem.shadows.md,
    borderLeftWidth: 4,
    borderLeftColor: klikdDesignSystem.colors.primary.klikd_blue,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: klikdDesignSystem.spacing.md,
  },
  categoryBadge: {
    paddingHorizontal: klikdDesignSystem.spacing.sm,
    paddingVertical: klikdDesignSystem.spacing.xs,
    borderRadius: klikdDesignSystem.borderRadius.md,
  },
  categoryText: {
    fontSize: klikdDesignSystem.typography.sizes.xs,
    fontWeight: '600',
    color: klikdDesignSystem.colors.neutral.white,
  },
  difficultyIndicator: {
    paddingHorizontal: klikdDesignSystem.spacing.sm,
  },
  difficultyText: {
    fontSize: klikdDesignSystem.typography.sizes.xs,
    fontWeight: '700',
  },
  missionTitle: {
    fontSize: klikdDesignSystem.typography.sizes.lg,
    fontWeight: '600',
    color: klikdDesignSystem.colors.neutral.white,
    marginBottom: klikdDesignSystem.spacing.sm,
  },
  missionDescription: {
    fontSize: klikdDesignSystem.typography.sizes.sm,
    color: klikdDesignSystem.colors.neutral.light_gray,
    marginBottom: klikdDesignSystem.spacing.md,
    lineHeight: 20,
  },
  missionStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: klikdDesignSystem.spacing.md,
    marginBottom: klikdDesignSystem.spacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: klikdDesignSystem.typography.sizes.sm,
    color: klikdDesignSystem.colors.neutral.light_gray,
    fontWeight: '500',
  },
  actionIndicator: {
    position: 'absolute',
    top: klikdDesignSystem.spacing.lg,
    right: klikdDesignSystem.spacing.lg,
  },

  // Avatar Styles
  avatarContainer: {
    position: 'relative',
  },
  avatarImage: {
    backgroundColor: klikdDesignSystem.colors.neutral.medium_gray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: klikdDesignSystem.colors.primary.klikd_blue,
  },
  statusIndicator: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: klikdDesignSystem.colors.neutral.white,
  },
  levelBadge: {
    position: 'absolute',
    backgroundColor: klikdDesignSystem.colors.primary.klikd_gold,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: klikdDesignSystem.colors.neutral.white,
  },
  levelText: {
    fontSize: 10,
    fontWeight: '700',
    color: klikdDesignSystem.colors.neutral.white,
  },

  // Stats Card Styles
  statsCard: {
    backgroundColor: klikdDesignSystem.colors.neutral.dark_gray,
    borderRadius: klikdDesignSystem.borderRadius.lg,
    padding: klikdDesignSystem.spacing.lg,
    ...klikdDesignSystem.shadows.sm,
    flex: 1,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: klikdDesignSystem.spacing.md,
  },
  statsIcon: {
    width: 48,
    height: 48,
    borderRadius: klikdDesignSystem.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: klikdDesignSystem.typography.sizes.xs,
    fontWeight: '600',
  },
  statsValue: {
    fontSize: klikdDesignSystem.typography.sizes.xxl,
    fontWeight: '700',
    color: klikdDesignSystem.colors.neutral.white,
    marginBottom: 4,
  },
  statsTitle: {
    fontSize: klikdDesignSystem.typography.sizes.sm,
    color: klikdDesignSystem.colors.neutral.light_gray,
    fontWeight: '500',
  },
});
