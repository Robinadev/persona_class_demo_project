import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../../config/constants';

export default function RewardsScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rewards</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        <View style={styles.pointsCard}>
          <Text style={styles.pointsLabel}>Your Points</Text>
          <Text style={styles.pointsAmount}>2,450</Text>
          <Text style={styles.pointsDetail}>Earn 1 point per $1 spent</Text>
        </View>

        <Text style={styles.sectionTitle}>Redeem Rewards</Text>
        <TouchableOpacity style={styles.rewardItem}>
          <Ionicons name="gift" size={24} color={COLORS.primary} />
          <View style={styles.rewardInfo}>
            <Text style={styles.rewardName}>$5 Credit</Text>
            <Text style={styles.rewardCost}>500 points</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.rewardItem}>
          <Ionicons name="gift" size={24} color={COLORS.primary} />
          <View style={styles.rewardInfo}>
            <Text style={styles.rewardName}>$25 Credit</Text>
            <Text style={styles.rewardCost}>2,000 points</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.rewardItem}>
          <Ionicons name="gift" size={24} color={COLORS.primary} />
          <View style={styles.rewardInfo}>
            <Text style={styles.rewardName}>Premium Plan (1 Month)</Text>
            <Text style={styles.rewardCost}>5,000 points</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Referral Program</Text>
        <View style={styles.referralBox}>
          <Ionicons name="people" size={32} color={COLORS.primary} />
          <Text style={styles.referralTitle}>Invite Friends</Text>
          <Text style={styles.referralText}>Get $5 for each friend who signs up</Text>
          <TouchableOpacity style={styles.referralButton}>
            <Text style={styles.referralButtonText}>Share Referral Code</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Achievement History</Text>
        <View style={styles.achievementItem}>
          <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementName}>First Call</Text>
            <Text style={styles.achievementDate}>Earned 100 points</Text>
          </View>
        </View>

        <View style={styles.achievementItem}>
          <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementName}>500 Minutes Milestone</Text>
            <Text style={styles.achievementDate}>Earned 250 points</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.secondary },
  header: { backgroundColor: COLORS.background, paddingHorizontal: 16, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.foreground },
  content: { flex: 1 },
  contentInner: { paddingHorizontal: 16, paddingVertical: 16 },
  pointsCard: { backgroundColor: COLORS.primary, borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 24 },
  pointsLabel: { fontSize: 13, color: COLORS.secondary },
  pointsAmount: { fontSize: 36, fontWeight: '700', color: COLORS.background, marginVertical: 8 },
  pointsDetail: { fontSize: 12, color: COLORS.secondary },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.foreground, marginTop: 20, marginBottom: 12 },
  rewardItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: 10, padding: 12, marginBottom: 8, gap: 12 },
  rewardInfo: { flex: 1 },
  rewardName: { fontSize: 14, fontWeight: '600', color: COLORS.foreground },
  rewardCost: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  referralBox: { backgroundColor: COLORS.background, borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 24 },
  referralTitle: { fontSize: 16, fontWeight: '700', color: COLORS.foreground, marginTop: 8 },
  referralText: { fontSize: 13, color: COLORS.muted, marginTop: 4 },
  referralButton: { backgroundColor: COLORS.primary, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10, marginTop: 12 },
  referralButtonText: { color: COLORS.background, fontWeight: '600', fontSize: 13 },
  achievementItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: 10, padding: 12, marginBottom: 8, gap: 12 },
  achievementInfo: { flex: 1 },
  achievementName: { fontSize: 13, fontWeight: '600', color: COLORS.foreground },
  achievementDate: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
});
