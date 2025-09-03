import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { 
  EnhancedMissionCard, 
  EnhancedAvatar, 
  EnhancedButton, 
  EnhancedStatsCard 
} from '../design/EnhancedComponents';
import { figmaIntegration, klikdDesignSystem } from '../design/FigmaIntegration';

export default function DesignShowcaseScreen({ navigation }: any) {
  const [designTokens, setDesignTokens] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    initializeFigmaIntegration();
  }, []);

  const initializeFigmaIntegration = async () => {
    try {
      const connected = await figmaIntegration.connectToFigma();
      setIsConnected(connected);
      
      if (connected) {
        const tokens = await figmaIntegration.fetchDesignTokens();
        setDesignTokens(tokens);
        await figmaIntegration.syncWithFigma();
      }
    } catch (error) {
      console.error('Figma integration failed:', error);
    }
  };

  const mockMissions = [
    {
      id: '1',
      title: 'Discover Riyadh Boulevard',
      description: 'Explore the entertainment district and complete AR challenges',
      xp: 250,
      difficulty: 'medium' as const,
      category: 'Exploration',
      participants: 42,
      timeLeft: '2h 30m'
    },
    {
      id: '2', 
      title: 'Coffee Shop Challenge',
      description: 'Visit 3 local cafes and share your experience',
      xp: 150,
      difficulty: 'easy' as const,
      category: 'Social',
      participants: 18,
      timeLeft: '1 day'
    },
    {
      id: '3',
      title: 'Heritage Site Quest',
      description: 'Learn about Saudi culture at historical landmarks',
      xp: 500,
      difficulty: 'hard' as const,
      category: 'Cultural',
      participants: 7,
      timeLeft: '4h 15m'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Figma Design System</Text>
          <View style={[styles.connectionStatus, { 
            backgroundColor: isConnected ? klikdDesignSystem.colors.primary.klikd_green : klikdDesignSystem.colors.primary.klikd_red 
          }]}>
            <Text style={styles.connectionText}>
              {isConnected ? 'Connected' : 'Offline'}
            </Text>
          </View>
        </View>

        {/* Design System Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎨 Design System Overview</Text>
          <View style={styles.colorPalette}>
            <View style={styles.colorRow}>
              <View style={[styles.colorSwatch, { backgroundColor: klikdDesignSystem.colors.primary.klikd_blue }]} />
              <View style={[styles.colorSwatch, { backgroundColor: klikdDesignSystem.colors.primary.klikd_gold }]} />
              <View style={[styles.colorSwatch, { backgroundColor: klikdDesignSystem.colors.primary.klikd_green }]} />
              <View style={[styles.colorSwatch, { backgroundColor: klikdDesignSystem.colors.cultural.saudi_green }]} />
            </View>
            <Text style={styles.paletteLabel}>Klikd Brand Colors</Text>
          </View>
        </View>

        {/* Enhanced Components Showcase */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚀 Enhanced Components</Text>
          
          {/* Mission Cards */}
          <Text style={styles.componentLabel}>Mission Cards</Text>
          {mockMissions.map((mission) => (
            <EnhancedMissionCard
              key={mission.id}
              title={mission.title}
              description={mission.description}
              xp={mission.xp}
              difficulty={mission.difficulty}
              category={mission.category}
              participants={mission.participants}
              timeLeft={mission.timeLeft}
              onPress={() => console.log('Mission pressed:', mission.title)}
            />
          ))}

          {/* Avatar Showcase */}
          <Text style={styles.componentLabel}>Avatar Components</Text>
          <View style={styles.avatarRow}>
            <EnhancedAvatar 
              size="small" 
              status="online" 
              onPress={() => console.log('Small avatar pressed')}
            />
            <EnhancedAvatar 
              size="medium" 
              status="away" 
              badge={true} 
              level={15}
              onPress={() => console.log('Medium avatar pressed')}
            />
            <EnhancedAvatar 
              size="large" 
              status="offline" 
              badge={true} 
              level={42}
              onPress={() => console.log('Large avatar pressed')}
            />
          </View>

          {/* Button Showcase */}
          <Text style={styles.componentLabel}>Enhanced Buttons</Text>
          <View style={styles.buttonGrid}>
            <EnhancedButton
              title="Primary Action"
              variant="primary"
              size="medium"
              icon="rocket"
              onPress={() => console.log('Primary button pressed')}
            />
            <EnhancedButton
              title="Secondary"
              variant="secondary"
              size="medium"
              icon="heart-outline"
              onPress={() => console.log('Secondary button pressed')}
            />
            <EnhancedButton
              title="Cultural Theme"
              variant="cultural"
              size="medium"
              icon="flag"
              onPress={() => console.log('Cultural button pressed')}
            />
            <EnhancedButton
              title="Small Action"
              variant="primary"
              size="small"
              onPress={() => console.log('Small button pressed')}
            />
          </View>

          {/* Stats Cards */}
          <Text style={styles.componentLabel}>Statistics Cards</Text>
          <View style={styles.statsGrid}>
            <EnhancedStatsCard
              title="Total XP"
              value="12,450"
              icon="star"
              trend="up"
              trendValue="+15%"
              color={klikdDesignSystem.colors.primary.klikd_gold}
            />
            <EnhancedStatsCard
              title="Missions"
              value="87"
              icon="checkmark-circle"
              trend="up"
              trendValue="+5"
              color={klikdDesignSystem.colors.primary.klikd_green}
            />
          </View>
          
          <View style={styles.statsGrid}>
            <EnhancedStatsCard
              title="Friends"
              value="234"
              icon="people"
              trend="neutral"
              trendValue="0"
              color={klikdDesignSystem.colors.primary.klikd_blue}
            />
            <EnhancedStatsCard
              title="Rank"
              value="#42"
              icon="trophy"
              trend="down"
              trendValue="-2"
              color={klikdDesignSystem.colors.cultural.heritage_gold}
            />
          </View>
        </View>

        {/* Design Tokens */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔧 Design Tokens</Text>
          {designTokens.length > 0 ? (
            designTokens.map((token, index) => (
              <View key={index} style={styles.tokenCard}>
                <Text style={styles.tokenName}>{token.name}</Text>
                <Text style={styles.tokenType}>{token.type}</Text>
                <Text style={styles.tokenValue}>{token.value}</Text>
              </View>
            ))
          ) : (
            <View style={styles.placeholderCard}>
              <Ionicons name="cloud-offline" size={48} color={klikdDesignSystem.colors.neutral.light_gray} />
              <Text style={styles.placeholderText}>
                Connect to Figma MCP to sync design tokens
              </Text>
            </View>
          )}
        </View>

        {/* Integration Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Integration Status</Text>
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Ionicons 
                name={isConnected ? "checkmark-circle" : "close-circle"} 
                size={24} 
                color={isConnected ? klikdDesignSystem.colors.primary.klikd_green : klikdDesignSystem.colors.primary.klikd_red} 
              />
              <Text style={styles.statusText}>
                Figma MCP Connection: {isConnected ? 'Active' : 'Inactive'}
              </Text>
            </View>
            <View style={styles.statusRow}>
              <Ionicons name="checkmark-circle" size={24} color={klikdDesignSystem.colors.primary.klikd_green} />
              <Text style={styles.statusText}>Design System: Loaded</Text>
            </View>
            <View style={styles.statusRow}>
              <Ionicons name="checkmark-circle" size={24} color={klikdDesignSystem.colors.primary.klikd_green} />
              <Text style={styles.statusText}>Enhanced Components: Ready</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <EnhancedButton
            title="Sync with Figma"
            variant="primary"
            size="large"
            icon="refresh"
            onPress={initializeFigmaIntegration}
          />
          <EnhancedButton
            title="Back to App"
            variant="secondary"
            size="large"
            icon="arrow-back"
            onPress={() => navigation.goBack()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  connectionStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  connectionText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 16,
  },
  componentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: klikdDesignSystem.colors.neutral.light_gray,
    marginTop: 20,
    marginBottom: 12,
  },
  colorPalette: {
    alignItems: 'center',
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#333',
  },
  paletteLabel: {
    fontSize: 14,
    color: klikdDesignSystem.colors.neutral.light_gray,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
  },
  buttonGrid: {
    gap: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  tokenCard: {
    backgroundColor: klikdDesignSystem.colors.neutral.dark_gray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: klikdDesignSystem.colors.primary.klikd_blue,
  },
  tokenName: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  tokenType: {
    fontSize: 12,
    color: klikdDesignSystem.colors.primary.klikd_blue,
    textTransform: 'uppercase',
  },
  tokenValue: {
    fontSize: 12,
    color: klikdDesignSystem.colors.neutral.light_gray,
  },
  placeholderCard: {
    backgroundColor: klikdDesignSystem.colors.neutral.dark_gray,
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: klikdDesignSystem.colors.neutral.medium_gray,
  },
  placeholderText: {
    fontSize: 14,
    color: klikdDesignSystem.colors.neutral.light_gray,
    textAlign: 'center',
    marginTop: 12,
  },
  statusCard: {
    backgroundColor: klikdDesignSystem.colors.neutral.dark_gray,
    borderRadius: 12,
    padding: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    color: 'white',
    marginLeft: 12,
  },
  actionSection: {
    padding: 20,
    gap: 12,
  },
});
