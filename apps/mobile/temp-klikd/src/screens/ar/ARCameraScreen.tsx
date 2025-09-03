// 8.1 AR Camera Screen - Enhanced version of ModernCameraScreen with full AR capabilities
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { KlikdScreenContainer, KlikdBadge, KlikdProgress } from '../../components/KlikdScalableComponents';
import { ModernKlikdButton } from '../../design/FigmaModernUI';
import { KlikdBrandSystem } from '../../design/KlikdBrandSystem';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ARCameraScreenProps {
  navigation: any;
}

const ARCameraScreen: React.FC<ARCameraScreenProps> = ({ navigation }) => {
  const [scanMode, setScanMode] = useState<'quest' | 'free' | 'ar'>('quest');
  const [isScanning, setIsScanning] = useState(false);
  const [questProgress, setQuestProgress] = useState(0.6);
  const [arObjects, setArObjects] = useState<any[]>([]);
  const [currentFilter, setCurrentFilter] = useState('none');
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');

  // Animations
  const scanGridAnim = useRef(new Animated.Value(0)).current;
  const questPanelAnim = useRef(new Animated.Value(screenHeight)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(questPanelAnim, {
        toValue: screenHeight - 200,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation for scan button
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, []);

  const handleScan = () => {
    setIsScanning(true);
    
    // Animate scan grid
    Animated.loop(
      Animated.timing(scanGridAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      { iterations: 3 }
    ).start();

    // Simulate scan result
    setTimeout(() => {
      setIsScanning(false);
      scanGridAnim.setValue(0);
      
      // Mock scan result
      const mockScanResult = {
        type: 'ar_treasure',
        name: 'Golden Coffee Bean',
        rarity: 'rare',
        coins: 50,
        xp: 100,
        questId: 'coffee-hunt-001'
      };
      
      navigation.navigate('ARScanResult', { scanData: mockScanResult });
    }, 6000);
  };

  const toggleQuestPanel = () => {
    const isExpanded = questPanelAnim._value < screenHeight - 100;
    Animated.spring(questPanelAnim, {
      toValue: isExpanded ? screenHeight - 200 : screenHeight - 400,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const scanModes = [
    { id: 'quest', label: 'Quest Scan', icon: 'compass', color: KlikdBrandSystem.colors.primary.klikd_green },
    { id: 'free', label: 'Free Scan', icon: 'scan', color: '#4CAF50' },
    { id: 'ar', label: 'AR Mode', icon: 'cube', color: '#2196F3' },
  ];

  const mockQuest = {
    title: 'Coffee Shop AR Hunt',
    description: 'Find 3 hidden AR treasures at local coffee shops',
    progress: questProgress,
    target: 3,
    found: 2,
    timeLeft: '2h 30m',
    reward: '50 coins + Rare Badge',
  };

  return (
    <View style={styles.container}>
      {/* Camera View Background */}
      <View style={styles.cameraView}>
        <View style={styles.cameraPlaceholder}>
          <Text style={styles.cameraText}>📱 Camera View</Text>
          <Text style={styles.cameraSubtext}>AR Camera will be integrated here</Text>
        </View>
      </View>

      {/* AR Scan Grid Overlay */}
      {isScanning && (
        <Animated.View style={[
          styles.scanGrid,
          {
            opacity: scanGridAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.3, 0.8, 0.3],
            }),
          }
        ]}>
          {Array.from({ length: 20 }).map((_, i) => (
            <View key={i} style={styles.gridLine} />
          ))}
          <View style={styles.scanTarget}>
            <Ionicons name="scan" size={48} color={KlikdBrandSystem.colors.primary.klikd_green} />
            <Text style={styles.scanText}>Scanning for AR objects...</Text>
          </View>
        </Animated.View>
      )}

      {/* Top UI Controls */}
      <Animated.View style={[styles.topControls, { opacity: fadeAnim }]}>
        <View style={styles.topLeft}>
          <ModernKlikdButton
            title=""
            variant="icon"
            size="medium"
            icon="arrow-back"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
          
          <KlikdBadge 
            text={`${scanMode.toUpperCase()} MODE`}
            variant="premium"
            size="small"
          />
        </View>

        <View style={styles.topRight}>
          <ModernKlikdButton
            title=""
            variant="icon"
            size="medium"
            icon={flashMode === 'on' ? 'flash' : flashMode === 'auto' ? 'flash-outline' : 'flash-off'}
            onPress={() => {
              const modes: ('off' | 'on' | 'auto')[] = ['off', 'on', 'auto'];
              const currentIndex = modes.indexOf(flashMode);
              setFlashMode(modes[(currentIndex + 1) % modes.length]);
            }}
            style={styles.flashButton}
          />
          
          <ModernKlikdButton
            title=""
            variant="icon"
            size="medium"
            icon="options"
            onPress={() => navigation.navigate('CameraSettings')}
            style={styles.settingsButton}
          />
        </View>
      </Animated.View>

      {/* Scan Mode Selector */}
      <Animated.View style={[styles.scanModeSelector, { opacity: fadeAnim }]}>
        {scanModes.map((mode) => (
          <TouchableOpacity
            key={mode.id}
            style={[
              styles.scanModeButton,
              scanMode === mode.id && styles.activeScanMode,
              { borderColor: scanMode === mode.id ? mode.color : 'transparent' }
            ]}
            onPress={() => setScanMode(mode.id as any)}
          >
            <Ionicons 
              name={mode.icon as any} 
              size={20} 
              color={scanMode === mode.id ? mode.color : '#666'} 
            />
            <Text style={[
              styles.scanModeText,
              { color: scanMode === mode.id ? mode.color : '#666' }
            ]}>
              {mode.label}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Center Scan Button */}
      <Animated.View style={[
        styles.scanButtonContainer,
        { 
          opacity: fadeAnim,
          transform: [{ scale: pulseAnim }]
        }
      ]}>
        <TouchableOpacity
          style={[
            styles.scanButton,
            isScanning && styles.scanButtonActive
          ]}
          onPress={handleScan}
          disabled={isScanning}
        >
          <View style={styles.scanButtonInner}>
            {isScanning ? (
              <Ionicons name="sync" size={32} color="white" />
            ) : (
              <Ionicons name="scan" size={32} color="white" />
            )}
          </View>
        </TouchableOpacity>
        
        <Text style={styles.scanButtonText}>
          {isScanning ? 'Scanning...' : 'Tap to Scan'}
        </Text>
      </Animated.View>

      {/* Bottom Controls */}
      <Animated.View style={[styles.bottomControls, { opacity: fadeAnim }]}>
        <ModernKlikdButton
          title=""
          variant="icon"
          size="large"
          icon="images"
          onPress={() => navigation.navigate('ARGallery')}
          style={styles.galleryButton}
        />
        
        <ModernKlikdButton
          title=""
          variant="icon"
          size="large"
          icon="color-filter"
          onPress={() => navigation.navigate('ARFilters')}
          style={styles.filtersButton}
        />
        
        <ModernKlikdButton
          title=""
          variant="icon"
          size="large"
          icon="help-circle"
          onPress={() => navigation.navigate('ARTutorial')}
          style={styles.helpButton}
        />
      </Animated.View>

      {/* Quest Progress Panel */}
      {scanMode === 'quest' && (
        <Animated.View style={[
          styles.questPanel,
          { transform: [{ translateY: questPanelAnim }] }
        ]}>
          <TouchableOpacity 
            style={styles.questPanelHandle}
            onPress={toggleQuestPanel}
          >
            <View style={styles.panelHandle} />
          </TouchableOpacity>
          
          <View style={styles.questContent}>
            <View style={styles.questHeader}>
              <Text style={styles.questTitle}>{mockQuest.title}</Text>
              <KlikdBadge text={mockQuest.timeLeft} variant="warning" size="small" />
            </View>
            
            <Text style={styles.questDescription}>{mockQuest.description}</Text>
            
            <View style={styles.questProgressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressText}>
                  Progress: {mockQuest.found}/{mockQuest.target} found
                </Text>
                <Text style={styles.progressPercentage}>
                  {Math.round(mockQuest.progress * 100)}%
                </Text>
              </View>
              
              <KlikdProgress 
                progress={mockQuest.progress}
                height={8}
                animated={true}
              />
            </View>
            
            <View style={styles.questReward}>
              <Ionicons name="gift" size={16} color={KlikdBrandSystem.colors.primary.klikd_green} />
              <Text style={styles.rewardText}>{mockQuest.reward}</Text>
            </View>
          </View>
        </Animated.View>
      )}

      {/* AR Objects Overlay */}
      {arObjects.length > 0 && (
        <View style={styles.arObjectsOverlay}>
          {arObjects.map((obj, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.arObject,
                { left: obj.x, top: obj.y }
              ]}
              onPress={() => navigation.navigate('ARObjectViewer', { objectId: obj.id })}
            >
              <View style={styles.arObjectMarker}>
                <Ionicons name="diamond" size={24} color={KlikdBrandSystem.colors.primary.klikd_green} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KlikdBrandSystem.colors.ui.dark_bg,
  },
  cameraView: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  cameraText: {
    fontSize: 24,
    color: 'white',
    marginBottom: 8,
  },
  cameraSubtext: {
    fontSize: 14,
    color: '#666',
  },
  scanGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridLine: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: KlikdBrandSystem.colors.primary.klikd_green,
    opacity: 0.3,
  },
  scanTarget: {
    alignItems: 'center',
    gap: 12,
  },
  scanText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  topControls: {
    position: 'absolute',
    top: 44,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  topRight: {
    flexDirection: 'row',
    gap: 8,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  flashButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  settingsButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanModeSelector: {
    position: 'absolute',
    top: 120,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    zIndex: 10,
  },
  scanModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 2,
  },
  activeScanMode: {
    backgroundColor: 'rgba(236, 255, 0, 0.1)',
  },
  scanModeText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  scanButtonContainer: {
    position: 'absolute',
    bottom: 200,
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  scanButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: KlikdBrandSystem.colors.primary.klikd_green,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scanButtonActive: {
    backgroundColor: '#FFD700',
  },
  scanButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    marginTop: 8,
    fontFamily: 'Inter',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    zIndex: 10,
  },
  galleryButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  filtersButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  helpButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  questPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 400,
    backgroundColor: KlikdBrandSystem.colors.ui.dark_bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 5,
  },
  questPanelHandle: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  panelHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
  },
  questContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    flex: 1,
    marginRight: 12,
    fontFamily: 'Inter',
  },
  questDescription: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
    marginBottom: 20,
    fontFamily: 'Inter',
  },
  questProgressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Inter',
  },
  progressPercentage: {
    fontSize: 14,
    color: KlikdBrandSystem.colors.primary.klikd_green,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  questReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rewardText: {
    fontSize: 14,
    color: KlikdBrandSystem.colors.primary.klikd_green,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  arObjectsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'box-none',
  },
  arObject: {
    position: 'absolute',
  },
  arObjectMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(236, 255, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: KlikdBrandSystem.colors.primary.klikd_green,
  },
});
