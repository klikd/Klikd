// 8.2 AR Scan Result Screen - Display scan results with rewards and actions
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { KlikdScreenContainer, KlikdCard, KlikdBadge, KlikdProgress } from '../../components/KlikdScalableComponents';
import { ModernKlikdButton } from '../../design/FigmaModernUI';
import { KlikdBrandSystem } from '../../design/KlikdBrandSystem';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

interface ARScanResultScreenProps {
  navigation: any;
  route: { params: { scanData: any; questId?: string } };
}

const ARScanResultScreen: React.FC<ARScanResultScreenProps> = ({ navigation, route }) => {
  const { scanData, questId } = route.params;
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const coinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      // Coin animation
      Animated.timing(coinAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '#FFD700';
      case 'epic': return '#9C27B0';
      case 'rare': return '#2196F3';
      case 'uncommon': return '#4CAF50';
      default: return '#757575';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'star';
      case 'epic': return 'diamond';
      case 'rare': return 'gem';
      case 'uncommon': return 'trophy';
      default: return 'cube';
    }
  };

  return (
    <KlikdScreenContainer 
      showHeader={true}
      showBackButton={true}
      onBackPress={() => navigation.goBack()}
      headerTitle="Scan Result"
    >
      <View style={styles.container}>
        {/* Success Animation */}
        <Animated.View style={[
          styles.successSection,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}>
          <View style={[styles.successIcon, { backgroundColor: getRarityColor(scanData.rarity) }]}>
            <Ionicons 
              name={getRarityIcon(scanData.rarity) as any} 
              size={48} 
              color="white" 
            />
          </View>
          
          <Text style={styles.successTitle}>Treasure Found!</Text>
          <Text style={styles.itemName}>{scanData.name}</Text>
          
          <KlikdBadge 
            text={scanData.rarity.toUpperCase()}
            variant={scanData.rarity === 'legendary' ? 'premium' : 'info'}
            size="medium"
            icon={getRarityIcon(scanData.rarity)}
          />
        </Animated.View>

        {/* Rewards Section */}
        <Animated.View style={[
          styles.rewardsSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <KlikdCard variant="elevated" style={styles.rewardsCard}>
            <Text style={styles.rewardsTitle}>Rewards Earned</Text>
            
            <View style={styles.rewardsList}>
              <Animated.View style={[
                styles.rewardItem,
                {
                  transform: [{
                    scale: coinAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.8, 1.2, 1],
                    })
                  }]
                }
              ]}>
                <View style={styles.rewardIcon}>
                  <Ionicons name="diamond" size={24} color={KlikdBrandSystem.colors.primary.klikd_green} />
                </View>
                <View style={styles.rewardInfo}>
                  <Text style={styles.rewardAmount}>+{scanData.coins}</Text>
                  <Text style={styles.rewardLabel}>Coins</Text>
                </View>
              </Animated.View>

              <Animated.View style={[
                styles.rewardItem,
                {
                  transform: [{
                    scale: coinAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.8, 1.2, 1],
                    })
                  }]
                }
              ]}>
                <View style={styles.rewardIcon}>
                  <Ionicons name="flash" size={24} color="#FFD700" />
                </View>
                <View style={styles.rewardInfo}>
                  <Text style={styles.rewardAmount}>+{scanData.xp}</Text>
                  <Text style={styles.rewardLabel}>XP</Text>
                </View>
              </Animated.View>
            </View>
          </KlikdCard>
        </Animated.View>

        {/* Quest Progress (if applicable) */}
        {questId && (
          <Animated.View style={[
            styles.questSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}>
            <KlikdCard variant="quest" style={styles.questCard}>
              <View style={styles.questHeader}>
                <Ionicons name="compass" size={20} color={KlikdBrandSystem.colors.primary.klikd_green} />
                <Text style={styles.questTitle}>Quest Progress Updated</Text>
              </View>
              
              <Text style={styles.questDescription}>
                Coffee Shop AR Hunt - 2/3 treasures found
              </Text>
              
              <KlikdProgress progress={0.67} height={6} animated={true} />
              
              <Text style={styles.questRemaining}>
                1 more treasure to complete this quest!
              </Text>
            </KlikdCard>
          </Animated.View>
        )}

        {/* Item Details */}
        <Animated.View style={[
          styles.detailsSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <KlikdCard variant="outlined" style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Item Details</Text>
            
            <View style={styles.detailsList}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Type:</Text>
                <Text style={styles.detailValue}>AR Treasure</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Rarity:</Text>
                <Text style={[styles.detailValue, { color: getRarityColor(scanData.rarity) }]}>
                  {scanData.rarity}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Location:</Text>
                <Text style={styles.detailValue}>Riyadh City Center</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Discovered:</Text>
                <Text style={styles.detailValue}>Just now</Text>
              </View>
            </View>
          </KlikdCard>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View style={[
          styles.actionsSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <ModernKlikdButton
            title="Share Discovery"
            variant="primary"
            size="large"
            icon="share"
            onPress={() => navigation.navigate('ARShare', { 
              contentId: scanData.id, 
              type: 'ar_object' 
            })}
            style={styles.shareButton}
          />
          
          <View style={styles.secondaryActions}>
            <ModernKlikdButton
              title="View in AR"
              variant="secondary"
              size="medium"
              icon="cube"
              onPress={() => navigation.navigate('ARObjectViewer', { 
                objectId: scanData.id 
              })}
              style={styles.viewButton}
            />
            
            <ModernKlikdButton
              title="Continue Scanning"
              variant="secondary"
              size="medium"
              icon="scan"
              onPress={() => navigation.goBack()}
              style={styles.continueButton}
            />
          </View>
        </Animated.View>
      </View>
    </KlikdScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  successSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: KlikdBrandSystem.colors.primary.klikd_white,
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: KlikdBrandSystem.colors.primary.klikd_green,
    marginBottom: 12,
    fontFamily: 'Inter',
  },
  rewardsSection: {
    marginBottom: 24,
  },
  rewardsCard: {
    padding: 20,
  },
  rewardsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: KlikdBrandSystem.colors.primary.klikd_white,
    marginBottom: 16,
    fontFamily: 'Inter',
  },
  rewardsList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  rewardItem: {
    alignItems: 'center',
    gap: 8,
  },
  rewardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardInfo: {
    alignItems: 'center',
  },
  rewardAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: KlikdBrandSystem.colors.primary.klikd_white,
    fontFamily: 'Inter',
  },
  rewardLabel: {
    fontSize: 12,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    fontFamily: 'Inter',
  },
  questSection: {
    marginBottom: 24,
  },
  questCard: {
    padding: 16,
  },
  questHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  questTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: KlikdBrandSystem.colors.primary.klikd_white,
    fontFamily: 'Inter',
  },
  questDescription: {
    fontSize: 14,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    marginBottom: 12,
    fontFamily: 'Inter',
  },
  questRemaining: {
    fontSize: 12,
    color: KlikdBrandSystem.colors.primary.klikd_green,
    marginTop: 8,
    fontFamily: 'Inter',
  },
  detailsSection: {
    marginBottom: 32,
  },
  detailsCard: {
    padding: 20,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: KlikdBrandSystem.colors.primary.klikd_white,
    marginBottom: 16,
    fontFamily: 'Inter',
  },
  detailsList: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 14,
    color: KlikdBrandSystem.colors.ui.soft_gray,
    fontFamily: 'Inter',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: KlikdBrandSystem.colors.primary.klikd_white,
    fontFamily: 'Inter',
  },
  actionsSection: {
    gap: 16,
  },
  shareButton: {
    marginBottom: 8,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  viewButton: {
    flex: 1,
  },
  continueButton: {
    flex: 1,
  },
});
