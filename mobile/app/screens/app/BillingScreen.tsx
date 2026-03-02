import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SectionList,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../../config/constants';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'due';
  plan: string;
}

const INVOICES: Invoice[] = [
  { id: '1', date: 'Mar 1, 2024', amount: 15, status: 'paid', plan: 'Professional' },
  { id: '2', date: 'Feb 1, 2024', amount: 15, status: 'paid', plan: 'Professional' },
  { id: '3', date: 'Jan 1, 2024', amount: 5, status: 'paid', plan: 'Starter' },
];

export default function BillingScreen({ navigation }: any) {
  const [expandedInvoice, setExpandedInvoice] = useState<string | null>(null);

  const handleDownloadInvoice = (id: string) => {
    // Implement download logic
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'due':
        return '#EF4444';
      default:
        return COLORS.muted;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Billing & Invoices</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {/* Current Plan */}
        <View style={styles.currentPlanSection}>
          <Text style={styles.sectionTitle}>Current Plan</Text>
          <View style={styles.planBox}>
            <View style={styles.planInfo}>
              <Text style={styles.planName}>Professional Plan</Text>
              <Text style={styles.planDetails}>500 minutes / month</Text>
              <Text style={styles.planRenewal}>Next billing: April 1, 2024</Text>
            </View>
            <TouchableOpacity style={styles.changePlanButton}>
              <Text style={styles.changePlanText}>Change Plan</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentMethodsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            <TouchableOpacity>
              <Ionicons name="add-circle" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.paymentMethodItem}>
            <Ionicons name="card" size={20} color={COLORS.primary} />
            <View style={styles.paymentMethodInfo}>
              <Text style={styles.paymentMethodName}>Visa ending in 4242</Text>
              <Text style={styles.paymentMethodExpiry}>Expires 12/2025</Text>
            </View>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
          </View>
        </View>

        {/* Invoices */}
        <View style={styles.invoicesSection}>
          <Text style={styles.sectionTitle}>Invoices</Text>

          {INVOICES.map(invoice => (
            <TouchableOpacity
              key={invoice.id}
              style={styles.invoiceItem}
              onPress={() => setExpandedInvoice(
                expandedInvoice === invoice.id ? null : invoice.id
              )}
            >
              <View style={styles.invoiceLeft}>
                <Ionicons name="document" size={20} color={COLORS.primary} />
                <View style={styles.invoiceInfo}>
                  <Text style={styles.invoiceDate}>{invoice.date}</Text>
                  <Text style={styles.invoicePlan}>{invoice.plan}</Text>
                </View>
              </View>

              <View style={styles.invoiceRight}>
                <Text style={styles.invoiceAmount}>${invoice.amount}</Text>
                <View
                  style={[
                    styles.invoiceStatus,
                    { backgroundColor: getStatusColor(invoice.status) + '20' },
                  ]}
                >
                  <Text
                    style={[
                      styles.invoiceStatusText,
                      { color: getStatusColor(invoice.status) },
                    ]}
                  >
                    {invoice.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Billing Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Billing Settings</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="mail" size={20} color={COLORS.primary} />
              <Text style={styles.settingText}>Email Receipts</Text>
            </View>
            <View style={[styles.toggle, { backgroundColor: COLORS.primary }]}>
              <View style={styles.toggleDot} />
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications" size={20} color={COLORS.primary} />
              <Text style={styles.settingText}>Payment Reminders</Text>
            </View>
            <View style={[styles.toggle, { backgroundColor: COLORS.primary }]}>
              <View style={styles.toggleDot} />
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="sync" size={20} color={COLORS.primary} />
              <Text style={styles.settingText}>Auto Renew</Text>
            </View>
            <View style={[styles.toggle, { backgroundColor: COLORS.primary }]}>
              <View style={styles.toggleDot} />
            </View>
          </View>
        </View>

        {/* Tax Info */}
        <View style={styles.taxSection}>
          <Text style={styles.sectionTitle}>Tax Information</Text>
          <TouchableOpacity style={styles.taxButton}>
            <Ionicons name="document-text" size={20} color={COLORS.primary} />
            <Text style={styles.taxButtonText}>Add VAT/Tax ID</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  header: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.foreground,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  currentPlanSection: {
    marginBottom: 24,
  },
  planBox: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.foreground,
  },
  planDetails: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 4,
  },
  planRenewal: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
  },
  changePlanButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  changePlanText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: '600',
  },
  paymentMethodsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.foreground,
  },
  paymentMethodItem: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.foreground,
  },
  paymentMethodExpiry: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
  },
  invoicesSection: {
    marginBottom: 24,
  },
  invoiceItem: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  invoiceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  invoiceInfo: {
    flex: 1,
  },
  invoiceDate: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.foreground,
  },
  invoicePlan: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  invoiceRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  invoiceAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.foreground,
  },
  invoiceStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  invoiceStatusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingItem: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.foreground,
  },
  toggle: {
    width: 36,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    alignSelf: 'flex-end',
  },
  taxSection: {
    marginBottom: 20,
  },
  taxButton: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  taxButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.foreground,
  },
});
