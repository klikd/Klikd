// Klikd™ Origami Crown Logo Component
// Based on official brand guidelines with geometric crown construction
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export interface KlikdLogoProps {
  size?: number;
  variant?: 'full-color' | 'icon-only' | 'inverted' | 'monochrome';
  style?: any;
}

export const KlikdLogo: React.FC<KlikdLogoProps> = ({
  size = 48,
  variant = 'full-color',
  style
}) => {
  // Brand colors from guidelines
  const colors = {
    klikdGreen: '#ECFF00',
    klikdBlack: '#0B0B0B',
    klikdWhite: '#FFFFFF',
    strokeDark: '#0D0D0D'
  };

  // Get colors based on variant
  const getColors = () => {
    switch (variant) {
      case 'full-color':
        return {
          background: colors.klikdGreen,
          fill: colors.klikdWhite,
          stroke: colors.strokeDark
        };
      case 'inverted':
        return {
          background: colors.klikdBlack,
          fill: colors.klikdWhite,
          stroke: colors.klikdWhite
        };
      case 'monochrome':
        return {
          background: 'transparent',
          fill: colors.klikdBlack,
          stroke: colors.klikdBlack
        };
      case 'icon-only':
      default:
        return {
          background: 'transparent',
          fill: colors.klikdWhite,
          stroke: colors.strokeDark
        };
    }
  };

  const logoColors = getColors();

  // Create origami crown using geometric shapes
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      {variant === 'full-color' && (
        <View 
          style={[
            styles.background, 
            { 
              backgroundColor: logoColors.background,
              width: size,
              height: size,
              borderRadius: size * 0.2 // 20% border radius for app icon
            }
          ]} 
        />
      )}
      
      {/* Origami Crown using geometric View components */}
      <View style={[
        styles.crown,
        {
          width: size * 0.8,
          height: size * 0.6,
        }
      ]}>
        {/* Left Triangle */}
        <View style={[
          styles.triangle,
          styles.leftTriangle,
          {
            borderBottomColor: logoColors.fill,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomWidth: size * 0.3,
            borderLeftWidth: size * 0.15,
            borderRightWidth: size * 0.15,
            left: 0,
          }
        ]} />
        
        {/* Center Triangle */}
        <View style={[
          styles.triangle,
          styles.centerTriangle,
          {
            borderBottomColor: logoColors.fill,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomWidth: size * 0.35,
            borderLeftWidth: size * 0.15,
            borderRightWidth: size * 0.15,
            left: size * 0.25,
            top: -size * 0.05,
          }
        ]} />
        
        {/* Right Triangle */}
        <View style={[
          styles.triangle,
          styles.rightTriangle,
          {
            borderBottomColor: logoColors.fill,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomWidth: size * 0.3,
            borderLeftWidth: size * 0.15,
            borderRightWidth: size * 0.15,
            right: 0,
          }
        ]} />
        
        {/* Crown Base */}
        <View style={[
          styles.crownBase,
          {
            backgroundColor: logoColors.fill,
            height: size * 0.08,
            width: size * 0.8,
            bottom: 0,
            borderColor: logoColors.stroke,
            borderWidth: 1,
          }
        ]} />
      </View>
      
      {/* Crown outline/stroke effect */}
      <View style={[
        styles.crownOutline,
        {
          width: size * 0.8,
          height: size * 0.6,
          borderColor: logoColors.stroke,
          borderWidth: 2,
          borderRadius: 4,
        }
      ]} />
    </View>
  );
};

// Horizontal lockup with wordmark
export const KlikdHorizontalLogo: React.FC<KlikdLogoProps & { showWordmark?: boolean }> = ({
  size = 48,
  variant = 'full-color',
  showWordmark = true,
  style
}) => {
  const colors = {
    klikdGreen: '#ECFF00',
    klikdBlack: '#0B0B0B',
    klikdWhite: '#FFFFFF'
  };

  return (
    <View style={[styles.horizontalContainer, style]}>
      <KlikdLogo size={size} variant={variant} />
      {showWordmark && (
        <Text style={[
          styles.wordmarkText,
          {
            fontSize: size * 0.4,
            color: variant === 'inverted' ? colors.klikdWhite : colors.klikdBlack,
            fontWeight: '700',
          }
        ]}>
          KLIKD
        </Text>
      )}
    </View>
  );
};

// App icon variant with proper iOS/Android specifications
export const KlikdAppIcon: React.FC<{ size?: number }> = ({ size = 1024 }) => {
  return (
    <View style={[styles.appIcon, { width: size, height: size }]}>
      <View 
        style={[
          styles.appIconBackground,
          {
            width: size,
            height: size,
            borderRadius: size * 0.2237, // iOS app icon border radius
            backgroundColor: '#ECFF00'
          }
        ]}
      />
      <View style={styles.appIconContent}>
        <KlikdLogo 
          size={size * 0.6} 
          variant="icon-only"
          style={{ position: 'absolute' }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  crown: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  triangle: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
  },
  leftTriangle: {
    top: 0,
  },
  centerTriangle: {
    top: 0,
  },
  rightTriangle: {
    top: 0,
  },
  crownBase: {
    position: 'absolute',
  },
  crownOutline: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  wordmarkText: {
    fontFamily: 'Inter',
    letterSpacing: 2,
  },
  appIcon: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appIconBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  appIconContent: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default KlikdLogo;
