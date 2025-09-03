import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingScreenProps {
  navigation: any;
}

const CULTURAL_PROFILES = [
  { id: 'hijazi', name: 'Hijazi', emoji: '🕌', region: 'Western Saudi Arabia' },
  { id: 'najdi', name: 'Najdi', emoji: '🏛️', region: 'Central Saudi Arabia' },
  { id: 'eastern', name: 'Eastern', emoji: '🏖️', region: 'Eastern Saudi Arabia' },
  { id: 'southern', name: 'Southern', emoji: '⛰️', region: 'Southern Saudi Arabia' },
  { id: 'gcc', name: 'GCC', emoji: '🌟', region: 'Gulf Region' },
  { id: 'international', name: 'International', emoji: '🌍', region: 'Global' },
];

const INTERESTS = [
  { id: 'fashion', name: 'Fashion', icon: '👗' },
  { id: 'food', name: 'Food', icon: '🍽️' },
  { id: 'tech', name: 'Technology', icon: '📱' },
  { id: 'art', name: 'Art', icon: '🎨' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'travel', name: 'Travel', icon: '✈️' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' },
];

const PERSONALITY_TYPES = [
  { id: 'adventurer', name: 'Adventurer', desc: 'Love exploring new places', icon: '🗺️' },
  { id: 'collector', name: 'Collector', desc: 'Enjoy gathering items & badges', icon: '💎' },
  { id: 'social', name: 'Social', desc: 'Connect with friends & community', icon: '👥' },
  { id: 'creator', name: 'Creator', desc: 'Make content & share stories', icon: '🎬' },
];

export default function OnboardingScreen({ navigation }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState({
    nationality: '',
    culturalProfile: '',
    interests: [] as string[],
    personality: '',
    language: 'en',
    username: '',
    isMinor: false,
  });

  const steps = [
    'Welcome',
    'Nationality',
    'Cultural Profile',
    'Interests',
    'Personality',
    'Username',
    'Permissions',
    'Complete'
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleInterest = (interestId: string) => {
    const interests = userProfile.interests;
    if (interests.includes(interestId)) {
      setUserProfile({
        ...userProfile,
        interests: interests.filter(id => id !== interestId)
      });
    } else if (interests.length < 5) {
      setUserProfile({
        ...userProfile,
        interests: [...interests, interestId]
      });
    }
  };

  const completeOnboarding = () => {
    // Store user profile and navigate to main app
    console.log('User Profile:', userProfile);
    navigation.replace('Feed');
  };

  const renderWelcomeStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.welcomeTitle}>Welcome to Klikd! 🎉</Text>
      <Text style={styles.welcomeSubtitle}>
        Your AR-powered social commerce adventure starts here
      </Text>
      <View style={styles.featureList}>
        <View style={styles.featureItem}>
          <Ionicons name="camera" size={24} color="#007AFF" />
          <Text style={styles.featureText}>Discover AR experiences</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="people" size={24} color="#007AFF" />
          <Text style={styles.featureText}>Connect with friends</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="gift" size={24} color="#007AFF" />
          <Text style={styles.featureText}>Earn rewards & badges</Text>
        </View>
      </View>
    </View>
  );

  const renderNationalityStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Where are you from?</Text>
      <Text style={styles.stepSubtitle}>This helps us customize your experience</Text>
      
      <TouchableOpacity
        style={[
          styles.optionButton,
          userProfile.nationality === 'saudi' && styles.selectedOption
        ]}
        onPress={() => setUserProfile({ ...userProfile, nationality: 'saudi' })}
      >
        <Text style={styles.optionEmoji}>🇸🇦</Text>
        <Text style={styles.optionText}>Saudi Arabia</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.optionButton,
          userProfile.nationality === 'gcc' && styles.selectedOption
        ]}
        onPress={() => setUserProfile({ ...userProfile, nationality: 'gcc' })}
      >
        <Text style={styles.optionEmoji}>🌟</Text>
        <Text style={styles.optionText}>GCC Countries</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.optionButton,
          userProfile.nationality === 'international' && styles.selectedOption
        ]}
        onPress={() => setUserProfile({ ...userProfile, nationality: 'international' })}
      >
        <Text style={styles.optionEmoji}>🌍</Text>
        <Text style={styles.optionText}>International</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCulturalProfileStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Choose your cultural profile</Text>
      <Text style={styles.stepSubtitle}>This helps us show relevant content</Text>
      
      <ScrollView style={styles.optionsScroll}>
        {CULTURAL_PROFILES.map((profile) => (
          <TouchableOpacity
            key={profile.id}
            style={[
              styles.optionButton,
              userProfile.culturalProfile === profile.id && styles.selectedOption
            ]}
            onPress={() => setUserProfile({ ...userProfile, culturalProfile: profile.id })}
          >
            <Text style={styles.optionEmoji}>{profile.emoji}</Text>
            <View style={styles.optionContent}>
              <Text style={styles.optionText}>{profile.name}</Text>
              <Text style={styles.optionSubtext}>{profile.region}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderInterestsStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What interests you?</Text>
      <Text style={styles.stepSubtitle}>Select up to 5 interests ({userProfile.interests.length}/5)</Text>
      
      <View style={styles.interestsGrid}>
        {INTERESTS.map((interest) => (
          <TouchableOpacity
            key={interest.id}
            style={[
              styles.interestChip,
              userProfile.interests.includes(interest.id) && styles.selectedChip
            ]}
            onPress={() => toggleInterest(interest.id)}
          >
            <Text style={styles.interestEmoji}>{interest.icon}</Text>
            <Text style={styles.interestText}>{interest.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPersonalityStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What's your explorer type?</Text>
      <Text style={styles.stepSubtitle}>This helps us recommend the right missions</Text>
      
      <ScrollView style={styles.optionsScroll}>
        {PERSONALITY_TYPES.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.personalityCard,
              userProfile.personality === type.id && styles.selectedCard
            ]}
            onPress={() => setUserProfile({ ...userProfile, personality: type.id })}
          >
            <Text style={styles.personalityEmoji}>{type.icon}</Text>
            <View style={styles.personalityContent}>
              <Text style={styles.personalityName}>{type.name}</Text>
              <Text style={styles.personalityDesc}>{type.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderUsernameStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Choose your username</Text>
      <Text style={styles.stepSubtitle}>This is how others will find you</Text>
      
      <TextInput
        style={styles.usernameInput}
        placeholder="Enter username"
        placeholderTextColor="#999"
        value={userProfile.username}
        onChangeText={(text) => setUserProfile({ ...userProfile, username: text })}
        maxLength={20}
      />
      
      <Text style={styles.usernameHint}>
        • 3-20 characters
        • Letters, numbers, and underscores only
        • Must be unique
      </Text>
    </View>
  );

  const renderPermissionsStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Enable permissions</Text>
      <Text style={styles.stepSubtitle}>We need these to provide the best AR experience</Text>
      
      <View style={styles.permissionsList}>
        <View style={styles.permissionItem}>
          <Ionicons name="location" size={24} color="#007AFF" />
          <View style={styles.permissionContent}>
            <Text style={styles.permissionTitle}>Location</Text>
            <Text style={styles.permissionDesc}>Find AR zones and missions near you</Text>
          </View>
        </View>
        
        <View style={styles.permissionItem}>
          <Ionicons name="camera" size={24} color="#007AFF" />
          <View style={styles.permissionContent}>
            <Text style={styles.permissionTitle}>Camera</Text>
            <Text style={styles.permissionDesc}>Capture AR experiences and memories</Text>
          </View>
        </View>
        
        <View style={styles.permissionItem}>
          <Ionicons name="notifications" size={24} color="#007AFF" />
          <View style={styles.permissionContent}>
            <Text style={styles.permissionTitle}>Notifications</Text>
            <Text style={styles.permissionDesc}>Get alerts about missions and friends</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderCompleteStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.welcomeTitle}>You're all set! 🎊</Text>
      <Text style={styles.welcomeSubtitle}>
        Welcome to the Klikd community, {userProfile.username}!
      </Text>
      
      <View style={styles.completeBadge}>
        <Ionicons name="checkmark-circle" size={64} color="#00C851" />
        <Text style={styles.badgeText}>First Explorer Badge</Text>
        <Text style={styles.badgeXP}>+100 XP</Text>
      </View>
      
      <Text style={styles.completeMessage}>
        Start exploring AR zones, complete missions, and connect with friends to earn more rewards!
      </Text>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderWelcomeStep();
      case 1: return renderNationalityStep();
      case 2: return renderCulturalProfileStep();
      case 3: return renderInterestsStep();
      case 4: return renderPersonalityStep();
      case 5: return renderUsernameStep();
      case 6: return renderPermissionsStep();
      case 7: return renderCompleteStep();
      default: return renderWelcomeStep();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return userProfile.nationality !== '';
      case 2: return userProfile.culturalProfile !== '';
      case 3: return userProfile.interests.length > 0;
      case 4: return userProfile.personality !== '';
      case 5: return userProfile.username.length >= 3;
      default: return true;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentStep + 1) / steps.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {currentStep + 1} of {steps.length}
        </Text>
      </View>

      {/* Step Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCurrentStep()}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        {currentStep > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="#007AFF" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[
            styles.nextButton,
            !canProceed() && styles.disabledButton
          ]}
          onPress={handleNext}
          disabled={!canProceed()}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === steps.length - 1 ? 'Start Exploring!' : 'Continue'}
          </Text>
          <Ionicons name="chevron-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  progressText: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
  },
  featureList: {
    gap: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  featureText: {
    color: 'white',
    fontSize: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: '#007AFF',
    backgroundColor: '#001a33',
  },
  optionEmoji: {
    fontSize: 24,
    marginRight: 15,
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  optionContent: {
    flex: 1,
  },
  optionSubtext: {
    color: '#999',
    fontSize: 12,
    marginTop: 2,
  },
  optionsScroll: {
    width: '100%',
    maxHeight: 400,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  interestChip: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedChip: {
    borderColor: '#007AFF',
    backgroundColor: '#001a33',
  },
  interestEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  interestText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  personalityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#007AFF',
    backgroundColor: '#001a33',
  },
  personalityEmoji: {
    fontSize: 32,
    marginRight: 20,
  },
  personalityContent: {
    flex: 1,
  },
  personalityName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  personalityDesc: {
    color: '#999',
    fontSize: 14,
    lineHeight: 18,
  },
  usernameInput: {
    backgroundColor: '#1a1a1a',
    color: 'white',
    fontSize: 18,
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#333',
  },
  usernameHint: {
    color: '#999',
    fontSize: 12,
    lineHeight: 16,
  },
  permissionsList: {
    gap: 20,
    width: '100%',
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  permissionContent: {
    flex: 1,
  },
  permissionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  permissionDesc: {
    color: '#999',
    fontSize: 14,
    lineHeight: 18,
  },
  completeBadge: {
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 30,
    borderRadius: 20,
    marginVertical: 20,
  },
  badgeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  badgeXP: {
    color: '#00C851',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  completeMessage: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#333',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
