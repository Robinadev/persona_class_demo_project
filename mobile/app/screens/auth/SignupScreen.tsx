import React, { useState } from 'react';
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
  Checkbox,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../config/constants';
import { validateAndNormalizePhone } from '../../utils/phoneUtils';
import { toast } from 'sonner';

export default function SignupScreen({ navigation }: any) {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expiresIn, setExpiresIn] = useState(0);

  const handleSendVerification = async () => {
    if (!firstName || !lastName || !email || !phoneNumber) {
      setError('Please fill in all fields');
      return;
    }

    if (!acceptedTerms) {
      setError('Please accept terms and conditions');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const normalized = validateAndNormalizePhone(phoneNumber);
      if (!normalized) {
        setError('Invalid phone number. Use USA numbers only.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: normalized }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send verification code');
        setLoading(false);
        return;
      }

      setStep(2);
      setExpiresIn(data.expiresIn || 600);
      Alert.alert('Success', 'Verification code sent to your phone');
    } catch (err: any) {
      setError('An error occurred. Please try again.');
      console.error('Send OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const normalized = validateAndNormalizePhone(phoneNumber);
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: normalized,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to verify code');
        setLoading(false);
        return;
      }

      setStep(3);
    } catch (err: any) {
      setError('An error occurred. Please try again.');
      console.error('Verify OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSignup = async () => {
    setError('');
    setLoading(true);

    try {
      const normalized = validateAndNormalizePhone(phoneNumber);
      const signupResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phoneNumber: normalized,
          acceptedTerms,
        }),
      });

      const signupData = await signupResponse.json();

      if (!signupResponse.ok) {
        setError(signupData.error || 'Failed to create account');
        setLoading(false);
        return;
      }

      Alert.alert('Success', 'Account created successfully! Please log in.');
      navigation.navigate('Login');
    } catch (err: any) {
      setError('An error occurred. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setLoading(true);

    try {
      const normalized = validateAndNormalizePhone(phoneNumber);
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: normalized }),
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Step {step} of 3</Text>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your first name"
                placeholderTextColor={COLORS.muted}
                value={firstName}
                onChangeText={setFirstName}
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your last name"
                placeholderTextColor={COLORS.muted}
                value={lastName}
                onChangeText={setLastName}
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.muted}
                value={email}
                onChangeText={setEmail}
                editable={!loading}
                keyboardType="email-address"
              />
            </View>

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

            <View style={styles.termsBox}>
              <Checkbox
                value={acceptedTerms}
                onValueChange={setAcceptedTerms}
                disabled={loading}
              />
              <Text style={styles.termsText}>
                I accept the{' '}
                <Text style={styles.termsLink}>Terms and Conditions</Text>
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.disabledButton]}
              onPress={handleSendVerification}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.background} />
              ) : (
                <Text style={styles.primaryButtonText}>Send Verification Code</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
              <Text style={styles.linkText}>Already have an account? Log In</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2: Verify Phone */}
        {step === 2 && (
          <View style={styles.form}>
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
              onPress={handleVerifyCode}
              disabled={loading || verificationCode.length !== 6}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.background} />
              ) : (
                <Text style={styles.primaryButtonText}>Verify Code</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, loading && styles.disabledButton]}
              onPress={handleResendCode}
              disabled={loading}
            >
              <Text style={styles.secondaryButtonText}>Resend Code</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setStep(1);
                setVerificationCode('');
                setError('');
              }}
              disabled={loading}
            >
              <Text style={styles.linkText}>Back</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <View style={styles.form}>
            <View style={styles.confirmBox}>
              <Text style={styles.confirmTitle}>Your account is ready!</Text>
              <Text style={styles.confirmLabel}>Name:</Text>
              <Text style={styles.confirmValue}>
                {firstName} {lastName}
              </Text>
              <Text style={styles.confirmLabel}>Email:</Text>
              <Text style={styles.confirmValue}>{email}</Text>
              <Text style={styles.confirmLabel}>Phone:</Text>
              <Text style={styles.confirmValue}>{phoneNumber}</Text>
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.disabledButton]}
              onPress={handleConfirmSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.background} />
              ) : (
                <Text style={styles.primaryButtonText}>Complete Signup</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setStep(2)}
              disabled={loading}
            >
              <Text style={styles.linkText}>Back</Text>
            </TouchableOpacity>
          </View>
        )}
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
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
  termsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 8,
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.foreground,
    lineHeight: 18,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: '600',
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
  linkText: {
    color: COLORS.primary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '500',
  },
  confirmBox: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  confirmLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.muted,
    marginTop: 8,
  },
  confirmValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.foreground,
    marginBottom: 4,
  },
});
