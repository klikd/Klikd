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

interface Campaign {
  id: string;
  title: string;
  brand: string;
  type: 'sponsored' | 'challenge' | 'collaboration';
  status: 'active' | 'pending' | 'completed' | 'draft';
  budget: number;
  deadline: string;
  requirements: string[];
  deliverables: string[];
  analytics: {
    reach: number;
    engagement: number;
    conversions: number;
  };
  payment: {
    amount: number;
    status: 'pending' | 'escrowed' | 'paid';
    dueDate: string;
  };
}

interface InfluencerStats {
  followers: number;
  totalReach: number;
  engagementRate: number;
  completedCampaigns: number;
  totalEarnings: number;
  rating: number;
  level: 'Rising' | 'Established' | 'Elite' | 'Legendary';
}

interface ContentDraft {
  id: string;
  title: string;
  type: 'story' | 'post' | 'reel' | 'live';
  thumbnail: string;
  duration?: number;
  scheduledFor?: string;
  status: 'draft' | 'scheduled' | 'published';
}

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    title: 'Starbucks AR Experience',
    brand: 'Starbucks Saudi',
    type: 'sponsored',
    status: 'active',
    budget: 5000,
    deadline: '2024-03-15',
    requirements: ['Create AR story', 'Visit 3 locations', 'Minimum 10K reach'],
    deliverables: ['3 AR stories', '1 feed post', 'Analytics report'],
    analytics: {
      reach: 12500,
      engagement: 8.5,
      conversions: 156,
    },
    payment: {
      amount: 5000,
      status: 'escrowed',
      dueDate: '2024-03-20',
    },
  },
  {
    id: '2',
    title: 'Riyadh Season Challenge',
    brand: 'Riyadh Season',
    type: 'challenge',
    status: 'pending',
    budget: 8000,
    deadline: '2024-04-01',
    requirements: ['Create viral challenge', 'Collaborate with 5 creators', 'Use official hashtag'],
    deliverables: ['Challenge video', 'Tutorial content', 'Live session'],
    analytics: {
      reach: 0,
      engagement: 0,
      conversions: 0,
    },
    payment: {
      amount: 8000,
      status: 'pending',
      dueDate: '2024-04-05',
    },
  },
];

const MOCK_STATS: InfluencerStats = {
  followers: 125000,
  totalReach: 2500000,
  engagementRate: 7.8,
  completedCampaigns: 23,
  totalEarnings: 45000,
  rating: 4.8,
  level: 'Elite',
};

const MOCK_DRAFTS: ContentDraft[] = [
  {
    id: '1',
    title: 'Morning Coffee AR',
    type: 'story',
    thumbnail: '☕',
    duration: 15,
    status: 'draft',
  },
  {
    id: '2',
    title: 'Boulevard Walk',
    type: 'reel',
    thumbnail: '🚶‍♂️',
    duration: 30,
    scheduledFor: '2024-03-10 18:00',
    status: 'scheduled',
  },
];

export default function InfluencerDashboard({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'content' | 'analytics' | 'earnings'>('overview');
  const [showCreateContent, setShowCreateContent] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#00C851';
      case 'pending': return '#FF8800';
      case 'completed': return '#007AFF';
      case 'draft': return '#999';
      default: return '#666';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Rising': return '#00C851';
      case 'Established': return '#007AFF';
      case 'Elite': return '#9C27B0';
      case 'Legendary': return '#FFD700';
      default: return '#999';
    }
  };

  const renderOverview = () => (
    <ScrollView style={styles.tabContent}>
      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="people" size={24} color="#007AFF" />
          <Text style={styles.statValue}>{MOCK_STATS.followers.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="eye" size={24} color="#00C851" />
          <Text style={styles.statValue}>{(MOCK_STATS.totalReach / 1000000).toFixed(1)}M</Text>
          <Text style={styles.statLabel}>Total Reach</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="heart" size={24} color="#FF6B6B" />
          <Text style={styles.statValue}>{MOCK_STATS.engagementRate}%</Text>
          <Text style={styles.statLabel}>Engagement</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="trophy" size={24} color="#FFD700" />
          <Text style={styles.statValue}>{MOCK_STATS.completedCampaigns}</Text>
          <Text style={styles.statLabel}>Campaigns</Text>
        </View>
      </View>

      {/* Level Badge */}
      <View style={styles.levelSection}>
        <View style={[styles.levelBadge, { backgroundColor: getLevelColor(MOCK_STATS.level) }]}>
          <Text style={styles.levelText}>{MOCK_STATS.level} Creator</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{MOCK_STATS.rating}</Text>
          </View>
        </View>
      </View>

      {/* Active Campaigns */}
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
                <Text style={styles.campaignBrand}>{campaign.brand}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(campaign.status) }]}>
                <Text style={styles.statusText}>{campaign.status.toUpperCase()}</Text>
              </View>
            </View>
            
            <View style={styles.campaignMeta}>
              <Text style={styles.campaignBudget}>SAR {campaign.budget.toLocaleString()}</Text>
              <Text style={styles.campaignDeadline}>Due: {campaign.deadline}</Text>
            </View>
            
            <View style={styles.campaignProgress}>
              <Text style={styles.progressLabel}>Progress</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '65%' }]} />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowCreateContent(true)}
          >
            <Ionicons name="add-circle" size={24} color="#007AFF" />
            <Text style={styles.actionText}>Create Content</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="analytics" size={24} color="#00C851" />
            <Text style={styles.actionText}>View Analytics</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="wallet" size={24} color="#FFD700" />
            <Text style={styles.actionText}>Earnings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderCampaigns = () => (
    <ScrollView style={styles.tabContent}>
      {MOCK_CAMPAIGNS.map((campaign) => (
        <TouchableOpacity 
          key={campaign.id} 
          style={styles.campaignDetailCard}
          onPress={() => setSelectedCampaign(campaign)}
        >
          <View style={styles.campaignHeader}>
            <View style={styles.campaignInfo}>
              <Text style={styles.campaignTitle}>{campaign.title}</Text>
              <Text style={styles.campaignBrand}>{campaign.brand}</Text>
              <Text style={styles.campaignType}>{campaign.type.toUpperCase()}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(campaign.status) }]}>
              <Text style={styles.statusText}>{campaign.status.toUpperCase()}</Text>
            </View>
          </View>
          
          <View style={styles.campaignDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Budget:</Text>
              <Text style={styles.detailValue}>SAR {campaign.budget.toLocaleString()}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Deadline:</Text>
              <Text style={styles.detailValue}>{campaign.deadline}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment:</Text>
              <Text style={[styles.detailValue, { color: getStatusColor(campaign.payment.status) }]}>
                {campaign.payment.status.toUpperCase()}
              </Text>
            </View>
          </View>

          {campaign.status === 'active' && (
            <View style={styles.campaignAnalytics}>
              <View style={styles.analyticsItem}>
                <Text style={styles.analyticsValue}>{campaign.analytics.reach.toLocaleString()}</Text>
                <Text style={styles.analyticsLabel}>Reach</Text>
              </View>
              <View style={styles.analyticsItem}>
                <Text style={styles.analyticsValue}>{campaign.analytics.engagement}%</Text>
                <Text style={styles.analyticsLabel}>Engagement</Text>
              </View>
              <View style={styles.analyticsItem}>
                <Text style={styles.analyticsValue}>{campaign.analytics.conversions}</Text>
                <Text style={styles.analyticsLabel}>Conversions</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderContent = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.contentHeader}>
        <Text style={styles.sectionTitle}>Content Library</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setShowCreateContent(true)}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentGrid}>
        {MOCK_DRAFTS.map((draft) => (
          <View key={draft.id} style={styles.contentCard}>
            <View style={styles.contentThumbnail}>
              <Text style={styles.thumbnailEmoji}>{draft.thumbnail}</Text>
              {draft.duration && (
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>{draft.duration}s</Text>
                </View>
              )}
            </View>
            
            <Text style={styles.contentTitle}>{draft.title}</Text>
            <Text style={styles.contentType}>{draft.type.toUpperCase()}</Text>
            
            <View style={[styles.contentStatus, { backgroundColor: getStatusColor(draft.status) }]}>
              <Text style={styles.contentStatusText}>{draft.status.toUpperCase()}</Text>
            </View>
            
            {draft.scheduledFor && (
              <Text style={styles.scheduledTime}>📅 {draft.scheduledFor}</Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderAnalytics = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.analyticsSection}>
        <Text style={styles.sectionTitle}>Performance Overview</Text>
        
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>2.5M</Text>
            <Text style={styles.metricLabel}>Total Reach</Text>
            <Text style={styles.metricChange}>+12% this month</Text>
          </View>
          
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>7.8%</Text>
            <Text style={styles.metricLabel}>Avg Engagement</Text>
            <Text style={styles.metricChange}>+0.5% this month</Text>
          </View>
          
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>156</Text>
            <Text style={styles.metricLabel}>Conversions</Text>
            <Text style={styles.metricChange}>+23% this month</Text>
          </View>
        </View>
      </View>

      <View style={styles.analyticsSection}>
        <Text style={styles.sectionTitle}>Top Performing Content</Text>
        {/* Add top performing content list here */}
      </View>
    </ScrollView>
  );

  const renderEarnings = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.earningsSection}>
        <Text style={styles.sectionTitle}>Earnings Overview</Text>
        
        <View style={styles.earningsCard}>
          <Text style={styles.totalEarnings}>SAR {MOCK_STATS.totalEarnings.toLocaleString()}</Text>
          <Text style={styles.earningsLabel}>Total Earnings</Text>
          
          <View style={styles.earningsBreakdown}>
            <View style={styles.earningsItem}>
              <Text style={styles.earningsAmount}>SAR 15,000</Text>
              <Text style={styles.earningsDescription}>Pending</Text>
            </View>
            <View style={styles.earningsItem}>
              <Text style={styles.earningsAmount}>SAR 30,000</Text>
              <Text style={styles.earningsDescription}>Paid</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.withdrawButton}>
          <Ionicons name="card" size={20} color="white" />
          <Text style={styles.withdrawText}>Withdraw Earnings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'campaigns': return renderCampaigns();
      case 'content': return renderContent();
      case 'analytics': return renderAnalytics();
      case 'earnings': return renderEarnings();
      default: return renderOverview();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Creator Dashboard</Text>
        <TouchableOpacity>
          <Ionicons name="notifications" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabScrollContainer}
        contentContainerStyle={styles.tabContainer}
      >
        {[
          { key: 'overview', label: 'Overview', icon: 'home' },
          { key: 'campaigns', label: 'Campaigns', icon: 'briefcase' },
          { key: 'content', label: 'Content', icon: 'camera' },
          { key: 'analytics', label: 'Analytics', icon: 'analytics' },
          { key: 'earnings', label: 'Earnings', icon: 'wallet' },
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

      {/* Tab Content */}
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
    marginBottom: 20,
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
  levelSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 12,
  },
  levelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
  campaignBrand: {
    color: '#007AFF',
    fontSize: 14,
    marginBottom: 2,
  },
  campaignType: {
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
  campaignMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  campaignBudget: {
    color: '#00C851',
    fontSize: 16,
    fontWeight: 'bold',
  },
  campaignDeadline: {
    color: '#FF8800',
    fontSize: 14,
  },
  campaignProgress: {
    marginTop: 8,
  },
  progressLabel: {
    color: '#999',
    fontSize: 12,
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
  campaignDetails: {
    marginBottom: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    color: '#999',
    fontSize: 14,
  },
  detailValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  campaignAnalytics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
  },
  analyticsItem: {
    alignItems: 'center',
  },
  analyticsValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  analyticsLabel: {
    color: '#999',
    fontSize: 10,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  contentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  contentCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 12,
    width: '47%',
    alignItems: 'center',
  },
  contentThumbnail: {
    position: 'relative',
    marginBottom: 8,
  },
  thumbnailEmoji: {
    fontSize: 32,
  },
  durationBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  durationText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  contentTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  contentType: {
    color: '#999',
    fontSize: 10,
    marginBottom: 8,
  },
  contentStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
  },
  contentStatusText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  scheduledTime: {
    color: '#FF8800',
    fontSize: 10,
  },
  analyticsSection: {
    marginBottom: 24,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    width: '47%',
  },
  metricValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricLabel: {
    color: '#999',
    fontSize: 12,
    marginBottom: 4,
  },
  metricChange: {
    color: '#00C851',
    fontSize: 10,
    fontWeight: '600',
  },
  earningsSection: {
    alignItems: 'center',
  },
  earningsCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  totalEarnings: {
    color: '#00C851',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  earningsLabel: {
    color: '#999',
    fontSize: 16,
    marginBottom: 20,
  },
  earningsBreakdown: {
    flexDirection: 'row',
    gap: 40,
  },
  earningsItem: {
    alignItems: 'center',
  },
  earningsAmount: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  earningsDescription: {
    color: '#999',
    fontSize: 12,
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00C851',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  withdrawText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
