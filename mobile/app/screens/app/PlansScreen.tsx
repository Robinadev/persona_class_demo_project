import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../../config/constants';

interface Plan {
  id: string;
  name: string;
  price: number;
  minutes: number;
  validity: string;
  features: string[];
  isPopular: boolean;
}

const PLANS: Plan[] = [
  {
    id: '1',
    name: 'Starter',
    price: 5,
    minutes: 100,
    validity: '30 days',
    features: ['100 minutes', 'USA calls only', 'Standard support'],
    isPopular: false,
  },
  {
    id: '2',
    name: 'Professional',
    price: 15,
    minutes: 500,
    validity: '30 days',
    features: ['500 minutes', 'USA + International', 'Priority support', 'Call recording'],
    isPopular: true,
  },
  {
    id: '3',
    name: 'Business',
    price: 35,
    minutes: 2000,
    validity: '30 days',
    features: ['2000 minutes', 'Unlimited international', '24/7 support', 'Analytics dashboard'],
    isPopular: false,
  },
];

export default function PlansScreen({ navigation }: any) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to payment/topup
      navigation.navigate('Topup', { planId });
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Your Plan</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>
            All plans include unlimited contact storage and call recording
          </Text>
        </View>

        {/* Plans Grid */}
        {PLANS.map(plan => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              plan.isPopular && styles.popularPlanCard,
              selectedPlan === plan.id && styles.selectedPlanCard,
            ]}
            onPress={() => handleSelectPlan(plan.id)}
            disabled={isLoading}
          >
            {plan.isPopular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularBadgeText}>Most Popular</Text>
              </View>
            )}

            {/* Plan Header */}
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>${plan.price}</Text>
              <Text style={styles.planDuration}>per {plan.validity}</Text>
            </View>

            {/* Plan Details */}
            <View style={styles.planDetails}>
              <View style={styles.planMinutes}>
                <Ionicons name="time" size={20} color={COLORS.primary} />
                <Text style={styles.minutesText}>
                  {plan.minutes.toLocaleString()} minutes
                </Text>
              </View>
            </View>

            {/* Features */}
            <View style={styles.features}>
              {plan.features.map((feature, idx) => (
                <View key={idx} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            {/* Select Button */}
            <TouchableOpacity
              style={[
                styles.selectButton,
                selectedPlan === plan.id && styles.selectedButton,
              ]}
              onPress={() => handleSelectPlan(plan.id)}
              disabled={isLoading}
            >
              {isLoading && selectedPlan === plan.id ? (
                <ActivityIndicator color={COLORS.background} size="small" />
              ) : (
                <Text style={styles.selectButtonText}>
                  {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                </Text>
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Can I change my plan anytime?</Text>
            <Text style={styles.faqAnswer}>
              Yes, you can upgrade or downgrade your plan at any time.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Do unused minutes carry over?</Text>
            <Text style={styles.faqAnswer}>
              No, all minutes expire at the end of the billing period.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Is there a trial period?</Text>
            <Text style={styles.faqAnswer}>
              Yes, new users get 50 free minutes for their first call.
            </Text>
          </View>
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
  infoBox: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.foreground,
    fontWeight: '500',
  },
  planCard: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  popularPlanCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.background,
  },
  selectedPlanCard: {
    borderColor: COLORS.primary,
    borderWidth: 3,
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  popularBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.background,
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.foreground,
  },
  planPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 4,
  },
  planDuration: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
  },
  planDetails: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  planMinutes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  minutesText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.foreground,
  },
  features: {
    gap: 8,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 13,
    color: COLORS.foreground,
  },
  selectButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: COLORS.primary,
    opacity: 0.8,
  },
  selectButtonText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '600',
  },
  faqSection: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  faqTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.foreground,
    marginBottom: 12,
  },
  faqItem: {
    marginBottom: 16,
  },
  faqQuestion: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.foreground,
    marginBottom: 4,
  },
  faqAnswer: {
    fontSize: 12,
    color: COLORS.muted,
    lineHeight: 18,
  },
});
