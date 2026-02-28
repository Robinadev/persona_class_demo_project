import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

/**
 * Mobile encryption utilities using Expo SecureStore
 * For sensitive PII storage on device
 */

export interface EncryptedDataMobile {
  encrypted: string;
  iv: string;
  authTag: string;
}

const ALGORITHM = 'aes-256-gcm';

/**
 * Store encrypted data securely on device
 */
export async function storeSecurely(key: string, value: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error('[mobile-encryption] Failed to store securely:', error);
    throw error;
  }
}

/**
 * Retrieve encrypted data from secure storage
 */
export async function retrieveSecurely(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error('[mobile-encryption] Failed to retrieve securely:', error);
    return null;
  }
}

/**
 * Delete sensitive data from secure storage
 */
export async function deleteSecurely(key: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error('[mobile-encryption] Failed to delete securely:', error);
    throw error;
  }
}

/**
 * Hash sensitive data
 */
export async function hashData(data: string): Promise<string> {
  try {
    const digest = await Crypto.digest(Crypto.CryptoDigestAlgorithm.SHA256, data);
    return digest;
  } catch (error) {
    console.error('[mobile-encryption] Hash failed:', error);
    throw error;
  }
}

/**
 * Generate random token for API requests
 */
export async function generateRandomToken(length: number = 32): Promise<string> {
  try {
    const randomBytes = await Crypto.getRandomBytes(length);
    return randomBytes
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  } catch (error) {
    console.error('[mobile-encryption] Token generation failed:', error);
    throw error;
  }
}

/**
 * Mask sensitive data for display
 */
export function maskSensitiveData(
  data: string,
  type: 'phone' | 'email' | 'account' | 'card'
): string {
  switch (type) {
    case 'phone':
      // +234****5678
      return data.slice(0, 4) + '*'.repeat(4) + data.slice(-4);
    case 'email': {
      // us****@example.com
      const [local, domain] = data.split('@');
      const maskedLocal = local.slice(0, 2) + '*'.repeat(Math.max(2, local.length - 2));
      return `${maskedLocal}@${domain}`;
    }
    case 'account':
      // ****5678
      return '*'.repeat(Math.max(4, data.length - 4)) + data.slice(-4);
    case 'card':
      // 4111 **** **** 1111
      return data.slice(0, 4) + ' **** **** ' + data.slice(-4);
    default:
      return data;
  }
}

/**
 * Encrypt sensitive data locally before sending to API
 */
export async function encryptBeforeSend(data: string, deviceKey: string): Promise<string> {
  try {
    // In production, use native encryption from SecureStore
    // For now, hash and store locally
    const hashed = await hashData(data + deviceKey);
    return hashed;
  } catch (error) {
    console.error('[mobile-encryption] Encryption failed:', error);
    throw error;
  }
}

/**
 * Clear all sensitive data from device (for logout)
 */
export async function clearAllSensitiveData(): Promise<void> {
  try {
    const sensitivKeys = [
      'user_phone',
      'user_email',
      'user_ssn',
      'user_bank_account',
      'user_card',
      'auth_token',
      'refresh_token',
    ];

    for (const key of sensitivKeys) {
      await deleteSecurely(key);
    }
  } catch (error) {
    console.error('[mobile-encryption] Clear sensitive data failed:', error);
    throw error;
  }
}
