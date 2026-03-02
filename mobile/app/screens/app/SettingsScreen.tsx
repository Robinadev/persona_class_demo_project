import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../../config/constants';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [callRecording, setCallRecording] = useState(true);

  const SettingItem = ({ icon, title, subtitle, onPress, toggle, value }: any) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={toggle}>
      <Ionicons name={icon} size={20} color={COLORS.primary} />
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      {toggle && <Switch value={value} onChange={onPress} trackColor={{ false: COLORS.border, true: COLORS.primary }} />}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Notifications</Text>
      <SettingItem icon="notifications" title="Enable Notifications" subtitle="Get updates on calls and messages" toggle onChange={setNotifications} value={notifications} />

      <Text style={styles.sectionTitle}>Display</Text>
      <SettingItem icon="moon" title="Dark Mode" subtitle="Use dark theme" toggle onChange={setDarkMode} value={darkMode} />

      <Text style={styles.sectionTitle}>Privacy & Security</Text>
      <SettingItem icon="lock" title="Privacy Settings" subtitle="Manage privacy options" onPress={() => {}} />
      <SettingItem icon="shield" title="Security" subtitle="Two-factor authentication" onPress={() => {}} />

      <Text style={styles.sectionTitle}>Call Settings</Text>
      <SettingItem icon="videocam" title="Call Recording" subtitle="Record calls automatically" toggle onChange={setCallRecording} value={callRecording} />
      <SettingItem icon="volume-medium" title="Volume Control" subtitle="Manage call volume" onPress={() => {}} />

      <Text style={styles.sectionTitle}>About</Text>
      <SettingItem icon="information" title="About App" subtitle="Version 1.0.0" onPress={() => {}} />
      <SettingItem icon="document-text" title="Terms & Conditions" subtitle="Read our terms" onPress={() => {}} />
      <SettingItem icon="help-circle" title="Help & Support" subtitle="Contact support" onPress={() => {}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.secondary },
  content: { paddingHorizontal: 16, paddingVertical: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.primary, marginTop: 16, marginBottom: 8 },
  settingItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: 10, padding: 12, marginBottom: 8, gap: 12, borderWidth: 1, borderColor: COLORS.border },
  settingInfo: { flex: 1 },
  settingTitle: { fontSize: 14, fontWeight: '600', color: COLORS.foreground },
  settingSubtitle: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
});
