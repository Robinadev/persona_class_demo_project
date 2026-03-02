import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../../config/constants';
import { useAuth } from '../../context/AuthContext';
import MobileRealTimeSync from '../../services/sync';

export default function DashboardScreen({ navigation }: any) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [balance, setBalance] = useState('$12.50');
  const [recentCalls, setRecentCalls] = useState([
    { id: '1', number: '+1 555 123 4567', duration: '5 min', date: 'Today' },
    { id: '2', number: '+1 555 987 6543', duration: '12 min', date: 'Yesterday' },
  ]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    } catch (error) {
      console.error('Load dashboard error:', error);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const quickActions = [
    { icon: 'call', label: 'Call', action: () => navigation.navigate('Call') },
    { icon: 'person-add', label: 'Add Contact', action: () => navigation.navigate('AddContact') },
    { icon: 'wallet', label: 'Add Balance', action: () => navigation.navigate('Topup') },
    { icon: 'gift', label: 'Rewards', action: () => navigation.navigate('Rewards') },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back</Text>
            <Text style={styles.userName}>{user?.full_name || 'User'}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>{balance}</Text>
          <View style={styles.balanceActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Topup')}
            >
              <Ionicons name="add-circle" size={20} color={COLORS.background} />
              <Text style={styles.actionButtonText}>Add Money</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('SendMoney')}
            >
              <Ionicons name="send" size={20} color={COLORS.background} />
              <Text style={styles.actionButtonText}>Send Money</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickActionItem}
                onPress={action.action}
              >
                <View style={styles.quickActionIcon}>
                  <Ionicons name={action.icon as any} size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Calls */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Calls</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CallDetail')}>
              <Text style={styles.seeAllLink}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {recentCalls.map((call) => (
            <TouchableOpacity key={call.id} style={styles.callItem}>
              <View style={styles.callItemIcon}>
                <Ionicons name="call" size={18} color={COLORS.primary} />
              </View>
              <View style={styles.callItemContent}>
                <Text style={styles.callItemNumber}>{call.number}</Text>
                <Text style={styles.callItemMeta}>{call.date}</Text>
              </View>
              <Text style={styles.callItemDuration}>{call.duration}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>This Month</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>42</Text>
              <Text style={styles.statLabel}>Calls</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>5h 20m</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>$23.50</Text>
              <Text style={styles.statLabel}>Spent</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.muted,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.foreground,
  },
  balanceCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  balanceLabel: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.8,
  },
  balanceAmount: {
    color: COLORS.background,
    fontSize: 36,
    fontWeight: '700',
    marginVertical: 8,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: '600',
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.foreground,
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.foreground,
    textAlign: 'center',
  },
  recentSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllLink: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    marginBottom: 8,
  },
  callItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  callItemContent: {
    flex: 1,
  },
  callItemNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.foreground,
  },
  callItemMeta: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  callItemDuration: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  statsSection: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 4,
  },
});
