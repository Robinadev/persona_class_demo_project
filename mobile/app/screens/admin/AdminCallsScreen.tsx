import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../../config/constants';

export default function AdminCallsScreen() {
  const [searchText, setSearchText] = useState('');
  const calls = [
    { id: '1', caller: '+1 (555) 123-4567', recipient: '+1 (555) 987-6543', duration: '05:32', date: 'Today', status: 'completed' },
    { id: '2', caller: '+1 (555) 555-5555', recipient: '+1 (555) 444-4444', duration: '12:15', date: 'Today', status: 'completed' },
    { id: '3', caller: '+1 (555) 111-1111', recipient: '+1 (555) 222-2222', duration: '00:00', date: 'Yesterday', status: 'missed' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Call Monitoring</Text>
        <TouchableOpacity>
          <Ionicons name="filter" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={COLORS.muted} />
          <TextInput style={styles.searchInput} placeholder="Search calls..." placeholderTextColor={COLORS.muted} value={searchText} onChangeText={setSearchText} />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {calls.map(call => (
          <TouchableOpacity key={call.id} style={styles.callItem}>
            <View style={styles.callInfo}>
              <Text style={styles.callNumber}>{call.caller}</Text>
              <Text style={styles.callDetail}>{call.duration} • {call.date}</Text>
            </View>
            <View style={styles.callAction}>
              <View style={[styles.statusBadge, call.status === 'missed' && styles.missedBadge]}>
                <Text style={[styles.statusText, call.status === 'missed' && styles.missedText]}>{call.status}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.secondary },
  header: { backgroundColor: COLORS.background, paddingHorizontal: 16, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.foreground },
  searchSection: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: COLORS.background },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.secondary, borderRadius: 8, paddingHorizontal: 12, height: 40, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.foreground },
  content: { flex: 1, paddingHorizontal: 16, paddingVertical: 12 },
  callItem: { backgroundColor: COLORS.background, borderRadius: 10, padding: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  callInfo: { flex: 1 },
  callNumber: { fontSize: 14, fontWeight: '600', color: COLORS.foreground },
  callDetail: { fontSize: 12, color: COLORS.muted, marginTop: 4 },
  callAction: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  missedBadge: { backgroundColor: '#FEE2E2' },
  statusText: { fontSize: 10, fontWeight: '600', color: '#10B981' },
  missedText: { color: '#EF4444' },
});
