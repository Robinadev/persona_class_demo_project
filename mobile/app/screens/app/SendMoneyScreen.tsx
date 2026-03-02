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

export default function SendMoneyScreen({ navigation }: any) {
  const [recipientPhone, setRecipientPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendMoney = async () => {
    if (!recipientPhone || !amount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsSending(true);
    try {
      setTimeout(() => {
        Alert.alert(
          'Success',
          `$${amount} sent to ${recipientPhone}`,
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
        setIsSending(false);
      }, 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to send money. Please try again.');
      setIsSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Send Money</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* From Account */}
        <View style={styles.fromSection}>
          <Text style={styles.label}>From Your Account</Text>
          <View style={styles.accountBox}>
            <View style={styles.accountAvatar}>
              <Ionicons name="person" size={20} color={COLORS.background} />
            </View>
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>Your Account</Text>
              <Text style={styles.accountBalance}>Balance: $250.75</Text>
            </View>
          </View>
        </View>

        {/* Send To */}
        <View style={styles.sendSection}>
          <Text style={styles.label}>Send To *</Text>
          <View style={styles.inputBox}>
            <Ionicons name="call" size={18} color={COLORS.primary} />
            <TextInput
              style={styles.input}
              placeholder="Recipient phone number"
              placeholderTextColor={COLORS.muted}
              value={recipientPhone}
              onChangeText={setRecipientPhone}
              keyboardType="phone-pad"
              editable={!isSending}
            />
          </View>
        </View>

        {/* Amount */}
        <View style={styles.amountSection}>
          <Text style={styles.label}>Amount *</Text>
          <View style={styles.amountInput}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor={COLORS.muted}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              editable={!isSending}
            />
          </View>
        </View>

        {/* Purpose */}
        <View style={styles.purposeSection}>
          <Text style={styles.label}>Purpose (Optional)</Text>
          <View style={[styles.inputBox, { height: 80 }]}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Add note (e.g., Lunch money)"
              placeholderTextColor={COLORS.muted}
              value={purpose}
              onChangeText={setPurpose}
              multiline
              editable={!isSending}
            />
          </View>
        </View>

        {/* Payment Schedule */}
        <View style={styles.scheduleSection}>
          <Text style={styles.label}>Send Now or Schedule</Text>
          <TouchableOpacity style={styles.scheduleOption}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
            <Text style={styles.scheduleOptionText}>Send Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.scheduleOption}>
            <Ionicons name="calendar-outline" size={20} color={COLORS.muted} />
            <Text style={styles.scheduleOptionText}>Schedule for Later</Text>
          </TouchableOpacity>
        </View>

        {/* Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Amount</Text>
              <Text style={styles.summaryValue}>${amount || '0.00'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Transfer Fee</Text>
              <Text style={styles.summaryValue}>$0.00</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${amount || '0.00'}</Text>
            </View>
          </View>
        </View>

        {/* Fee Info */}
        <View style={styles.feeInfo}>
          <Ionicons name="information-circle" size={16} color={COLORS.primary} />
          <Text style={styles.feeText}>
            The recipient will receive the full amount instantly
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.sendButton, isSending && styles.disabledButton]}
          onPress={handleSendMoney}
          disabled={isSending || !recipientPhone || !amount}
        >
          {isSending ? (
            <ActivityIndicator color={COLORS.background} />
          ) : (
            <Text style={styles.sendButtonText}>Send Money</Text>
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
  content: {
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 80,
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
  fromSection: {
    marginBottom: 24,
  },
  sendSection: {
    marginBottom: 24,
  },
  amountSection: {
    marginBottom: 24,
  },
  purposeSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.foreground,
    marginBottom: 8,
  },
  accountBox: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  accountAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.foreground,
  },
  accountBalance: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.foreground,
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  scheduleSection: {
    marginBottom: 24,
  },
  scheduleOption: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scheduleOptionText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.foreground,
  },
  summarySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.foreground,
    marginBottom: 8,
  },
  summaryBox: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  totalRow: {
    borderBottomWidth: 0,
    paddingTop: 12,
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.muted,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.foreground,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.foreground,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  feeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  feeText: {
    fontSize: 12,
    color: COLORS.foreground,
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.background,
  },
});
