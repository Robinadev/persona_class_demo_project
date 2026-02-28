import { encrypt, decrypt, hashValue } from './encryption';

// Type definitions for encrypted data
export interface EncryptedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneEncrypted: { iv: string; data: string; authTag: string } | null;
  phoneHash: string | null;
  ssnEncrypted: { iv: string; data: string; authTag: string } | null;
  ssnHash: string | null;
  encryptionEnabled: boolean;
  role: 'super_admin' | 'admin' | 'support' | 'user';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  methodType: 'bank_account' | 'card' | 'wallet';
  accountNumberEncrypted: { iv: string; data: string; authTag: string } | null;
  accountNumberHash: string | null;
  accountName: string;
  bankCode: string;
  isDefault: boolean;
  isVerified: boolean;
  verifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SensitiveDataLog {
  id: string;
  userId: string;
  dataType: 'phone' | 'ssn' | 'payment_method';
  action: 'view' | 'update' | 'encrypt' | 'decrypt';
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

// Service class for encrypted data operations
export class EncryptedDataService {
  /**
   * Encrypt and store user phone number
   */
  static encryptPhoneNumber(phone: string): { encrypted: any; hash: string } {
    const encrypted = encrypt(phone);
    const hash = hashValue(phone);
    return { encrypted, hash };
  }

  /**
   * Decrypt user phone number with verification
   */
  static decryptPhoneNumber(encrypted: any, providedHash: string): string | null {
    try {
      const decrypted = decrypt(encrypted);
      const hash = hashValue(decrypted);
      
      // Verify hash matches before returning
      if (hash === providedHash) {
        return decrypted;
      }
      console.warn('Phone hash verification failed - possible tampering');
      return null;
    } catch (error) {
      console.error('Failed to decrypt phone number:', error);
      return null;
    }
  }

  /**
   * Encrypt and store SSN
   */
  static encryptSSN(ssn: string): { encrypted: any; hash: string } {
    const encrypted = encrypt(ssn);
    const hash = hashValue(ssn);
    return { encrypted, hash };
  }

  /**
   * Decrypt SSN with verification
   */
  static decryptSSN(encrypted: any, providedHash: string): string | null {
    try {
      const decrypted = decrypt(encrypted);
      const hash = hashValue(decrypted);
      
      if (hash === providedHash) {
        return decrypted;
      }
      console.warn('SSN hash verification failed - possible tampering');
      return null;
    } catch (error) {
      console.error('Failed to decrypt SSN:', error);
      return null;
    }
  }

  /**
   * Encrypt and store payment method account number
   */
  static encryptAccountNumber(accountNumber: string): { encrypted: any; hash: string } {
    const encrypted = encrypt(accountNumber);
    const hash = hashValue(accountNumber);
    return { encrypted, hash };
  }

  /**
   * Decrypt account number with verification
   */
  static decryptAccountNumber(encrypted: any, providedHash: string): string | null {
    try {
      const decrypted = decrypt(encrypted);
      const hash = hashValue(decrypted);
      
      if (hash === providedHash) {
        return decrypted;
      }
      console.warn('Account number hash verification failed - possible tampering');
      return null;
    } catch (error) {
      console.error('Failed to decrypt account number:', error);
      return null;
    }
  }

  /**
   * Mask sensitive data for display
   */
  static maskPhoneNumber(phone: string): string {
    if (phone.length < 4) return '****';
    return '*'.repeat(phone.length - 4) + phone.slice(-4);
  }

  /**
   * Mask payment account number
   */
  static maskAccountNumber(accountNumber: string): string {
    if (accountNumber.length < 4) return '****';
    return '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4);
  }

  /**
   * Mask SSN
   */
  static maskSSN(ssn: string): string {
    return '***-**-' + ssn.slice(-4);
  }
}
