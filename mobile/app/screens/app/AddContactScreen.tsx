import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../../config/constants';
import { api } from '../../services/api';

export default function AddContactScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddContact = async () => {
    if (!name.trim() || !phoneNumber.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      // In real app, call API to save contact
      // await api.addContact({ name, phoneNumber, email });
      
      Alert.alert('Success', 'Contact added successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Add contact error:', error);
      Alert.alert('Error', 'Failed to add contact');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Contact</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Avatar Placeholder */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person-add" size={48} color={COLORS.primary} />
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Name Field */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <View style={styles.inputBox}>
              <Ionicons name="person" size={18} color={COLORS.primary} />
              <TextInput
                style={styles.input}
                placeholder="Enter full name"
                placeholderTextColor={COLORS.muted}
                value={name}
                onChangeText={setName}
                editable={!isSaving}
              />
            </View>
          </View>

          {/* Phone Number Field */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <View style={styles.inputBox}>
              <Ionicons name="call" size={18} color={COLORS.primary} />
              <TextInput
                style={styles.input}
                placeholder="+1 (555) 123-4567"
                placeholderTextColor={COLORS.muted}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                editable={!isSaving}
              />
            </View>
          </View>

          {/* Email Field */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email (Optional)</Text>
            <View style={styles.inputBox}>
              <Ionicons name="mail" size={18} color={COLORS.primary} />
              <TextInput
                style={styles.input}
                placeholder="user@example.com"
                placeholderTextColor={COLORS.muted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                editable={!isSaving}
              />
            </View>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Quick Tips</Text>
          <View style={styles.notesItem}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
            <Text style={styles.notesText}>Phone number is required</Text>
          </View>
          <View style={styles.notesItem}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
            <Text style={styles.notesText}>
              Use international format for non-US numbers
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={isSaving}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.disabledButton]}
          onPress={handleAddContact}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color={COLORS.background} />
          ) : (
            <Text style={styles.saveButtonText}>Save Contact</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  scrollContent: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.foreground,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  form: {
    marginBottom: 32,
    gap: 16,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.foreground,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    height: 48,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.foreground,
  },
  notesSection: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    gap: 10,
    marginBottom: 80,
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },
  notesItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  notesText: {
    fontSize: 12,
    color: COLORS.muted,
    flex: 1,
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  saveButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.background,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
