import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../../config/constants';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setTimeout(() => {
      Alert.alert('Success', 'Profile updated successfully');
      setIsLoading(false);
      setIsEditing(false);
    }, 1000);
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => {
        await logout();
      }},
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={48} color={COLORS.background} />
        </View>
        <TouchableOpacity style={styles.editAvatarButton}>
          <Ionicons name="camera" size={16} color={COLORS.background} />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            value={fullName}
            onChangeText={setFullName}
            editable={isEditing}
            placeholder="Your name"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={user?.phone_number}
            editable={false}
            placeholder="Phone number"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.disabledInput]}
            value={email}
            onChangeText={setEmail}
            editable={isEditing}
            placeholder="Email address"
            keyboardType="email-address"
          />
        </View>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>42</Text>
          <Text style={styles.statLabel}>Calls Made</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>850</Text>
          <Text style={styles.statLabel}>Minutes Used</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>$125</Text>
          <Text style={styles.statLabel}>Total Spent</Text>
        </View>
      </View>

      <View style={styles.actionsSection}>
        {!isEditing ? (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setIsEditing(true)}
          >
            <Ionicons name="pencil" size={18} color={COLORS.background} />
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSaveProfile}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.background} />
              ) : (
                <>
                  <Ionicons name="checkmark" size={18} color={COLORS.background} />
                  <Text style={styles.buttonText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={18} color="#EF4444" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.secondary },
  content: { paddingHorizontal: 16, paddingVertical: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  editAvatarButton: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  form: { marginBottom: 24 },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.muted, marginBottom: 6 },
  input: { backgroundColor: COLORS.background, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, padding: 12, fontSize: 14, color: COLORS.foreground },
  disabledInput: { color: COLORS.muted },
  statsSection: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statBox: { flex: 1, backgroundColor: COLORS.background, borderRadius: 10, padding: 12, alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: '700', color: COLORS.primary },
  statLabel: { fontSize: 11, color: COLORS.muted, marginTop: 4 },
  actionsSection: { gap: 12, marginBottom: 16 },
  primaryButton: { backgroundColor: COLORS.primary, borderRadius: 10, paddingVertical: 12, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  buttonText: { color: COLORS.background, fontWeight: '600', fontSize: 14 },
  secondaryButton: { borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  secondaryButtonText: { color: COLORS.primary, fontWeight: '600', fontSize: 14 },
  logoutButton: { backgroundColor: COLORS.background, borderRadius: 10, paddingVertical: 12, flexDirection: 'row', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#FCA5A5' },
  logoutButtonText: { color: '#EF4444', fontWeight: '600', fontSize: 14 },
});
