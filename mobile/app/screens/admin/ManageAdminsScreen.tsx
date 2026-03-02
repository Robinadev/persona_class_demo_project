import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../../config/constants';

export default function ManageAdminsScreen() {
  const admins = [
    { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'Super Admin' },
    { id: '2', name: 'Support Lead', email: 'support@example.com', role: 'Admin' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Admins</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add-circle" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {admins.map(admin => (
          <View key={admin.id} style={styles.adminItem}>
            <View style={styles.adminAvatar}>
              <Text style={styles.avatarText}>{admin.name.charAt(0)}</Text>
            </View>
            <View style={styles.adminInfo}>
              <Text style={styles.adminName}>{admin.name}</Text>
              <Text style={styles.adminEmail}>{admin.email}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{admin.role}</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={20} color={COLORS.muted} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.secondary },
  header: { backgroundColor: COLORS.background, paddingHorizontal: 16, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.foreground },
  addButton: { padding: 4 },
  content: { flex: 1, paddingHorizontal: 16, paddingVertical: 12 },
  adminItem: { backgroundColor: COLORS.background, borderRadius: 10, padding: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12 },
  adminAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 18, fontWeight: '700', color: COLORS.background },
  adminInfo: { flex: 1 },
  adminName: { fontSize: 14, fontWeight: '600', color: COLORS.foreground },
  adminEmail: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  roleBadge: { backgroundColor: COLORS.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginTop: 4, alignSelf: 'flex-start' },
  roleText: { fontSize: 10, fontWeight: '600', color: COLORS.background },
});
