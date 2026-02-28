import crypto from 'crypto';

// Configuration
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
const ALGORITHM = 'aes-256-gcm';

/**
 * Encryption utilities for sensitive PII data
 * Handles phone numbers, SSNs, bank accounts, payment methods
 */

export interface EncryptedData {
  encrypted: string;
  iv: string;
  authTag: string;
}

/**
 * Encrypt sensitive data
 */
export function encryptData(plaintext: string): EncryptedData {
  try {
    const key = deriveKey(ENCRYPTION_KEY);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
    };
  } catch (error) {
    console.error('[encryption] Error encrypting data:', error);
    throw new Error('Encryption failed');
  }
}

/**
 * Decrypt encrypted data
 */
export function decryptData(data: EncryptedData): string {
  try {
    const key = deriveKey(ENCRYPTION_KEY);
    const iv = Buffer.from(data.iv, 'hex');
    const authTag = Buffer.from(data.authTag, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(data.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('[encryption] Error decrypting data:', error);
    throw new Error('Decryption failed');
  }
}

/**
 * Derive encryption key from master key
 */
function deriveKey(masterKey: string): Buffer {
  return crypto
    .createHash('sha256')
    .update(masterKey)
    .digest();
}

/**
 * Hash data (one-way, for verification)
 */
export function hashData(data: string): string {
  return crypto
    .createHash('sha256')
    .update(data)
    .digest('hex');
}

/**
 * Verify hashed data
 */
export function verifyHash(plaintext: string, hash: string): boolean {
  return hashData(plaintext) === hash;
}

/**
 * Mask sensitive data for display (e.g., phone: +234****5678)
 */
export function maskSensitiveData(data: string, type: 'phone' | 'email' | 'account'): string {
  switch (type) {
    case 'phone':
      return data.slice(0, 5) + '*'.repeat(4) + data.slice(-4);
    case 'email': {
      const [local, domain] = data.split('@');
      const maskedLocal = local.slice(0, 2) + '*'.repeat(local.length - 2);
      return `${maskedLocal}@${domain}`;
    }
    case 'account':
      return '*'.repeat(data.length - 4) + data.slice(-4);
    default:
      return data;
  }
}

/**
 * Check if data is encrypted
 */
export function isEncrypted(data: any): data is EncryptedData {
  return (
    typeof data === 'object' &&
    'encrypted' in data &&
    'iv' in data &&
    'authTag' in data
  );
}
