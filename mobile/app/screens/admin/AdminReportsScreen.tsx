import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../../config/constants';

export default function AdminReportsScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reports</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Generate Report</Text>
        
        <TouchableOpacity style={styles.reportCard}>
          <Ionicons name="call" size={24} color={COLORS.primary} />
          <View style={styles.reportInfo}>
            <Text style={styles.reportTitle}>Call Usage Report</Text>
            <Text style={styles.reportDesc}>Monthly call statistics and patterns</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.reportCard}>
          <Ionicons name="cash" size={24} color={COLORS.primary} />
          <View style={styles.reportInfo}>
            <Text style={styles.reportTitle}>Revenue Report</Text>
            <Text style={styles.reportDesc}>Total revenue and payments</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.reportCard}>
          <Ionicons name="people" size={24} color={COLORS.primary} />
          <View style={styles.reportInfo}>
            <Text style={styles.reportTitle}>User Analytics</Text>
            <Text style={styles.reportDesc}>User growth and retention</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Recent Reports</Text>
        <View style={styles.reportItem}>
          <Ionicons name="document" size={20} color={COLORS.primary} />
          <View style={styles.reportItemInfo}>
            <Text style={styles.reportItemTitle}>Monthly Report - March 2024</Text>
            <Text style={styles.reportItemDate}>Generated today</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="download" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.secondary },
  header: { backgroundColor: COLORS.background, paddingHorizontal: 16, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.foreground },
  content: { flex: 1, paddingHorizontal: 16, paddingVertical: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.foreground, marginBottom: 12, marginTop: 16 },
  reportCard: { backgroundColor: COLORS.background, borderRadius: 10, padding: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12 },
  reportInfo: { flex: 1 },
  reportTitle: { fontSize: 14, fontWeight: '600', color: COLORS.foreground },
  reportDesc: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  reportItem: { backgroundColor: COLORS.background, borderRadius: 10, padding: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12 },
  reportItemInfo: { flex: 1 },
  reportItemTitle: { fontSize: 13, fontWeight: '600', color: COLORS.foreground },
  reportItemDate: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
});
