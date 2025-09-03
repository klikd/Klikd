// Figma MCP UI Renderer - Converts generated UI specs to React Native components
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Modal,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { figmaUIGenerator, GeneratedScreen, GeneratedComponent } from './FigmaUIGenerator';
import { klikdDesignSystem } from './FigmaIntegration';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export interface UIRendererProps {
  screenName?: string;
  regenerateAll?: boolean;
  onUIGenerated?: (success: boolean) => void;
}

export const FigmaUIRenderer: React.FC<UIRendererProps> = ({
  screenName,
  regenerateAll = false,
  onUIGenerated
}) => {
  const [generatedUI, setGeneratedUI] = useState<{
    screens: GeneratedScreen[];
    components: GeneratedComponent[];
    designSystem: any;
    success: boolean;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<GeneratedScreen | null>(null);

  useEffect(() => {
    if (regenerateAll) {
      recreateFullUI();
    }
  }, [regenerateAll]);

  const recreateFullUI = async () => {
    setIsGenerating(true);
    console.log('🎨 Starting Figma MCP Full UI Recreation...');

    try {
      const result = await figmaUIGenerator.recreateFullUI();
      setGeneratedUI(result);
      
      if (screenName && result.screens.length > 0) {
        const screen = result.screens.find(s => s.name === screenName);
        setCurrentScreen(screen || result.screens[0]);
      }

      onUIGenerated?.(result.success);
      console.log('✅ UI Recreation Complete!');
    } catch (error) {
      console.error('❌ UI Recreation Failed:', error);
      onUIGenerated?.(false);
    } finally {
      setIsGenerating(false);
    }
  };

  // Render individual components based on type
  const renderComponent = (component: GeneratedComponent, index: number): React.ReactNode => {
    const key = `${component.id}-${index}`;

    switch (component.type) {
      case 'card':
        return renderCard(component, key);
      case 'button':
        return renderButton(component, key);
      case 'avatar':
        return renderAvatar(component, key);
      case 'input':
        return renderInput(component, key);
      case 'list':
        return renderList(component, key);
      case 'header':
        return renderHeader(component, key);
      case 'modal':
        return renderModal(component, key);
      default:
        return renderGenericComponent(component, key);
    }
  };

  // Card component renderer
  const renderCard = (component: GeneratedComponent, key: string): React.ReactNode => {
    if (component.name === 'MissionCard') {
      return (
        <View key={key} style={[styles.missionCard, component.styles?.container]}>
          <View style={styles.missionHeader}>
            <Text style={styles.missionTitle}>
              {component.props?.title || 'Explore Downtown Riyadh'}
            </Text>
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>
                {component.props?.difficulty || 'Medium'}
              </Text>
            </View>
          </View>
          <Text style={styles.missionDescription}>
            {component.props?.description || 'Discover hidden gems in the heart of Saudi Arabia'}
          </Text>
          <View style={styles.missionStats}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={16} color={klikdDesignSystem.colors.primary.klikd_gold} />
              <Text style={styles.statText}>{component.props?.xp || '250'} XP</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="people" size={16} color={klikdDesignSystem.colors.neutral.light_gray} />
              <Text style={styles.statText}>{component.props?.participants || '12'} joined</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time" size={16} color={klikdDesignSystem.colors.neutral.light_gray} />
              <Text style={styles.statText}>{component.props?.timeLeft || '2h left'}</Text>
            </View>
          </View>
        </View>
      );
    }

    if (component.name === 'StatsCard') {
      return (
        <View key={key} style={[styles.statsCard, component.styles?.container]}>
          <View style={styles.statsHeader}>
            <Ionicons name="trending-up" size={24} color={klikdDesignSystem.colors.primary.klikd_blue} />
            <Text style={styles.statsTitle}>Performance</Text>
          </View>
          <Text style={styles.statsValue}>+24%</Text>
          <Text style={styles.statsSubtext}>vs last week</Text>
        </View>
      );
    }

    // Generic card
    return (
      <View key={key} style={[styles.genericCard, component.styles?.container]}>
        <Text style={styles.cardTitle}>{component.name}</Text>
        {component.children?.map((child, idx) => renderComponent(child, idx))}
      </View>
    );
  };

  // Button component renderer
  const renderButton = (component: GeneratedComponent, key: string): React.ReactNode => {
    const getButtonStyle = () => {
      const variant = component.props?.variant || 'primary';
      switch (variant) {
        case 'primary':
          return styles.primaryButton;
        case 'secondary':
          return styles.secondaryButton;
        case 'cultural':
          return styles.culturalButton;
        case 'danger':
          return styles.dangerButton;
        default:
          return styles.primaryButton;
      }
    };

    return (
      <TouchableOpacity
        key={key}
        style={[getButtonStyle(), component.styles?.base]}
        disabled={component.props?.disabled}
      >
        {component.props?.icon && (
          <Ionicons 
            name={component.props.icon} 
            size={20} 
            color="white" 
            style={{ marginRight: 8 }}
          />
        )}
        <Text style={styles.buttonText}>
          {component.props?.title || component.name}
        </Text>
      </TouchableOpacity>
    );
  };

  // Avatar component renderer
  const renderAvatar = (component: GeneratedComponent, key: string): React.ReactNode => {
    const size = component.props?.size || 'medium';
    const avatarSize = size === 'small' ? 40 : size === 'large' ? 80 : 60;
    
    return (
      <View key={key} style={[styles.avatarContainer, { width: avatarSize, height: avatarSize }]}>
        <View style={[styles.avatar, { width: avatarSize, height: avatarSize }]}>
          <Ionicons name="person" size={avatarSize * 0.6} color={klikdDesignSystem.colors.neutral.light_gray} />
        </View>
        {component.props?.status && (
          <View style={[styles.statusIndicator, getStatusColor(component.props.status)]} />
        )}
        {component.props?.level && (
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{component.props.level}</Text>
          </View>
        )}
      </View>
    );
  };

  // Input component renderer
  const renderInput = (component: GeneratedComponent, key: string): React.ReactNode => {
    return (
      <View key={key} style={styles.inputContainer}>
        {component.props?.label && (
          <Text style={styles.inputLabel}>{component.props.label}</Text>
        )}
        <TextInput
          style={styles.input}
          placeholder={component.props?.placeholder || 'Enter text...'}
          placeholderTextColor={klikdDesignSystem.colors.neutral.light_gray}
          value={component.props?.value}
        />
      </View>
    );
  };

  // List component renderer
  const renderList = (component: GeneratedComponent, key: string): React.ReactNode => {
    const data = component.props?.data || [1, 2, 3]; // Mock data
    
    if (component.props?.horizontal) {
      return (
        <FlatList
          key={key}
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>Item {index + 1}</Text>
            </View>
          )}
          style={styles.horizontalList}
        />
      );
    }

    return (
      <FlatList
        key={key}
        data={data}
        renderItem={({ item, index }) => (
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>Item {index + 1}</Text>
          </View>
        )}
        style={styles.verticalList}
      />
    );
  };

  // Header component renderer
  const renderHeader = (component: GeneratedComponent, key: string): React.ReactNode => {
    return (
      <View key={key} style={styles.header}>
        {component.props?.backButton && (
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>
          {component.props?.title || component.name}
        </Text>
        {component.props?.actions?.map((action: any, idx: number) => (
          <TouchableOpacity key={idx} style={styles.headerButton}>
            <Ionicons name={action.icon} size={24} color="white" />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Modal component renderer
  const renderModal = (component: GeneratedComponent, key: string): React.ReactNode => {
    return (
      <Modal key={key} visible={component.props?.visible || false} transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{component.name}</Text>
            {component.children?.map((child, idx) => renderComponent(child, idx))}
          </View>
        </View>
      </Modal>
    );
  };

  // Generic component renderer
  const renderGenericComponent = (component: GeneratedComponent, key: string): React.ReactNode => {
    return (
      <View key={key} style={styles.genericComponent}>
        <Text style={styles.componentName}>{component.name}</Text>
        {component.children?.map((child, idx) => renderComponent(child, idx))}
      </View>
    );
  };

  // Helper function for status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return { backgroundColor: '#4CAF50' };
      case 'away':
        return { backgroundColor: '#FF9800' };
      case 'offline':
        return { backgroundColor: '#757575' };
      default:
        return { backgroundColor: '#757575' };
    }
  };

  // Render complete screen
  const renderScreen = (screen: GeneratedScreen): React.ReactNode => {
    return (
      <SafeAreaView style={[styles.screenContainer, screen.styles?.container]}>
        {screen.navigation?.headerShown && (
          <View style={styles.screenHeader}>
            <Text style={styles.screenTitle}>{screen.navigation.title || screen.name}</Text>
          </View>
        )}
        
        {screen.layout.type === 'scroll' ? (
          <ScrollView style={styles.scrollContent}>
            {screen.components.map((component, index) => renderComponent(component, index))}
          </ScrollView>
        ) : (
          <View style={styles.fixedContent}>
            {screen.components.map((component, index) => renderComponent(component, index))}
          </View>
        )}
      </SafeAreaView>
    );
  };

  if (isGenerating) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="color-palette" size={48} color={klikdDesignSystem.colors.primary.klikd_blue} />
        <Text style={styles.loadingText}>Recreating UI from Figma...</Text>
        <Text style={styles.loadingSubtext}>Generating components and screens</Text>
      </View>
    );
  }

  if (!generatedUI?.success) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#F44336" />
        <Text style={styles.errorText}>UI Generation Failed</Text>
        <TouchableOpacity style={styles.retryButton} onPress={recreateFullUI}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.rendererContainer}>
      {currentScreen ? renderScreen(currentScreen) : (
        <View style={styles.noScreenContainer}>
          <Text style={styles.noScreenText}>No screen selected</Text>
        </View>
      )}
      
      {/* Screen Selector */}
      <View style={styles.screenSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {generatedUI.screens.map((screen, index) => (
            <TouchableOpacity
              key={screen.name}
              style={[
                styles.screenTab,
                currentScreen?.name === screen.name && styles.activeScreenTab
              ]}
              onPress={() => setCurrentScreen(screen)}
            >
              <Text style={[
                styles.screenTabText,
                currentScreen?.name === screen.name && styles.activeScreenTabText
              ]}>
                {screen.name.replace('Screen', '')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rendererContainer: {
    flex: 1,
    backgroundColor: klikdDesignSystem.colors.neutral.black,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: klikdDesignSystem.colors.neutral.black,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 14,
    color: klikdDesignSystem.colors.neutral.light_gray,
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: klikdDesignSystem.colors.neutral.black,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F44336',
    marginTop: 16,
  },
  retryButton: {
    backgroundColor: klikdDesignSystem.colors.primary.klikd_blue,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: klikdDesignSystem.colors.neutral.black,
  },
  screenHeader: {
    backgroundColor: klikdDesignSystem.colors.neutral.dark_gray,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: klikdDesignSystem.colors.neutral.medium_gray,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  scrollContent: {
    flex: 1,
    padding: 16,
  },
  fixedContent: {
    flex: 1,
    padding: 16,
  },
  noScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noScreenText: {
    fontSize: 16,
    color: klikdDesignSystem.colors.neutral.light_gray,
  },
  screenSelector: {
    backgroundColor: klikdDesignSystem.colors.neutral.dark_gray,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: klikdDesignSystem.colors.neutral.medium_gray,
  },
  screenTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  activeScreenTab: {
    backgroundColor: klikdDesignSystem.colors.primary.klikd_blue,
  },
  screenTabText: {
    fontSize: 12,
    color: klikdDesignSystem.colors.neutral.light_gray,
    fontWeight: '500',
  },
  activeScreenTabText: {
    color: 'white',
  },
  
  // Component styles
  missionCard: {
    backgroundColor: klikdDesignSystem.colors.neutral.dark_gray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: klikdDesignSystem.colors.primary.klikd_blue,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    flex: 1,
  },
  difficultyBadge: {
    backgroundColor: klikdDesignSystem.colors.primary.klikd_blue,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  missionDescription: {
    fontSize: 14,
    color: klikdDesignSystem.colors.neutral.light_gray,
    marginBottom: 12,
  },
  missionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: klikdDesignSystem.colors.neutral.light_gray,
    marginLeft: 4,
  },
  
  statsCard: {
    backgroundColor: klikdDesignSystem.colors.neutral.dark_gray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flex: 1,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    marginLeft: 8,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: klikdDesignSystem.colors.primary.klikd_blue,
  },
  statsSubtext: {
    fontSize: 12,
    color: klikdDesignSystem.colors.neutral.light_gray,
  },
  
  genericCard: {
    backgroundColor: klikdDesignSystem.colors.neutral.dark_gray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  
  primaryButton: {
    backgroundColor: klikdDesignSystem.colors.primary.klikd_blue,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: klikdDesignSystem.colors.primary.klikd_blue,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  culturalButton: {
    backgroundColor: klikdDesignSystem.colors.cultural.saudi_green,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  dangerButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    borderRadius: 999,
    backgroundColor: klikdDesignSystem.colors.neutral.medium_gray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: klikdDesignSystem.colors.primary.klikd_blue,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
  levelBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: klikdDesignSystem.colors.primary.klikd_gold,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
  
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    marginBottom: 8,
  },
  input: {
    backgroundColor: klikdDesignSystem.colors.neutral.dark_gray,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: 'white',
    borderWidth: 1,
    borderColor: klikdDesignSystem.colors.neutral.medium_gray,
  },
  
  horizontalList: {
    marginBottom: 16,
  },
  verticalList: {
    flex: 1,
  },
  listItem: {
    backgroundColor: klikdDesignSystem.colors.neutral.dark_gray,
    padding: 16,
    borderRadius: 8,
    marginRight: 12,
    marginBottom: 8,
  },
  listItemText: {
    color: 'white',
    fontSize: 14,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: klikdDesignSystem.colors.neutral.dark_gray,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: klikdDesignSystem.colors.neutral.dark_gray,
    borderRadius: 12,
    padding: 24,
    width: screenWidth * 0.8,
    maxHeight: screenHeight * 0.8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  
  genericComponent: {
    backgroundColor: klikdDesignSystem.colors.neutral.dark_gray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  componentName: {
    fontSize: 12,
    fontWeight: '500',
    color: klikdDesignSystem.colors.neutral.light_gray,
    marginBottom: 4,
  },
});

export default FigmaUIRenderer;
