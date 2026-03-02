/**
 * Validate and normalize USA phone numbers to E.164 format
 */
export function validateAndNormalizePhone(phoneNumber: string): string | null {
  if (!phoneNumber) return null;

  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Handle cases: 5551234567 (10 digits) or 15551234567 (11 digits with +1)
  let digits = cleaned;
  if (cleaned.startsWith('1') && cleaned.length === 11) {
    digits = cleaned.substring(1);
  }

  // Must be exactly 10 digits for USA number
  if (digits.length !== 10) {
    return null;
  }

  // Return in E.164 format
  return `+1${digits}`;
}

/**
 * Format phone number for display (555) 123-4567
 */
export function formatPhoneForDisplay(phoneNumber: string): string {
  const normalized = validateAndNormalizePhone(phoneNumber);
  if (!normalized) return phoneNumber;

  // Remove +1 and format as (555) 123-4567
  const digits = normalized.substring(2);
  return `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6)}`;
}

/**
 * Mask phone number for privacy (555) ***-****
 */
export function maskPhone(phoneNumber: string): string {
  const normalized = validateAndNormalizePhone(phoneNumber);
  if (!normalized) return phoneNumber;

  const digits = normalized.substring(2);
  return `+1 ${digits.substring(0, 3)} ***-****`;
}

/**
 * Check if phone number is valid
 */
export function isValidPhone(phoneNumber: string): boolean {
  return validateAndNormalizePhone(phoneNumber) !== null;
}
