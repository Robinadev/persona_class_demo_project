import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../../config/constants';

const QUICK_TOPUP_AMOUNTS = [10, 25, 50, 100];

export default function TopupScreen({ navigation, route }: any) {
  const planId = route?.params?.planId;
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleTopup = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate payment processing
      setTimeout(() => {
        Alert.alert(
          'Success',
          `Top-up of $${amount} initiated`,
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
              },
            },
          ]
        );
        setIsProcessing(false);
      }, 2000);
    } catch (error) {
      Alert.alert('Error', 'Payment failed. Please try again.');
      setIsProcessing(false);
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
          <Text style={styles.headerTitle}>Add Credit</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Current Balance */}
        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <View style={styles.balanceBox}>
            <Text style={styles.balanceAmount}>$25.50</Text>
            <Text style={styles.validityText}>Expires in 15 days</Text>
          </View>
        </View>

        {/* Amount Input */}
        <View style={styles.amountSection}>
          <Text style={styles.label}>Amount to Add</Text>
          <View style={styles.amountInput}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor={COLORS.muted}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              editable={!isProcessing}
            />
          </View>
        </View>

        {/* Quick Amount Buttons */}
        <View style={styles.quickAmountsSection}>
          <Text style={styles.label}>Quick Add</Text>
          <View style={styles.quickAmountsGrid}>
            {QUICK_TOPUP_AMOUNTS.map(value => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.quickAmountButton,
                  amount === value.toString() && styles.selectedQuickButton,
                ]}
                onPress={() => handleQuickAmount(value)}
                disabled={isProcessing}
              >
                <Text
                  style={[
                    styles.quickAmountText,
                    amount === value.toString() && styles.selectedQuickText,
                  ]}
                >
                  ${value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.paymentMethodSection}>
          <Text style={styles.label}>Payment Method</Text>
          
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'card' && styles.selectedPaymentOption,
            ]}
            onPress={() => setPaymentMethod('card')}
          >
            <Ionicons name="card" size={20} color={COLORS.primary} />
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Credit/Debit Card</Text>
              <Text style={styles.paymentDetail}>Visa ending in 4242</Text>
            </View>
            {paymentMethod === 'card' && (
              <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'wallet' && styles.selectedPaymentOption,
            ]}
            onPress={() => setPaymentMethod('wallet')}
          >
            <Ionicons name="wallet" size={20} color={COLORS.primary} />
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Mobile Wallet</Text>
              <Text style={styles.paymentDetail}>Apple Pay / Google Pay</Text>
            </View>
            {paymentMethod === 'wallet' && (
              <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'bank' && styles.selectedPaymentOption,
            ]}
            onPress={() => setPaymentMethod('bank')}
          >
            <Ionicons name="business" size={20} color={COLORS.primary} />
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Bank Transfer</Text>
              <Text style={styles.paymentDetail}>Direct to your account</Text>
            </View>
            {paymentMethod === 'bank' && (
              <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.label}>Order Summary</Text>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Amount</Text>
              <Text style={styles.summaryValue}>${amount || '0.00'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Processing Fee</Text>
              <Text style={styles.summaryValue}>$0.00</Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryTotal]}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalValue}>${amount || '0.00'}</Text>
            </View>
          </View>
        </View>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Ionicons name="shield-checkmark" size={16} color={COLORS.primary} />
          <Text style={styles.securityText}>
            Your payment is 100% secure and encrypted
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.topupButton, isProcessing && styles.disabledButton]}
          onPress={handleTopup}
          disabled={isProcessing || !amount}
        >
          {isProcessing ? (
            <ActivityIndicator color={COLORS.background} />
          ) : (
            <Text style={styles.topupButtonText}>Add ${amount || '0.00'}</Text>
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
  balanceSection: {
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.muted,
    marginBottom: 8,
  },
  balanceBox: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.background,
  },
  validityText: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 4,
  },
  amountSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.foreground,
    marginBottom: 8,
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
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.foreground,
  },
  quickAmountsSection: {
    marginBottom: 24,
  },
  quickAmountsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedQuickButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.foreground,
  },
  selectedQuickText: {
    color: COLORS.background,
  },
  paymentMethodSection: {
    marginBottom: 24,
  },
  paymentOption: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  selectedPaymentOption: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.foreground,
  },
  paymentDetail: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  summarySection: {
    marginBottom: 24,
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
  summaryTotal: {
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
  summaryTotalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.foreground,
  },
  summaryTotalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  securityText: {
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
  topupButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  topupButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.background,
  },
});
