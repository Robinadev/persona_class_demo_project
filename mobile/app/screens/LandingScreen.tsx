import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  Platform,
} from 'react-native';
import { COLORS } from '../config/constants';

export default function LandingScreen({ navigation }: any) {
  const features = [
    {
      title: 'International Calling',
      description: 'Make affordable calls to USA and worldwide',
      icon: '📞',
    },
    {
      title: 'Send Money',
      description: 'Transfer funds securely to loved ones',
      icon: '💰',
    },
    {
      title: 'Flexible Plans',
      description: 'Choose the perfect plan for your needs',
      icon: '📦',
    },
    {
      title: 'Rewards Program',
      description: 'Earn points on every transaction',
      icon: '🎁',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>International Call</Text>
          <Text style={styles.tagline}>Connect with the World</Text>
        </View>

        {/* Hero Image */}
        <View style={styles.heroSection}>
          <Text style={styles.heroEmoji}>🌍</Text>
          <Text style={styles.heroText}>Affordable International Calling</Text>
          <Text style={styles.heroSubtext}>Stay connected with friends and family worldwide</Text>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <Text style={styles.featureEmoji}>{feature.icon}</Text>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Get Started Today</Text>
          <Text style={styles.ctaDescription}>
            Join thousands of users making affordable international calls
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 International Call. All rights reserved.</Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.footerSeparator}>•</Text>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Terms of Service</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.muted,
    fontWeight: '500',
  },
  heroSection: {
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 40,
    marginBottom: 40,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  heroEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  heroText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtext: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: 'center',
  },
  featuresGrid: {
    marginBottom: 40,
    gap: 16,
  },
  featureCard: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  featureEmoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.foreground,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: COLORS.muted,
    lineHeight: 18,
  },
  ctaSection: {
    marginBottom: 40,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: 'center',
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 8,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerLink: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  footerSeparator: {
    color: COLORS.muted,
  },
});
