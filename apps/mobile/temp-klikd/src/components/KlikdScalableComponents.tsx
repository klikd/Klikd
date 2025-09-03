// Klikd Scalable Component Library - For 350+ Screens
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { KlikdBrandSystem } from '../design/KlikdBrandSystem';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Universal Screen Container
export const KlikdScreenContainer: React.FC<{
  children: React.ReactNode;
  showHeader?: boolean;
  headerTitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  backgroundColor?: string;
  safeArea?: boolean;
}> = ({ 
  children, 
  showHeader = false, 
  headerTitle, 
  showBackButton = false, 
  onBackPress,
  backgroundColor = KlikdBrandSystem.colors.ui.dark_bg,
  safeArea = true 
}) => {
  return (
    <View style={[styles.screenContainer, { backgroundColor }]}>
      {showHeader && (
        <View style={styles.universalHeader}>
          {showBackButton && (
            <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          )}
          {headerTitle && (
            <Text style={styles.headerTitle}>{headerTitle}</Text>
          )}
        </View>
      )}
      <ScrollView 
        style={styles.contentArea}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={safeArea ? styles.safeContent : undefined}
      >
        {children}
      </ScrollView>
    </View>
  );
};

// Universal Form Components
export const KlikdFormField: React.FC<{
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  icon?: string;
  required?: boolean;
  error?: string;
}> = ({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry, 
  keyboardType = 'default',
  icon,
  required,
  error 
}) => {
  return (
    <View style={styles.formField}>
      <Text style={styles.fieldLabel}>
        {label}
        {required && <Text style={styles.requiredAsterisk}> *</Text>}
      </Text>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        {icon && (
          <Ionicons 
            name={icon as any} 
            size={20} 
            color={KlikdBrandSystem.colors.ui.soft_gray}
            style={styles.inputIcon}
          />
        )}
        <TextInput
          style={[styles.textInput, icon && styles.textInputWithIcon]}
          placeholder={placeholder}
          placeholderTextColor={KlikdBrandSystem.colors.ui.soft_gray}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// Universal Card Component
export const KlikdCard: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'quest' | 'profile';
  onPress?: () => void;
  style?: any;
  glowEffect?: boolean;
}> = ({ children, variant = 'default', onPress, style, glowEffect }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (onPress) {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
        tension: 300,
        friction: 8,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 8,
      }).start();
    }
  };

  const getCardStyle = () => {
    const baseStyle = styles.card;
    switch (variant) {
      case 'elevated':
        return [baseStyle, styles.cardElevated];
      case 'outlined':
        return [baseStyle, styles.cardOutlined];
      case 'quest':
        return [baseStyle, styles.cardQuest];
      case 'profile':
        return [baseStyle, styles.cardProfile];
      default:
        return baseStyle;
    }
  };

  const CardContent = (
    <Animated.View style={[
      getCardStyle(),
      { transform: [{ scale: scaleAnim }] },
      glowEffect && styles.cardGlow,
      style
    ]}>
      {children}
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
};

// Universal List Component
export const KlikdList: React.FC<{
  data: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  keyExtractor?: (item: any, index: number) => string;
  horizontal?: boolean;
  showsScrollIndicator?: boolean;
  contentContainerStyle?: any;
}> = ({ 
  data, 
  renderItem, 
  keyExtractor = (_, index) => index.toString(),
  horizontal = false,
  showsScrollIndicator = false,
  contentContainerStyle 
}) => {
  return (
    <ScrollView
      horizontal={horizontal}
      showsHorizontalScrollIndicator={showsScrollIndicator}
      showsVerticalScrollIndicator={showsScrollIndicator}
      contentContainerStyle={contentContainerStyle}
    >
      {data.map((item, index) => (
        <View key={keyExtractor(item, index)}>
          {renderItem(item, index)}
        </View>
      ))}
    </ScrollView>
  );
};

// Universal Badge Component
export const KlikdBadge: React.FC<{
  text: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'premium' | 'xp';
  size?: 'small' | 'medium' | 'large';
  icon?: string;
}> = ({ text, variant = 'info', size = 'medium', icon }) => {
  const getBadgeStyle = () => {
    const baseStyle = styles.badge;
    const sizeStyle = size === 'small' ? styles.badgeSmall : 
                    size === 'large' ? styles.badgeLarge : styles.badgeMedium;
    
    let variantStyle;
    switch (variant) {
      case 'success':
        variantStyle = styles.badgeSuccess;
        break;
      case 'warning':
        variantStyle = styles.badgeWarning;
        break;
      case 'error':
        variantStyle = styles.badgeError;
        break;
      case 'premium':
        variantStyle = styles.badgePremium;
        break;
      case 'xp':
        variantStyle = styles.badgeXP;
        break;
      default:
        variantStyle = styles.badgeInfo;
    }
    
    return [baseStyle, sizeStyle, variantStyle];
  };

  const getTextColor = () => {
    switch (variant) {
      case 'success':
      case 'premium':
      case 'xp':
        return KlikdBrandSystem.colors.primary.klikd_black;
      default:
        return 'white';
    }
  };

  return (
    <View style={getBadgeStyle()}>
      {icon && (
        <Ionicons 
          name={icon as any} 
          size={size === 'small' ? 12 : size === 'large' ? 18 : 14} 
          color={getTextColor()}
          style={styles.badgeIcon}
        />
      )}
      <Text style={[
        styles.badgeText,
        { 
          color: getTextColor(),
          fontSize: size === 'small' ? 10 : size === 'large' ? 14 : 12
        }
      ]}>
        {text}
      </Text>
    </View>
  );
};

// Universal Progress Component
export const KlikdProgress: React.FC<{
  progress: number; // 0-1
  height?: number;
  showPercentage?: boolean;
  animated?: boolean;
  color?: string;
  backgroundColor?: string;
}> = ({ 
  progress, 
  height = 8, 
  showPercentage = false, 
  animated = true,
  color = KlikdBrandSystem.colors.primary.klikd_green,
  backgroundColor = 'rgba(255,255,255,0.2)'
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (animated) {
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    } else {
      progressAnim.setValue(progress);
    }
  }, [progress, animated]);

  const width = animated ? 
    progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    }) : `${progress * 100}%`;

  return (
    <View style={styles.progressContainer}>
      <View style={[styles.progressTrack, { height, backgroundColor }]}>
        <Animated.View style={[
          styles.progressFill,
          { height, backgroundColor: color, width }
        ]} />
      </View>
      {showPercentage && (
        <Text style={styles.progressText}>
          {Math.round(progress * 100)}%
        </Text>
      )}
    </View>
  );
};

// Universal Avatar Component
export const KlikdAvatar: React.FC<{
  size: number;
  source?: any;
  initials?: string;
  online?: boolean;
  tier?: string;
  onPress?: () => void;
}> = ({ size, source, initials, online, tier, onPress }) => {
  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const getTierBorderColor = () => {
    switch (tier) {
      case 'premium': return KlikdBrandSystem.colors.primary.klikd_green;
      case 'luxury': return '#FFD700';
      case 'elite': return '#FF6B6B';
      default: return 'transparent';
    }
  };

  const AvatarContent = (
    <View style={[styles.avatarContainer, avatarStyle]}>
      <View style={[
        styles.avatarInner,
        avatarStyle,
        tier && { borderWidth: 2, borderColor: getTierBorderColor() }
      ]}>
        {source ? (
          <Image source={source} style={avatarStyle} />
        ) : (
          <View style={[styles.avatarPlaceholder, avatarStyle]}>
            <Text style={[styles.avatarInitials, { fontSize: size * 0.4 }]}>
              {initials || '?'}
            </Text>
          </View>
        )}
      </View>
      {online && (
        <View style={[styles.onlineIndicator, { 
          width: size * 0.25, 
          height: size * 0.25,
          borderRadius: size * 0.125,
          bottom: size * 0.05,
          right: size * 0.05,
        }]} />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress}>
        {AvatarContent}
      </TouchableOpacity>
    );
  }

  return AvatarContent;
};

const styles = StyleSheet.create({
  // Screen Container
  screenContainer: {
    flex: 1,
  },
  universalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 44,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    fontFamily: 'Inter',
  },
  contentArea: {
    flex: 1,
  },
  safeContent: {
    paddingHorizontal: 16,
    paddingBottom: 34,
  },

  // Form Components
  formField: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  requiredAsterisk: {
    color: KlikdBrandSystem.colors.primary.klikd_green,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  inputIcon: {
    marginLeft: 12,
  },
  textInput: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: 'white',
    fontFamily: 'Inter',
  },
  textInputWithIcon: {
    paddingLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#FF6B6B',
    marginTop: 4,
    fontFamily: 'Inter',
  },

  // Card Components
  card: {
    backgroundColor: KlikdBrandSystem.colors.ui.dark_bg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardElevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardOutlined: {
    borderWidth: 1,
    borderColor: '#333',
  },
  cardQuest: {
    borderLeftWidth: 4,
    borderLeftColor: KlikdBrandSystem.colors.primary.klikd_green,
  },
  cardProfile: {
    backgroundColor: 'rgba(236, 255, 0, 0.1)',
    borderWidth: 1,
    borderColor: KlikdBrandSystem.colors.primary.klikd_green,
  },
  cardGlow: {
    shadowColor: KlikdBrandSystem.colors.primary.klikd_green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },

  // Badge Components
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeMedium: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeLarge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeSuccess: {
    backgroundColor: '#4CAF50',
  },
  badgeWarning: {
    backgroundColor: '#FF9800',
  },
  badgeError: {
    backgroundColor: '#FF6B6B',
  },
  badgeInfo: {
    backgroundColor: '#2196F3',
  },
  badgePremium: {
    backgroundColor: KlikdBrandSystem.colors.primary.klikd_green,
  },
  badgeXP: {
    backgroundColor: '#FFD700',
  },
  badgeIcon: {
    marginRight: 4,
  },
  badgeText: {
    fontWeight: '700',
    fontFamily: 'Inter',
  },

  // Progress Components
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Inter',
  },

  // Avatar Components
  avatarContainer: {
    position: 'relative',
  },
  avatarInner: {
    overflow: 'hidden',
  },
  avatarPlaceholder: {
    backgroundColor: KlikdBrandSystem.colors.ui.soft_gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontWeight: '700',
    color: 'white',
    fontFamily: 'Inter',
  },
  onlineIndicator: {
    position: 'absolute',
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: KlikdBrandSystem.colors.ui.dark_bg,
  },
});
