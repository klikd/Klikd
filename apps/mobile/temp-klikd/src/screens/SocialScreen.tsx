import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
  mutualFriends: number;
  level: number;
  xp: number;
  location?: string;
  status?: string;
  relationship: 'friend' | 'family' | 'close_friend' | 'acquaintance';
}

interface FriendRequest {
  id: string;
  from: Friend;
  message?: string;
  timestamp: string;
  type: 'friend' | 'family' | 'mission_invite';
}

interface SocialGroup {
  id: string;
  name: string;
  members: Friend[];
  type: 'family' | 'friends' | 'mission_team' | 'custom';
  avatar: string;
  lastActivity: string;
  activeMembers: number;
}

const MOCK_FRIENDS: Friend[] = [
  {
    id: '1',
    name: 'Sarah Al-Rashid',
    username: '@sarah_explorer',
    avatar: '👩🏻‍💼',
    isOnline: true,
    mutualFriends: 12,
    level: 15,
    xp: 2450,
    location: 'Riyadh',
    status: 'Exploring Boulevard City',
    relationship: 'close_friend',
  },
  {
    id: '2',
    name: 'Ahmed Mohamed',
    username: '@ahmed_ar',
    avatar: '👨🏻‍💻',
    isOnline: false,
    lastSeen: '2h ago',
    mutualFriends: 8,
    level: 12,
    xp: 1890,
    location: 'Jeddah',
    relationship: 'friend',
  },
  {
    id: '3',
    name: 'Fatima (Sister)',
    username: '@fatima_klikd',
    avatar: '👩🏻‍🎓',
    isOnline: true,
    mutualFriends: 25,
    level: 18,
    xp: 3200,
    location: 'Riyadh',
    status: 'In AR Mission',
    relationship: 'family',
  },
];

const MOCK_REQUESTS: FriendRequest[] = [
  {
    id: '1',
    from: {
      id: '4',
      name: 'Omar Abdullah',
      username: '@omar_gamer',
      avatar: '👨🏻‍🎮',
      isOnline: true,
      mutualFriends: 5,
      level: 10,
      xp: 1200,
      relationship: 'acquaintance',
    },
    message: 'Met you at the AR zone in Kingdom Mall!',
    timestamp: '1h ago',
    type: 'friend',
  },
];

const MOCK_GROUPS: SocialGroup[] = [
  {
    id: '1',
    name: 'Family Circle',
    members: MOCK_FRIENDS.filter(f => f.relationship === 'family'),
    type: 'family',
    avatar: '👨‍👩‍👧‍👦',
    lastActivity: '30m ago',
    activeMembers: 3,
  },
  {
    id: '2',
    name: 'Riyadh Explorers',
    members: MOCK_FRIENDS.filter(f => f.location === 'Riyadh'),
    type: 'friends',
    avatar: '🏙️',
    lastActivity: '1h ago',
    activeMembers: 8,
  },
];

export default function SocialScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'groups' | 'discover'>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  const filteredFriends = MOCK_FRIENDS.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAcceptRequest = (requestId: string) => {
    Alert.alert('Friend Added!', 'You are now connected and can explore together.');
  };

  const handleDeclineRequest = (requestId: string) => {
    Alert.alert('Request Declined', 'The friend request has been declined.');
  };

  const handleInviteToMission = (friend: Friend) => {
    Alert.alert(
      'Invite to Mission',
      `Invite ${friend.name} to join your current mission?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Invite', onPress: () => Alert.alert('Invited!', `${friend.name} has been invited.`) }
      ]
    );
  };

  const renderFriendCard = (friend: Friend) => (
    <TouchableOpacity
      key={friend.id}
      style={styles.friendCard}
      onPress={() => setSelectedFriend(friend)}
    >
      <View style={styles.friendHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{friend.avatar}</Text>
          {friend.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        
        <View style={styles.friendInfo}>
          <Text style={styles.friendName}>{friend.name}</Text>
          <Text style={styles.friendUsername}>{friend.username}</Text>
          {friend.status ? (
            <Text style={styles.friendStatus}>{friend.status}</Text>
          ) : (
            <Text style={styles.friendLastSeen}>
              {friend.isOnline ? 'Online' : `Last seen ${friend.lastSeen}`}
            </Text>
          )}
        </View>

        <View style={styles.friendMeta}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>L{friend.level}</Text>
          </View>
          <Text style={styles.xpText}>{friend.xp} XP</Text>
        </View>
      </View>

      <View style={styles.friendActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Chat', { friendId: friend.id })}
        >
          <Ionicons name="chatbubble" size={16} color="#007AFF" />
          <Text style={styles.actionText}>Message</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleInviteToMission(friend)}
        >
          <Ionicons name="person-add" size={16} color="#00C851" />
          <Text style={styles.actionText}>Invite</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Map', { friendId: friend.id })}
        >
          <Ionicons name="location" size={16} color="#FF8800" />
          <Text style={styles.actionText}>Locate</Text>
        </TouchableOpacity>
      </View>

      {friend.relationship === 'family' && (
        <View style={styles.familyBadge}>
          <Ionicons name="heart" size={12} color="#FF6B6B" />
          <Text style={styles.familyText}>Family</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderRequestCard = (request: FriendRequest) => (
    <View key={request.id} style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <Text style={styles.avatarText}>{request.from.avatar}</Text>
        <View style={styles.requestInfo}>
          <Text style={styles.requestName}>{request.from.name}</Text>
          <Text style={styles.requestUsername}>{request.from.username}</Text>
          <Text style={styles.requestTime}>{request.timestamp}</Text>
        </View>
      </View>

      {request.message && (
        <Text style={styles.requestMessage}>"{request.message}"</Text>
      )}

      <View style={styles.requestActions}>
        <TouchableOpacity 
          style={[styles.requestButton, styles.acceptButton]}
          onPress={() => handleAcceptRequest(request.id)}
        >
          <Text style={styles.acceptText}>Accept</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.requestButton, styles.declineButton]}
          onPress={() => handleDeclineRequest(request.id)}
        >
          <Text style={styles.declineText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderGroupCard = (group: SocialGroup) => (
    <TouchableOpacity key={group.id} style={styles.groupCard}>
      <View style={styles.groupHeader}>
        <Text style={styles.groupAvatar}>{group.avatar}</Text>
        <View style={styles.groupInfo}>
          <Text style={styles.groupName}>{group.name}</Text>
          <Text style={styles.groupMembers}>{group.members.length} members</Text>
          <Text style={styles.groupActivity}>Active {group.lastActivity}</Text>
        </View>
        <View style={styles.groupMeta}>
          <View style={styles.activeIndicator}>
            <Text style={styles.activeCount}>{group.activeMembers}</Text>
            <Text style={styles.activeLabel}>online</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'friends':
        return (
          <ScrollView style={styles.tabContent}>
            {filteredFriends.map(renderFriendCard)}
          </ScrollView>
        );
      
      case 'requests':
        return (
          <ScrollView style={styles.tabContent}>
            {MOCK_REQUESTS.length > 0 ? (
              MOCK_REQUESTS.map(renderRequestCard)
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="people" size={48} color="#666" />
                <Text style={styles.emptyText}>No pending requests</Text>
              </View>
            )}
          </ScrollView>
        );
      
      case 'groups':
        return (
          <ScrollView style={styles.tabContent}>
            {MOCK_GROUPS.map(renderGroupCard)}
          </ScrollView>
        );
      
      case 'discover':
        return (
          <ScrollView style={styles.tabContent}>
            <View style={styles.discoverSection}>
              <Text style={styles.sectionTitle}>Suggested Friends</Text>
              <Text style={styles.sectionSubtitle}>Based on your interests and location</Text>
              {/* Add suggested friends here */}
            </View>
          </ScrollView>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Social</Text>
        <TouchableOpacity onPress={() => setShowAddFriend(true)}>
          <Ionicons name="person-add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search friends..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {[
          { key: 'friends', label: 'Friends', count: MOCK_FRIENDS.length },
          { key: 'requests', label: 'Requests', count: MOCK_REQUESTS.length },
          { key: 'groups', label: 'Groups', count: MOCK_GROUPS.length },
          { key: 'discover', label: 'Discover', count: 0 },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.label}
            </Text>
            {tab.count > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{tab.count}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    marginRight: 8,
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
  tabBadge: {
    backgroundColor: '#FF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  friendCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
  },
  friendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 32,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00C851',
    borderWidth: 2,
    borderColor: '#1a1a1a',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  friendUsername: {
    color: '#007AFF',
    fontSize: 14,
    marginBottom: 4,
  },
  friendStatus: {
    color: '#00C851',
    fontSize: 12,
    fontStyle: 'italic',
  },
  friendLastSeen: {
    color: '#999',
    fontSize: 12,
  },
  friendMeta: {
    alignItems: 'flex-end',
  },
  levelBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
  },
  levelText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  xpText: {
    color: '#999',
    fontSize: 11,
  },
  friendActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  familyBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  familyText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  requestCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  requestInfo: {
    flex: 1,
    marginLeft: 12,
  },
  requestName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  requestUsername: {
    color: '#007AFF',
    fontSize: 14,
  },
  requestTime: {
    color: '#999',
    fontSize: 12,
  },
  requestMessage: {
    color: '#ccc',
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 12,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#007AFF',
  },
  requestActions: {
    flexDirection: 'row',
    gap: 12,
  },
  requestButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#00C851',
  },
  declineButton: {
    backgroundColor: '#333',
  },
  acceptText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  declineText: {
    color: '#999',
    fontSize: 14,
    fontWeight: 'bold',
  },
  groupCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupAvatar: {
    fontSize: 32,
    marginRight: 12,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  groupMembers: {
    color: '#999',
    fontSize: 14,
    marginBottom: 2,
  },
  groupActivity: {
    color: '#00C851',
    fontSize: 12,
  },
  groupMeta: {
    alignItems: 'flex-end',
  },
  activeIndicator: {
    alignItems: 'center',
  },
  activeCount: {
    color: '#00C851',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeLabel: {
    color: '#999',
    fontSize: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    marginTop: 12,
  },
  discoverSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: '#999',
    fontSize: 14,
    marginBottom: 16,
  },
});
