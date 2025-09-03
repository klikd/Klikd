// 1.3 Signup Screen - Snapchat, Apple, Email
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Alert } from 'react-native';
import { KlikdScreenContainer, KlikdFormField } from '../../components/KlikdScalableComponents';
import { ModernKlikdButton } from '../../design/FigmaModernUI';
import { KlikdBrandSystem } from '../../design/KlikdBrandSystem';
import { Ionicons } from '@expo/vector-icons';

interface SignupScreenProps {
  navigation: any;
  route: { params?: { role?: string } };
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation, route }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const selectedRole = route.params?.role || 'collector';

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('PhoneVerification', { 
        phoneNumber: '+966501234567' // Mock phone number
      });
    }, 2000);
  };

  const handleSocialSignup = (provider: string) => {
    Alert.alert(
      'Social Signup',
      `${provider} signup will be implemented with actual SDK integration.`,
      [{ text: 'OK' }]
    );
  };

  const getRoleInfo = () => {
    switch (selectedRole) {
      case 'influencer':
        return {
          title: 'Join as Creator/Influencer',
          subtitle: 'Start creating and monetizing your content',
          icon: 'star',
          color: '#FFD700',
        };
      case 'brand':
        return {
          title: 'Join as Brand/Business',
          subtitle: 'Launch campaigns and engage customers',
          icon: 'business',
          color: '#FF6B6B',
        };
      default:
        return {
          title: 'Join as Explorer/Collector',
          subtitle: 'Discover quests and collect rewards',
          icon: 'compass',
          color: KlikdBrandSystem.colors.primary.klikd_green,
        };
    }
  };

  const roleInfo = getRoleInfo();

  return (
    <KlikdScreenContainer 
      showHeader={true}
      showBackButton={true}
      onBackPress={() => navigation.goBack()}
      headerTitle="Create Account"
    >
      <Animated.View style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}>
        {/* Role Header */}
        <View style={styles.roleHeader}>
          <View style={[styles.roleIcon, { backgroundColor: roleInfo.color }]}>
            <Ionicons name={roleInfo.icon as any} size={24} color="white" />
          </View>
          <View style={styles.roleInfo}>
            <Text style={styles.roleTitle}>{roleInfo.title}</Text>
            <Text style={styles.roleSubtitle}>{roleInfo.subtitle}</Text>
          </View>
        </View>

        {/* Social Signup Options */}
        <View style={styles.socialSection}>
          <Text style={styles.sectionTitle}>Quick Signup</Text>
          
          <ModernKlikdButton
            title="Continue with Apple"
            variant="secondary"
            size="large"
            icon="logo-apple"
            onPress={() => handleSocialSignup('Apple')}
            style={styles.socialButton}
          />
          
          <ModernKlikdButton
            title="Continue with Snapchat"
            variant="cultural"
            size="large"
            icon="logo-snapchat"
            onPress={() => handleSocialSignup('Snapchat')}
            style={styles.socialButton}
          />
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Email Signup Form */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Create with Email</Text>
          
          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <KlikdFormField
                label="First Name"
                placeholder="Enter first name"
                value={formData.firstName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
                icon="person"
                required
                error={errors.firstName}
              />
            </View>
            <View style={styles.nameField}>
              <KlikdFormField
                label="Last Name"
                placeholder="Enter last name"
                value={formData.lastName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))}
                required
                error={errors.lastName}
              />
            </View>
          </View>

          <KlikdFormField
            label="Email Address"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
            keyboardType="email-address"
            icon="mail"
            required
            error={errors.email}
          />

          <KlikdFormField
            label="Password"
            placeholder="Create a password"
            value={formData.password}
            onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
            secureTextEntry
            icon="lock-closed"
            required
            error={errors.password}
          />

          <KlikdFormField
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
            secureTextEntry
            icon="lock-closed"
            required
            error={errors.confirmPassword}
          />
        </View>

        {/* Terms Notice */}
        <View style={styles.termsSection}>
          <Text style={styles.termsText}>
            By creating an account, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>

        {/* Signup Button */}
        <ModernKlikdButton
          title={loading ? "Creating Account..." : "Create Account"}
          variant="primary"
          size="large"
          icon={loading ? "sync" : "person-add"}
          onPress={handleSignup}
          style={styles.signupButton}
        />

        {/* Login Link */}
        <View style={styles.loginSection}>
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text 
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              Sign In
            </Text>
          </Text>
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
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  roleInfo: {
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
  socialSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: KlikdBrandSystem.colors.primary.klikd_white,
    marginBottom: 16,
    fontFamily: 'Inter',
  },
  socialButton: {
    marginBottom: 12,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  dividerText: {
    fontSize: 14,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    marginHorizontal: 16,
    fontFamily: 'Inter',
  },
  formSection: {
    marginBottom: 24,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameField: {
    flex: 1,
  },
  termsSection: {
    marginBottom: 24,
  },
  termsText: {
    fontSize: 12,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'Inter',
  },
  termsLink: {
    color: KlikdBrandSystem.colors.primary.klikd_green,
    fontWeight: '600',
  },
  signupButton: {
    marginBottom: 24,
  },
  loginSection: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    fontFamily: 'Inter',
  },
  loginLink: {
    color: KlikdBrandSystem.colors.primary.klikd_green,
    fontWeight: '600',
  },
});
