import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface BusinessCampaign {
  id: string;
  title: string;
  type: 'sponsored_mission' | 'ar_experience' | 'voucher_campaign' | 'event';
  status: 'active' | 'pending' | 'completed' | 'draft';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  targetAudience: {
    ageRange: string;
    location: string;
    interests: string[];
  };
  metrics: {
    reach: number;
    engagement: number;
    conversions: number;
    footfall: number;
  };
  influencers: number;
  vouchers: {
    total: number;
    redeemed: number;
    value: number;
  };
}

interface BusinessStats {
  totalCampaigns: number;
  activeInfluencers: number;
  totalReach: number;
  conversionRate: number;
  totalSpent: number;
  roi: number;
  footfallIncrease: number;
}

const MOCK_CAMPAIGNS: BusinessCampaign[] = [
  {
    id: '1',
    title: 'Ramadan Special AR Experience',
    type: 'ar_experience',
    status: 'active',
    budget: 25000,
    spent: 18500,
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    targetAudience: {
      ageRange: '18-35',
      location: 'Riyadh, Jeddah',
      interests: ['Food', 'Culture', 'AR'],
    },
    metrics: {
      reach: 125000,
      engagement: 8.5,
      conversions: 2340,
      footfall: 450,
    },
    influencers: 12,
    vouchers: {
      total: 1000,
      redeemed: 680,
      value: 50,
    },
  },
  {
    id: '2',
    title: 'New Store Opening Campaign',
    type: 'sponsored_mission',
    status: 'pending',
    budget: 15000,
    spent: 0,
    startDate: '2024-04-01',
    endDate: '2024-04-15',
    targetAudience: {
      ageRange: '25-45',
      location: 'Riyadh',
      interests: ['Shopping', 'Fashion'],
    },
    metrics: {
      reach: 0,
      engagement: 0,
      conversions: 0,
      footfall: 0,
    },
    influencers: 8,
    vouchers: {
      total: 500,
      redeemed: 0,
      value: 100,
    },
  },
];

const MOCK_BUSINESS_STATS: BusinessStats = {
  totalCampaigns: 15,
  activeInfluencers: 28,
  totalReach: 2500000,
  conversionRate: 4.2,
  totalSpent: 180000,
  roi: 3.8,
  footfallIncrease: 25,
};

export default function BusinessDashboard({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'influencers' | 'analytics' | 'vouchers'>('overview');
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<BusinessCampaign | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#00C851';
      case 'pending': return '#FF8800';
      case 'completed': return '#007AFF';
      case 'draft': return '#999';
      default: return '#666';
    }
  };

  const renderOverview = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="briefcase" size={24} color="#007AFF" />
          <Text style={styles.statValue}>{MOCK_BUSINESS_STATS.totalCampaigns}</Text>
          <Text style={styles.statLabel}>Total Campaigns</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="people" size={24} color="#00C851" />
          <Text style={styles.statValue}>{MOCK_BUSINESS_STATS.activeInfluencers}</Text>
          <Text style={styles.statLabel}>Active Influencers</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="eye" size={24} color="#FF6B6B" />
          <Text style={styles.statValue}>{(MOCK_BUSINESS_STATS.totalReach / 1000000).toFixed(1)}M</Text>
          <Text style={styles.statLabel}>Total Reach</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="trending-up" size={24} color="#FFD700" />
          <Text style={styles.statValue}>{MOCK_BUSINESS_STATS.roi}x</Text>
          <Text style={styles.statLabel}>ROI</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Campaigns</Text>
        {MOCK_CAMPAIGNS.filter(c => c.status === 'active').map((campaign) => (
          <TouchableOpacity 
            key={campaign.id} 
            style={styles.campaignCard}
            onPress={() => setSelectedCampaign(campaign)}
          >
            <View style={styles.campaignHeader}>
              <View style={styles.campaignInfo}>
                <Text style={styles.campaignTitle}>{campaign.title}</Text>
                <Text style={styles.campaignType}>{campaign.type.replace('_', ' ').toUpperCase()}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(campaign.status) }]}>
                <Text style={styles.statusText}>{campaign.status.toUpperCase()}</Text>
              </View>
            </View>
            
            <View style={styles.campaignMetrics}>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{campaign.metrics.reach.toLocaleString()}</Text>
                <Text style={styles.metricLabel}>Reach</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{campaign.metrics.conversions}</Text>
                <Text style={styles.metricLabel}>Conversions</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{campaign.influencers}</Text>
                <Text style={styles.metricLabel}>Influencers</Text>
              </View>
            </View>

            <View style={styles.budgetProgress}>
              <Text style={styles.budgetText}>
                SAR {campaign.spent.toLocaleString()} / {campaign.budget.toLocaleString()}
              </Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(campaign.spent / campaign.budget) * 100}%` }]} />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setShowCreateCampaign(true)}
        >
          <Ionicons name="add-circle" size={24} color="#007AFF" />
          <Text style={styles.actionText}>Create Campaign</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="people" size={24} color="#00C851" />
          <Text style={styles.actionText}>Find Influencers</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="analytics" size={24} color="#FFD700" />
          <Text style={styles.actionText}>View Reports</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderCampaigns = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.campaignHeader}>
        <Text style={styles.sectionTitle}>All Campaigns</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setShowCreateCampaign(true)}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>

      {MOCK_CAMPAIGNS.map((campaign) => (
        <View key={campaign.id} style={styles.campaignDetailCard}>
          <View style={styles.campaignDetailHeader}>
            <View style={styles.campaignInfo}>
              <Text style={styles.campaignTitle}>{campaign.title}</Text>
              <Text style={styles.campaignType}>{campaign.type.replace('_', ' ').toUpperCase()}</Text>
              <Text style={styles.campaignDates}>{campaign.startDate} - {campaign.endDate}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(campaign.status) }]}>
              <Text style={styles.statusText}>{campaign.status.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.campaignStats}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Budget:</Text>
              <Text style={styles.statValue}>SAR {campaign.budget.toLocaleString()}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Spent:</Text>
              <Text style={styles.statValue}>SAR {campaign.spent.toLocaleString()}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Vouchers:</Text>
              <Text style={styles.statValue}>{campaign.vouchers.redeemed}/{campaign.vouchers.total}</Text>
            </View>
          </View>

          {campaign.status === 'active' && (
            <View style={styles.performanceMetrics}>
              <View style={styles.performanceItem}>
                <Text style={styles.performanceValue}>{campaign.metrics.reach.toLocaleString()}</Text>
                <Text style={styles.performanceLabel}>Reach</Text>
              </View>
              <View style={styles.performanceItem}>
                <Text style={styles.performanceValue}>{campaign.metrics.engagement}%</Text>
                <Text style={styles.performanceLabel}>Engagement</Text>
              </View>
              <View style={styles.performanceItem}>
                <Text style={styles.performanceValue}>{campaign.metrics.footfall}</Text>
                <Text style={styles.performanceLabel}>Footfall</Text>
              </View>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'campaigns': return renderCampaigns();
      default: return renderOverview();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Business Dashboard</Text>
        <TouchableOpacity>
          <Ionicons name="notifications" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabScrollContainer}
        contentContainerStyle={styles.tabContainer}
      >
        {[
          { key: 'overview', label: 'Overview', icon: 'home' },
          { key: 'campaigns', label: 'Campaigns', icon: 'megaphone' },
          { key: 'influencers', label: 'Influencers', icon: 'people' },
          { key: 'analytics', label: 'Analytics', icon: 'analytics' },
          { key: 'vouchers', label: 'Vouchers', icon: 'ticket' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Ionicons 
              name={tab.icon as any} 
              size={16} 
              color={activeTab === tab.key ? 'white' : '#999'} 
            />
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {renderTabContent()}
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
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  tabScrollContainer: {
    marginBottom: 20,
  },
  tabContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: 'white',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '47%',
  },
  statValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  statLabel: {
    color: '#999',
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  campaignCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  campaignInfo: {
    flex: 1,
  },
  campaignTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  campaignType: {
    color: '#007AFF',
    fontSize: 12,
    marginBottom: 2,
  },
  campaignDates: {
    color: '#999',
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  campaignMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  metricLabel: {
    color: '#999',
    fontSize: 10,
  },
  budgetProgress: {
    marginTop: 8,
  },
  budgetText: {
    color: '#00C851',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  campaignDetailCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  campaignDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  campaignStats: {
    marginBottom: 12,
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  performanceMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
  },
  performanceItem: {
    alignItems: 'center',
  },
  performanceValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  performanceLabel: {
    color: '#999',
    fontSize: 10,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  createButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
