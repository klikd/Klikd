// Modern Camera Screen with Quest-First Layout and Klikd Branding
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { KlikdBrandSystem } from '../design/KlikdBrandSystem';
import { ModernKlikdButton, ModernFloatingButton } from '../design/FigmaModernUI';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ModernCameraScreenProps {
  navigation: any;
}

// Quest-First Camera Interface
export default function ModernCameraScreen({ navigation }: ModernCameraScreenProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [activeQuest, setActiveQuest] = useState({
    title: "Downtown Riyadh AR Hunt",
    progress: 2,
    total: 5,
    nextTarget: "Scan the Kingdom Centre Tower",
    xp: 500,
  });
  const [scanMode, setScanMode] = useState<'quest' | 'free' | 'ar'>('quest');
  const [detectedObjects, setDetectedObjects] = useState<string[]>([]);
  
  // Animations
  const scanAnimation = useRef(new Animated.Value(0)).current;
  const questPanelAnimation = useRef(new Animated.Value(0)).current;
  const glowAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Continuous glow animation for active elements
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Pulse animation for scan button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleScan = () => {
    setIsScanning(true);
    
    // Scan animation
    Animated.sequence([
      Animated.timing(scanAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scanAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Simulate object detection
    setTimeout(() => {
      setDetectedObjects(['Kingdom Centre Tower', 'AR Marker', 'Quest Point']);
      setIsScanning(false);
      
      // Update quest progress
      if (scanMode === 'quest') {
        setActiveQuest(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 1, prev.total),
          nextTarget: prev.progress + 1 < prev.total ? "Find the next landmark" : "Quest Complete!",
        }));
      }
    }, 2000);
  };

  const [questPanelOpen, setQuestPanelOpen] = useState(false);
  
  const toggleQuestPanel = () => {
    const newValue = questPanelOpen ? 0 : 1;
    setQuestPanelOpen(!questPanelOpen);
    Animated.spring(questPanelAnimation, {
      toValue: newValue,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const scanRotate = scanAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const questPanelTranslateY = questPanelAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [200, 0],
  });

  const glowOpacity = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Camera Viewfinder Background */}
      <View style={styles.cameraBackground}>
        {/* Simulated camera feed with AR overlay */}
        <View style={styles.arOverlay}>
          {/* Scanning Grid */}
          <View style={styles.scanningGrid}>
            {Array.from({ length: 20 }).map((_, i) => (
              <View key={i} style={styles.gridLine} />
            ))}
          </View>

          {/* AR Detection Points */}
          {detectedObjects.map((object, index) => (
            <Animated.View
              key={object}
              style={[
                styles.detectionPoint,
                {
                  top: 150 + (index * 100),
                  left: 50 + (index * 80),
                  opacity: glowOpacity,
                }
              ]}
            >
              <View style={styles.detectionMarker}>
                <Ionicons name="location" size={24} color={KlikdBrandSystem.colors.primary.klikd_green} />
              </View>
              <Text style={styles.detectionLabel}>{object}</Text>
            </Animated.View>
          ))}

          {/* Quest Target Indicator */}
          {scanMode === 'quest' && (
            <Animated.View style={[
              styles.questTarget,
              {
                opacity: glowOpacity,
                transform: [{ scale: pulseAnimation }],
              }
            ]}>
              <View style={styles.targetReticle}>
                <View style={styles.targetCorner} />
                <View style={[styles.targetCorner, styles.targetCornerTR]} />
                <View style={[styles.targetCorner, styles.targetCornerBL]} />
                <View style={[styles.targetCorner, styles.targetCornerBR]} />
              </View>
              <Text style={styles.targetLabel}>{activeQuest.nextTarget}</Text>
            </Animated.View>
          )}
        </View>
      </View>

      {/* Top UI Layer */}
      <View style={styles.topUI}>
        {/* Header Controls */}
        <View style={styles.headerControls}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.scanModeSelector}>
            {['quest', 'free', 'ar'].map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.modeButton,
                  scanMode === mode && styles.activeModeButton
                ]}
                onPress={() => setScanMode(mode as any)}
              >
                <Text style={[
                  styles.modeButtonText,
                  scanMode === mode && styles.activeModeButtonText
                ]}>
                  {mode.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Quest Progress Bar */}
        {scanMode === 'quest' && (
          <View style={styles.questProgressContainer}>
            <View style={styles.questProgressBar}>
              <Animated.View 
                style={[
                  styles.questProgressFill,
                  {
                    width: `${(activeQuest.progress / activeQuest.total) * 100}%`,
                    backgroundColor: KlikdBrandSystem.colors.primary.klikd_green,
                  }
                ]} 
              />
            </View>
            <Text style={styles.questProgressText}>
              {activeQuest.progress}/{activeQuest.total} • {activeQuest.xp} XP
            </Text>
          </View>
        )}
      </View>

      {/* Bottom UI Layer */}
      <View style={styles.bottomUI}>
        {/* Quest Panel Toggle */}
        <TouchableOpacity 
          style={styles.questPanelToggle}
          onPress={toggleQuestPanel}
        >
          <Ionicons name="flash" size={20} color={KlikdBrandSystem.colors.primary.klikd_green} />
          <Text style={styles.questPanelToggleText}>Active Quest</Text>
          <Ionicons 
            name={questPanelOpen ? "chevron-down" : "chevron-up"} 
            size={16} 
            color="white" 
          />
        </TouchableOpacity>

        {/* Main Scan Button */}
        <Animated.View style={[
          styles.scanButtonContainer,
          {
            transform: [
              { scale: pulseAnimation },
              { rotate: scanRotate }
            ]
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
                <Animated.View style={{ transform: [{ rotate: scanRotate }] }}>
                  <Ionicons name="sync" size={32} color={KlikdBrandSystem.colors.primary.klikd_black} />
                </Animated.View>
              ) : (
                <Ionicons name="scan" size={32} color={KlikdBrandSystem.colors.primary.klikd_black} />
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <ModernFloatingButton
            icon="images"
            variant="primary"
            size={48}
            onPress={() => console.log('Gallery')}
          />
          
          <ModernFloatingButton
            icon="flash"
            variant="quest"
            size={48}
            onPress={() => navigation.navigate('Missions')}
          />
        </View>
      </View>

      {/* Sliding Quest Panel */}
      <Animated.View style={[
        styles.questPanel,
        {
          transform: [{ translateY: questPanelTranslateY }]
        }
      ]}>
        <View style={styles.questPanelHeader}>
          <Text style={styles.questPanelTitle}>{activeQuest.title}</Text>
          <TouchableOpacity onPress={toggleQuestPanel}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.questPanelContent}>
          <Text style={styles.questPanelDescription}>
            Discover hidden gems in the heart of Saudi Arabia using AR. Scan landmarks, collect rewards, and compete with your squad!
          </Text>
          
          <View style={styles.questPanelStats}>
            <View style={styles.questStat}>
              <Ionicons name="location" size={16} color={KlikdBrandSystem.colors.primary.klikd_green} />
              <Text style={styles.questStatText}>Downtown Riyadh</Text>
            </View>
            <View style={styles.questStat}>
              <Ionicons name="people" size={16} color={KlikdBrandSystem.colors.primary.klikd_green} />
              <Text style={styles.questStatText}>127 active</Text>
            </View>
            <View style={styles.questStat}>
              <Ionicons name="time" size={16} color={KlikdBrandSystem.colors.primary.klikd_green} />
              <Text style={styles.questStatText}>2h 15m left</Text>
            </View>
          </View>

          <ModernKlikdButton
            title="View Full Quest"
            variant="primary"
            size="medium"
            icon="arrow-forward"
            onPress={() => navigation.navigate('Missions')}
            style={styles.questPanelButton}
          />
        </View>
      </Animated.View>

      {/* Scanning Overlay */}
      {isScanning && (
        <View style={styles.scanningOverlay}>
          <Animated.View style={[
            styles.scanningLine,
            {
              transform: [{ translateY: scanAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, screenHeight],
              })}]
            }
          ]} />
          <Text style={styles.scanningText}>Scanning for AR markers...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraBackground: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    position: 'relative',
  },
  arOverlay: {
    flex: 1,
    position: 'relative',
  },
  scanningGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: KlikdBrandSystem.colors.primary.klikd_green,
    opacity: 0.2,
  },
  
  // Top UI
  topUI: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 44,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  headerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanModeSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 4,
  },
  modeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  activeModeButton: {
    backgroundColor: KlikdBrandSystem.colors.primary.klikd_green,
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Inter',
  },
  activeModeButtonText: {
    color: KlikdBrandSystem.colors.primary.klikd_black,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Quest Progress
  questProgressContainer: {
    alignItems: 'center',
  },
  questProgressBar: {
    width: screenWidth - 32,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  questProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  questProgressText: {
    fontSize: 12,
    color: 'white',
    marginTop: 8,
    fontFamily: 'Inter',
    fontWeight: '600',
  },
  
  // AR Detection
  detectionPoint: {
    position: 'absolute',
    alignItems: 'center',
  },
  detectionMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(236, 255, 0, 0.2)',
    borderWidth: 2,
    borderColor: KlikdBrandSystem.colors.primary.klikd_green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detectionLabel: {
    fontSize: 12,
    color: 'white',
    marginTop: 4,
    fontWeight: '600',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  
  // Quest Target
  questTarget: {
    position: 'absolute',
    top: screenHeight * 0.4,
    left: screenWidth * 0.3,
    alignItems: 'center',
  },
  targetReticle: {
    width: 80,
    height: 80,
    position: 'relative',
  },
  targetCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: KlikdBrandSystem.colors.primary.klikd_green,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    top: 0,
    left: 0,
  },
  targetCornerTR: {
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 0,
    top: 0,
    right: 0,
    left: 'auto',
  },
  targetCornerBL: {
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderTopWidth: 0,
    bottom: 0,
    top: 'auto',
    left: 0,
  },
  targetCornerBR: {
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    bottom: 0,
    right: 0,
    top: 'auto',
    left: 'auto',
  },
  targetLabel: {
    fontSize: 14,
    color: KlikdBrandSystem.colors.primary.klikd_green,
    marginTop: 8,
    fontWeight: '700',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  
  // Bottom UI
  bottomUI: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 34,
    paddingHorizontal: 16,
    alignItems: 'center',
    zIndex: 10,
  },
  questPanelToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
    gap: 8,
  },
  questPanelToggleText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  
  // Scan Button
  scanButtonContainer: {
    marginBottom: 20,
  },
  scanButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: KlikdBrandSystem.colors.primary.klikd_green,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: KlikdBrandSystem.colors.primary.klikd_green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  scanButtonActive: {
    backgroundColor: KlikdBrandSystem.colors.ui.link_cta,
  },
  scanButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: KlikdBrandSystem.colors.primary.klikd_green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  
  // Quest Panel
  questPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: KlikdBrandSystem.colors.ui.dark_bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 34,
    zIndex: 5,
  },
  questPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  questPanelTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    fontFamily: 'Inter',
  },
  questPanelContent: {
    gap: 16,
  },
  questPanelDescription: {
    fontSize: 14,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    lineHeight: 20,
    fontFamily: 'Inter',
  },
  questPanelStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  questStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  questStatText: {
    fontSize: 12,
    color: 'white',
    fontFamily: 'Inter',
  },
  questPanelButton: {
    alignSelf: 'stretch',
  },
  
  // Scanning Overlay
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 15,
  },
  scanningLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: KlikdBrandSystem.colors.primary.klikd_green,
    shadowColor: KlikdBrandSystem.colors.primary.klikd_green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  scanningText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    fontFamily: 'Inter',
    marginTop: 20,
  },
});
