// Figma MCP Full UI Recreation Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Alert,
  Switch,
  Modal,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FigmaUIRenderer } from '../design/FigmaUIRenderer';
import { figmaUIGenerator } from '../design/FigmaUIGenerator';
import { klikdDesignSystem } from '../design/FigmaIntegration';

const { width: screenWidth } = Dimensions.get('window');

interface UIRecreationScreenProps {
  navigation: any;
}

export default function FigmaUIRecreationScreen({ navigation }: UIRecreationScreenProps) {
  const [isRecreating, setIsRecreating] = useState(false);
  const [recreationComplete, setRecreationComplete] = useState(false);
  const [showRenderer, setShowRenderer] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState<string>('FeedScreen');
  const [culturalTheme, setCulturalTheme] = useState<'saudi' | 'international'>('saudi');
  const [regenerateAll, setRegenerateAll] = useState(true);
  const [generationStats, setGenerationStats] = useState({
    screens: 0,
    components: 0,
    designTokens: 0,
    culturalVariants: 0
  });

  const availableScreens = [
    'OnboardingScreen',
    'FeedScreen',
    'MapScreen',
    'MissionsScreen',
    'SocialScreen',
    'ProfileScreen',
    'CameraScreen',
    'InfluencerDashboard',
    'BusinessDashboard',
    'AgencyDashboard',
    'SettingsScreen',
    'ARExperienceScreen',
    'ChatScreen',
    'NotificationsScreen',
    'AnalyticsScreen'
  ];

  const handleFullUIRecreation = async () => {
    setIsRecreating(true);
    setRecreationComplete(false);

    try {
      console.log('🎨 Starting Figma MCP Full UI Recreation...');
      
      // Simulate recreation process with progress updates
      const result = await figmaUIGenerator.recreateFullUI();
      
      if (result.success) {
        setGenerationStats({
          screens: result.screens.length,
          components: result.components.length,
          designTokens: Object.keys(result.designSystem.figmaTokens || {}).length,
          culturalVariants: 2 // Saudi + International
        });
        
        setRecreationComplete(true);
        Alert.alert(
          '✅ UI Recreation Complete!',
          `Generated ${result.screens.length} screens and ${result.components.length} components from Figma MCP`,
          [
            { text: 'View Results', onPress: () => setShowRenderer(true) },
            { text: 'OK', style: 'default' }
          ]
        );
      } else {
        throw new Error('UI recreation failed');
      }
    } catch (error) {
      console.error('❌ UI Recreation Failed:', error);
      Alert.alert('❌ Recreation Failed', 'Unable to recreate UI from Figma MCP');
    } finally {
      setIsRecreating(false);
    }
  };

  const handleScreenSelection = (screenName: string) => {
    setSelectedScreen(screenName);
    setShowRenderer(true);
  };

  const renderRecreationStatus = () => (
    <View style={styles.statusCard}>
      <View style={styles.statusHeader}>
        <Ionicons 
          name={recreationComplete ? "checkmark-circle" : "color-palette"} 
          size={24} 
          color={recreationComplete ? "#4CAF50" : klikdDesignSystem.colors.primary.klikd_blue} 
        />
        <Text style={styles.statusTitle}>
          {recreationComplete ? 'Recreation Complete' : 'Figma MCP Status'}
        </Text>
      </View>
      
      {recreationComplete ? (
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{generationStats.screens}</Text>
            <Text style={styles.statLabel}>Screens</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{generationStats.components}</Text>
            <Text style={styles.statLabel}>Components</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{generationStats.designTokens}</Text>
            <Text style={styles.statLabel}>Design Tokens</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{generationStats.culturalVariants}</Text>
            <Text style={styles.statLabel}>Cultural Themes</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.statusDescription}>
          Ready to recreate complete UI from Figma design system
        </Text>
      )}
    </View>
  );

  const renderConfigurationPanel = () => (
    <View style={styles.configCard}>
      <Text style={styles.configTitle}>Recreation Configuration</Text>
      
      <View style={styles.configOption}>
        <Text style={styles.configLabel}>Cultural Theme</Text>
        <View style={styles.themeSelector}>
          <TouchableOpacity
            style={[
              styles.themeButton,
              culturalTheme === 'saudi' && styles.themeButtonActive
            ]}
            onPress={() => setCulturalTheme('saudi')}
          >
            <Text style={[
              styles.themeButtonText,
              culturalTheme === 'saudi' && styles.themeButtonTextActive
            ]}>
              🇸🇦 Saudi
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.themeButton,
              culturalTheme === 'international' && styles.themeButtonActive
            ]}
            onPress={() => setCulturalTheme('international')}
          >
            <Text style={[
              styles.themeButtonText,
              culturalTheme === 'international' && styles.themeButtonTextActive
            ]}>
              🌍 International
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.configOption}>
        <Text style={styles.configLabel}>Regenerate All Components</Text>
        <Switch
          value={regenerateAll}
          onValueChange={setRegenerateAll}
          trackColor={{ 
            false: klikdDesignSystem.colors.neutral.medium_gray, 
            true: klikdDesignSystem.colors.primary.klikd_blue 
          }}
          thumbColor="white"
        />
      </View>
    </View>
  );

  const renderScreenSelector = () => (
    <View style={styles.screenCard}>
      <Text style={styles.screenTitle}>Generated Screens</Text>
      <Text style={styles.screenSubtitle}>
        {recreationComplete ? 'Tap to preview recreated screens' : 'Available after recreation'}
      </Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.screenScroll}
      >
        {availableScreens.map((screen) => (
          <TouchableOpacity
            key={screen}
            style={[
              styles.screenChip,
              selectedScreen === screen && styles.screenChipActive,
              !recreationComplete && styles.screenChipDisabled
            ]}
            onPress={() => recreationComplete && handleScreenSelection(screen)}
            disabled={!recreationComplete}
          >
            <Text style={[
              styles.screenChipText,
              selectedScreen === screen && styles.screenChipTextActive,
              !recreationComplete && styles.screenChipTextDisabled
            ]}>
              {screen.replace('Screen', '').replace('Dashboard', '')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionContainer}>
      <TouchableOpacity
        style={[
          styles.recreateButton,
          isRecreating && styles.recreateButtonDisabled
        ]}
        onPress={handleFullUIRecreation}
        disabled={isRecreating}
      >
        <Ionicons 
          name={isRecreating ? "hourglass" : "refresh"} 
          size={20} 
          color="white" 
        />
        <Text style={styles.recreateButtonText}>
          {isRecreating ? 'Recreating UI...' : 'Recreate Full UI'}
        </Text>
      </TouchableOpacity>

      {recreationComplete && (
        <TouchableOpacity
          style={styles.previewButton}
          onPress={() => setShowRenderer(true)}
        >
          <Ionicons name="eye" size={20} color="white" />
          <Text style={styles.previewButtonText}>Preview UI</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Figma MCP UI Recreation</Text>
        <TouchableOpacity 
          style={styles.infoButton}
          onPress={() => Alert.alert(
            'Figma MCP Integration',
            'This system recreates the complete UI from Figma design specifications, generating all components, screens, and cultural variants automatically.'
          )}
        >
          <Ionicons name="information-circle" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderRecreationStatus()}
        {renderConfigurationPanel()}
        {renderScreenSelector()}
        {renderActionButtons()}

        {/* Feature Overview */}
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>🎨 Full UI Recreation Features</Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.featureText}>Complete design system generation</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.featureText}>15+ screen layouts from Figma specs</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.featureText}>Cultural theme adaptation (Saudi/International)</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.featureText}>Real-time component synchronization</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.featureText}>Automated layout and navigation</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* UI Renderer Modal */}
      <Modal
        visible={showRenderer}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.rendererContainer}>
          <View style={styles.rendererHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowRenderer(false)}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.rendererTitle}>Generated UI Preview</Text>
            <View style={styles.placeholder} />
          </View>
          
          <FigmaUIRenderer
            screenName={selectedScreen}
            regenerateAll={regenerateAll}
            onUIGenerated={(success) => {
              if (!success) {
                Alert.alert('Generation Failed', 'Unable to generate UI components');
              }
            }}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: klikdDesignSystem.colors.neutral.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: klikdDesignSystem.colors.neutral.dark_gray,
    borderBottomWidth: 1,
    borderBottomColor: klikdDesignSystem.colors.neutral.medium_gray,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  infoButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  
  statusCard: {
    backgroundColor: klikdDesignSystem.colors.neutral.dark_gray,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: klikdDesignSystem.colors.primary.klikd_blue,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginLeft: 12,
  },
  statusDescription: {
    fontSize: 14,
    color: klikdDesignSystem.colors.neutral.light_gray,
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: klikdDesignSystem.colors.primary.klikd_blue,
  },
  statLabel: {
    fontSize: 12,
    color: klikdDesignSystem.colors.neutral.light_gray,
    marginTop: 4,
  },
  
  configCard: {
    backgroundColor: klikdDesignSystem.colors.neutral.dark_gray,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  configTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
  },
  configOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  configLabel: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  themeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  themeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: klikdDesignSystem.colors.neutral.medium_gray,
  },
  themeButtonActive: {
    backgroundColor: klikdDesignSystem.colors.primary.klikd_blue,
  },
  themeButtonText: {
    fontSize: 12,
    color: klikdDesignSystem.colors.neutral.light_gray,
    fontWeight: '500',
  },
  themeButtonTextActive: {
    color: 'white',
  },
  
  screenCard: {
    backgroundColor: klikdDesignSystem.colors.neutral.dark_gray,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 12,
    color: klikdDesignSystem.colors.neutral.light_gray,
    marginBottom: 16,
  },
  screenScroll: {
    marginHorizontal: -4,
  },
  screenChip: {
    backgroundColor: klikdDesignSystem.colors.neutral.medium_gray,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  screenChipActive: {
    backgroundColor: klikdDesignSystem.colors.primary.klikd_blue,
  },
  screenChipDisabled: {
    backgroundColor: klikdDesignSystem.colors.neutral.medium_gray,
    opacity: 0.5,
  },
  screenChipText: {
    fontSize: 12,
    color: klikdDesignSystem.colors.neutral.light_gray,
    fontWeight: '500',
  },
  screenChipTextActive: {
    color: 'white',
  },
  screenChipTextDisabled: {
    color: klikdDesignSystem.colors.neutral.medium_gray,
  },
  
  actionContainer: {
    gap: 12,
    marginBottom: 16,
  },
  recreateButton: {
    backgroundColor: klikdDesignSystem.colors.primary.klikd_blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  recreateButtonDisabled: {
    backgroundColor: klikdDesignSystem.colors.neutral.medium_gray,
  },
  recreateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  previewButton: {
    backgroundColor: klikdDesignSystem.colors.cultural.saudi_green,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  previewButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  
  featureCard: {
    backgroundColor: klikdDesignSystem.colors.neutral.dark_gray,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: klikdDesignSystem.colors.neutral.light_gray,
    flex: 1,
  },
  
  rendererContainer: {
    flex: 1,
    backgroundColor: klikdDesignSystem.colors.neutral.black,
  },
  rendererHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: klikdDesignSystem.colors.neutral.dark_gray,
    borderBottomWidth: 1,
    borderBottomColor: klikdDesignSystem.colors.neutral.medium_gray,
  },
  closeButton: {
    padding: 8,
  },
  rendererTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
});
