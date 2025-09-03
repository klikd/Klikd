// 1.1 Welcome Screen - First impression with Klikd branding
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { KlikdScreenContainer } from '../../components/KlikdScalableComponents';
import { ModernKlikdButton } from '../../design/FigmaModernUI';
import { KlikdBrandSystem } from '../../design/KlikdBrandSystem';
import { KlikdLogo } from '../../components/KlikdLogo';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface WelcomeScreenProps {
  navigation: any;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = () => {
    navigation.navigate('RoleSelection');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <KlikdScreenContainer backgroundColor={KlikdBrandSystem.colors.ui.dark_bg}>
      <View style={styles.container}>
        {/* Logo Section */}
        <Animated.View style={[
          styles.logoSection,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: logoScaleAnim }
            ]
          }
        ]}>
          <KlikdLogo size={120} variant="full-color" />
          <Text style={styles.brandName}>Klikd</Text>
          <Text style={styles.tagline}>Get Klikd. Get Rewarded.</Text>
        </Animated.View>

        {/* Welcome Content */}
        <Animated.View style={[
          styles.contentSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <Text style={styles.welcomeTitle}>
            Welcome to the Future of{'\n'}AR Social Commerce
          </Text>
          
          <Text style={styles.welcomeDescription}>
            Discover quests, collect AR treasures, and earn rewards while exploring the world around you. Join millions in the MENA region already getting Klikd!
          </Text>

          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>🎯</Text>
              <Text style={styles.featureText}>Complete AR Quests</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>💎</Text>
              <Text style={styles.featureText}>Collect Digital Treasures</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>🏆</Text>
              <Text style={styles.featureText}>Earn Real Rewards</Text>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View style={[
          styles.actionSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <ModernKlikdButton
            title="Get Started"
            variant="primary"
            size="large"
            icon="rocket"
            onPress={handleGetStarted}
            style={styles.primaryButton}
            glowEffect={true}
          />
          
          <ModernKlikdButton
            title="I Already Have an Account"
            variant="secondary"
            size="medium"
            icon="log-in"
            onPress={handleLogin}
            style={styles.secondaryButton}
          />
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🇸🇦 Made for the MENA Region
          </Text>
        </View>
      </View>
    </KlikdScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 60,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '700',
    color: KlikdBrandSystem.colors.primary.klikd_white,
    marginTop: 16,
    fontFamily: 'Inter',
  },
  tagline: {
    fontSize: 16,
    color: KlikdBrandSystem.colors.primary.klikd_green,
    marginTop: 8,
    fontFamily: 'Inter',
    fontWeight: '600',
  },
  contentSection: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: KlikdBrandSystem.colors.primary.klikd_white,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 20,
    fontFamily: 'Inter',
  },
  welcomeDescription: {
    fontSize: 16,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    fontFamily: 'Inter',
  },
  featuresContainer: {
    gap: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureText: {
    fontSize: 16,
    color: KlikdBrandSystem.colors.primary.klikd_white,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  actionSection: {
    gap: 16,
    paddingBottom: 20,
  },
  primaryButton: {
    marginBottom: 8,
  },
  secondaryButton: {
    marginBottom: 8,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    fontFamily: 'Inter',
  },
});
