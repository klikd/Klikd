// 1.2 Role Selection Screen - Brand, Influencer, Collector
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { KlikdScreenContainer, KlikdCard } from '../../components/KlikdScalableComponents';
import { ModernKlikdButton } from '../../design/FigmaModernUI';
import { KlikdBrandSystem } from '../../design/KlikdBrandSystem';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

interface RoleSelectionScreenProps {
  navigation: any;
}

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const slideAnim = useRef(new Animated.Value(30)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const roles = [
    {
      id: 'collector',
      title: 'Explorer/Collector',
      subtitle: 'Discover & Collect',
      description: 'Complete quests, collect AR treasures, and earn rewards while exploring your city.',
      icon: 'compass',
      color: KlikdBrandSystem.colors.primary.klikd_green,
      benefits: ['Complete AR Quests', 'Collect Digital Items', 'Earn Coins & XP', 'Unlock Rewards'],
      popular: true,
    },
    {
      id: 'influencer',
      title: 'Creator/Influencer',
      subtitle: 'Create & Influence',
      description: 'Create engaging content, collaborate with brands, and monetize your influence.',
      icon: 'star',
      color: '#FFD700',
      benefits: ['Create Quests', 'Brand Partnerships', 'Monetize Content', 'Build Community'],
      popular: false,
    },
    {
      id: 'brand',
      title: 'Brand/Business',
      subtitle: 'Engage & Grow',
      description: 'Launch campaigns, engage customers, and drive foot traffic with AR experiences.',
      icon: 'business',
      color: '#FF6B6B',
      benefits: ['Launch Campaigns', 'Customer Engagement', 'Analytics & Insights', 'ROI Tracking'],
      popular: false,
    },
  ];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleContinue = () => {
    if (selectedRole) {
      navigation.navigate('Signup', { role: selectedRole });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <KlikdScreenContainer 
      showHeader={true}
      showBackButton={true}
      onBackPress={handleBack}
      headerTitle="Choose Your Journey"
    >
      <Animated.View style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}>
        {/* Header Content */}
        <View style={styles.headerContent}>
          <Text style={styles.title}>What brings you to Klikd?</Text>
          <Text style={styles.subtitle}>
            Choose your role to get a personalized experience tailored just for you.
          </Text>
        </View>

        {/* Role Cards */}
        <View style={styles.rolesContainer}>
          {roles.map((role, index) => (
            <Animated.View
              key={role.id}
              style={{
                transform: [{
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 30],
                    outputRange: [0, 30 + (index * 20)],
                  })
                }]
              }}
            >
              <KlikdCard
                variant={selectedRole === role.id ? 'elevated' : 'outlined'}
                onPress={() => handleRoleSelect(role.id)}
                style={[
                  styles.roleCard,
                  selectedRole === role.id && styles.selectedRoleCard,
                  { borderColor: selectedRole === role.id ? role.color : '#333' }
                ]}
                glowEffect={selectedRole === role.id}
              >
                <View style={styles.roleHeader}>
                  <View style={styles.roleIconContainer}>
                    <View style={[styles.roleIcon, { backgroundColor: role.color }]}>
                      <Ionicons name={role.icon as any} size={24} color="white" />
                    </View>
                    {role.popular && (
                      <View style={styles.popularBadge}>
                        <Text style={styles.popularText}>POPULAR</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.roleTitleContainer}>
                    <Text style={styles.roleTitle}>{role.title}</Text>
                    <Text style={styles.roleSubtitle}>{role.subtitle}</Text>
                  </View>

                  {selectedRole === role.id && (
                    <Ionicons 
                      name="checkmark-circle" 
                      size={24} 
                      color={KlikdBrandSystem.colors.primary.klikd_green} 
                    />
                  )}
                </View>

                <Text style={styles.roleDescription}>{role.description}</Text>

                <View style={styles.benefitsContainer}>
                  {role.benefits.map((benefit, benefitIndex) => (
                    <View key={benefitIndex} style={styles.benefitItem}>
                      <Ionicons 
                        name="checkmark" 
                        size={16} 
                        color={role.color} 
                      />
                      <Text style={styles.benefitText}>{benefit}</Text>
                    </View>
                  ))}
                </View>
              </KlikdCard>
            </Animated.View>
          ))}
        </View>

        {/* Continue Button */}
        <View style={styles.actionContainer}>
          <ModernKlikdButton
            title={selectedRole ? "Continue" : "Select a Role"}
            variant="primary"
            size="large"
            icon="arrow-forward"
            onPress={handleContinue}
            style={[
              styles.continueButton,
              !selectedRole && styles.disabledButton
            ]}
          />
        </View>
      </Animated.View>
    </KlikdScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  headerContent: {
    paddingHorizontal: 4,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: KlikdBrandSystem.colors.primary.klikd_white,
    marginBottom: 12,
    fontFamily: 'Inter',
  },
  subtitle: {
    fontSize: 16,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    lineHeight: 24,
    fontFamily: 'Inter',
  },
  rolesContainer: {
    flex: 1,
    gap: 16,
  },
  roleCard: {
    padding: 20,
    borderWidth: 2,
    borderRadius: 16,
  },
  selectedRoleCard: {
    backgroundColor: 'rgba(236, 255, 0, 0.05)',
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  roleIconContainer: {
    position: 'relative',
    marginRight: 16,
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: KlikdBrandSystem.colors.primary.klikd_green,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  popularText: {
    fontSize: 8,
    fontWeight: '700',
    color: KlikdBrandSystem.colors.primary.klikd_black,
    fontFamily: 'Inter',
  },
  roleTitleContainer: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: KlikdBrandSystem.colors.primary.klikd_white,
    fontFamily: 'Inter',
  },
  roleSubtitle: {
    fontSize: 14,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    marginTop: 2,
    fontFamily: 'Inter',
  },
  roleDescription: {
    fontSize: 14,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    lineHeight: 20,
    marginBottom: 16,
    fontFamily: 'Inter',
  },
  benefitsContainer: {
    gap: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    fontSize: 14,
    color: KlikdBrandSystem.colors.primary.klikd_white,
    fontFamily: 'Inter',
  },
  actionContainer: {
    paddingTop: 24,
  },
  continueButton: {
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
