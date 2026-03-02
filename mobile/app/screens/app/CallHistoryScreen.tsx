import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SectionList,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../../config/constants';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface CallLog {
  id: string;
  recipientPhoneNumber: string;
  duration: number;
  startTime: string;
  status: 'completed' | 'missed' | 'ongoing';
}

export default function CallHistoryScreen({ navigation }: any) {
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadCallHistory();
  }, []);

  const loadCallHistory = async () => {
    try {
      setIsLoading(true);
      // In real app, fetch from backend
      // const response = await api.getCallHistory();
      // setCallLogs(response.data);
      
      // Mock data for now
      setCallLogs([
        {
          id: '1',
          recipientPhoneNumber: '+1 (555) 123-4567',
          duration: 300,
          startTime: new Date(Date.now() - 3600000).toISOString(),
          status: 'completed',
        },
        {
          id: '2',
          recipientPhoneNumber: '+1 (555) 987-6543',
          duration: 45,
          startTime: new Date(Date.now() - 7200000).toISOString(),
          status: 'completed',
        },
        {
          id: '3',
          recipientPhoneNumber: '+1 (555) 555-5555',
          duration: 0,
          startTime: new Date(Date.now() - 86400000).toISOString(),
          status: 'missed',
        },
      ]);
    } catch (error) {
      console.error('Load call history error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadCallHistory();
    setIsRefreshing(false);
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCallAgain = (phoneNumber: string) => {
    navigation.navigate('Call');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Call History</Text>
        <TouchableOpacity>
          <Ionicons name="funnel" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {callLogs.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="call-outline" size={48} color={COLORS.muted} />
            <Text style={styles.emptyText}>No calls yet</Text>
            <Text style={styles.emptySubtext}>
              Your call history will appear here
            </Text>
          </View>
        ) : (
          callLogs.map((call) => (
            <TouchableOpacity
              key={call.id}
              style={styles.callItem}
              onPress={() => handleCallAgain(call.recipientPhoneNumber)}
            >
              <View style={styles.callInfoLeft}>
                <View
                  style={[
                    styles.callStatusIcon,
                    call.status === 'missed' && styles.missedIcon,
                  ]}
                >
                  <Ionicons
                    name={
                      call.status === 'missed'
                        ? 'call-outline'
                        : 'call'
                    }
                    size={16}
                    color={
                      call.status === 'missed'
                        ? '#EF4444'
                        : COLORS.primary
                    }
                  />
                </View>
                <View style={styles.callDetails}>
                  <Text style={styles.phoneNumber}>
                    {call.recipientPhoneNumber}
                  </Text>
                  <Text style={styles.duration}>
                    {call.status === 'missed'
                      ? 'Missed call'
                      : formatDuration(call.duration)}
                  </Text>
                </View>
              </View>

              <View style={styles.callInfoRight}>
                <Text style={styles.time}>{formatTime(call.startTime)}</Text>
                <TouchableOpacity style={styles.callButton}>
                  <Ionicons
                    name="call"
                    size={18}
                    color={COLORS.background}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.foreground,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  callItem: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  callInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  callStatusIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  missedIcon: {
    backgroundColor: '#FEE2E2',
  },
  callDetails: {
    flex: 1,
  },
  phoneNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.foreground,
    marginBottom: 4,
  },
  duration: {
    fontSize: 12,
    color: COLORS.muted,
  },
  callInfoRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  time: {
    fontSize: 12,
    color: COLORS.muted,
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.foreground,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 4,
  },
});
