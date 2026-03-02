import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../../config/constants';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const DIALPAD_BUTTONS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['*', '0', '#'],
];

export default function CallScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const { user } = useAuth();

  const handleDigitPress = (digit: string) => {
    setPhoneNumber(prev => prev + digit);
  };

  const handleBackspace = () => {
    setPhoneNumber(prev => prev.slice(0, -1));
  };

  const handleCall = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid phone number');
      return;
    }

    setIsCalling(true);
    try {
      // Log the call for sync
      const callData = {
        recipientPhoneNumber: phoneNumber,
        duration: 0,
        startTime: new Date().toISOString(),
        status: 'initiated',
      };

      // In a real app, you'd initiate the call here
      Alert.alert(
        'Call Initiated',
        `Calling ${phoneNumber}`,
        [
          {
            text: 'End Call',
            onPress: () => {
              setIsCalling(false);
              setPhoneNumber('');
            },
          },
        ]
      );

      // Log to backend for analytics
      await api.logCall(callData);
    } catch (error) {
      console.error('Call error:', error);
      Alert.alert('Error', 'Failed to initiate call');
    } finally {
      setIsCalling(false);
    }
  };

  const handleClear = () => {
    setPhoneNumber('');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Display */}
      <View style={styles.displaySection}>
        <Text style={styles.displayLabel}>Phone Number</Text>
        <View style={styles.displayBox}>
          <Text style={styles.displayText}>
            {phoneNumber || 'Enter number'}
          </Text>
          {phoneNumber && (
            <TouchableOpacity onPress={handleBackspace} style={styles.backspaceButton}>
              <Ionicons name="backspace" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Dialpad */}
      <View style={styles.dialpadSection}>
        {DIALPAD_BUTTONS.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.dialpadRow}>
            {row.map((digit) => (
              <TouchableOpacity
                key={digit}
                style={styles.dialpadButton}
                onPress={() => handleDigitPress(digit)}
              >
                <Text style={styles.dialpadButtonText}>{digit}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={[styles.actionButton, styles.callButton]}
          onPress={handleCall}
          disabled={isCalling}
        >
          {isCalling ? (
            <ActivityIndicator color={COLORS.background} />
          ) : (
            <>
              <Ionicons name="call" size={24} color={COLORS.background} />
              <Text style={styles.actionButtonText}>Call</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.clearButton]}
          onPress={handleClear}
          disabled={!phoneNumber}
        >
          <Ionicons name="close-circle" size={24} color={COLORS.primary} />
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="time" size={24} color={COLORS.primary} />
            <Text style={styles.quickActionText}>Recent</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="people" size={24} color={COLORS.primary} />
            <Text style={styles.quickActionText}>Contacts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="star" size={24} color={COLORS.primary} />
            <Text style={styles.quickActionText}>Favorites</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  displaySection: {
    marginBottom: 24,
  },
  displayLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.muted,
    marginBottom: 8,
  },
  displayBox: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  displayText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    flex: 1,
  },
  backspaceButton: {
    padding: 8,
  },
  dialpadSection: {
    marginBottom: 24,
    gap: 12,
  },
  dialpadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  dialpadButton: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dialpadButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.foreground,
  },
  actionSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  callButton: {
    backgroundColor: COLORS.primary,
  },
  clearButton: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  actionButtonText: {
    color: COLORS.background,
    fontWeight: '600',
    fontSize: 14,
  },
  clearButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  quickActionsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.foreground,
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.foreground,
  },
});
