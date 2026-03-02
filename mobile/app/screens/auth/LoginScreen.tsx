import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../config/constants';
import { API_URL } from '../../config/constants';

export default function LoginScreen({ navigation }: any) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expiresIn, setExpiresIn] = useState(0);
  const [error, setError] = useState('');
  const { login } = useAuth();

  useEffect(() => {
    if (expiresIn > 0 && isVerificationSent) {
      const timer = setTimeout(() => setExpiresIn(expiresIn - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [expiresIn, isVerificationSent]);

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid USA phone number');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send verification code');
        setLoading(false);
        return;
      }

      setIsVerificationSent(true);
      setExpiresIn(data.expiresIn || 600);
      Alert.alert('Success', `Verification code sent to your phone`);
    } catch (err: any) {
      setError('An error occurred. Please try again.');
      console.error('Send OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber,
          code: verificationCode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to verify code');
        setLoading(false);
        return;
      }

      // Store authentication data
      await login(data.token, data.phoneNumber, data.userId);
      Alert.alert('Success', 'Login successful!');
    } catch (err: any) {
      setError('An error occurred. Please try again.');
      console.error('Verify OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to resend code');
        setLoading(false);
        return;
      }

      setVerificationCode('');
      setExpiresIn(data.expiresIn || 600);
      Alert.alert('Success', 'New verification code sent');
    } catch (err: any) {
      setError('An error occurred. Please try again.');
      console.error('Resend OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>International Call</Text>
          <Text style={styles.subtitle}>Phone Verification</Text>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Form */}
        <View style={styles.form}>
          {!isVerificationSent ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+1 (555) 123-4567"
                  placeholderTextColor={COLORS.muted}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  editable={!loading}
                  keyboardType="phone-pad"
                />
                <Text style={styles.helperText}>USA numbers only</Text>
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.disabledButton]}
                onPress={handleSendOTP}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.background} />
                ) : (
                  <Text style={styles.primaryButtonText}>Send Verification Code</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.infoText}>
                Verification code sent to your phone
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>6-Digit Code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="000000"
                  placeholderTextColor={COLORS.muted}
                  value={verificationCode}
                  onChangeText={(text) => setVerificationCode(text.replace(/\D/g, '').slice(0, 6))}
                  editable={!loading}
                  keyboardType="number-pad"
                  maxLength={6}
                />
                <Text style={styles.helperText}>
                  {expiresIn > 0 ? `Expires in ${Math.ceil(expiresIn / 60)} minutes` : 'Code expired'}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, (loading || verificationCode.length !== 6) && styles.disabledButton]}
                onPress={handleVerifyOTP}
                disabled={loading || verificationCode.length !== 6}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.background} />
                ) : (
                  <Text style={styles.primaryButtonText}>Verify & Login</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryButton, loading && styles.disabledButton]}
                onPress={handleResendOTP}
                disabled={loading}
              >
                <Text style={styles.secondaryButtonText}>Resend Code</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setIsVerificationSent(false);
                  setVerificationCode('');
                  setError('');
                  setExpiresIn(0);
                }}
                disabled={loading}
              >
                <Text style={styles.changePhoneText}>Use Different Number</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Signup Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')} disabled={loading}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingVertical: 40,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.muted,
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
  infoText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.foreground,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.foreground,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  changePhoneText: {
    color: COLORS.primary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: COLORS.muted,
    fontSize: 14,
  },
  signupLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
