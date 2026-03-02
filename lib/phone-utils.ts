/**
 * International phone number utilities
 * Handles validation and normalization for USA phone numbers in E.164 format
 */

const PHONE_REGEX = /^\+?1?\d{9,15}$/;

/**
 * Validate and normalize USA phone number to E.164 format
 * Accepts: 5551234567, (555) 123-4567, +1 555 123 4567, +15551234567
 * Returns: +15551234567 or null if invalid
 */
export function validateAndNormalizePhone(phone: string): string | null {
  if (!phone || typeof phone !== 'string') {
    return null;
  }

  // Remove spaces, dashes, parentheses
  const cleaned = phone.replace(/[\s\-()]/g, '');

  // If it's 10 digits, add +1 prefix for USA
  if (cleaned.match(/^\d{10}$/)) {
    return `+1${cleaned}`;
  }

  // If it starts with 1 and has 11 digits, format as +1XXXXXXXXXX
  if (cleaned.match(/^1\d{10}$/)) {
    return `+${cleaned}`;
  }

  // If it already has + prefix
  if (cleaned.match(/^\+1\d{10}$/)) {
    return cleaned;
  }

  // For international numbers (but we're focusing on USA)
  if (cleaned.match(/^\+\d{1,15}$/)) {
    return cleaned;
  }

  return null;
}

/**
 * Format phone number for display
 * +15551234567 -> (555) 123-4567
 */
export function formatPhoneForDisplay(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `(${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  return phone;
}

/**
 * Check if phone is valid USA number
 */
export function isValidUSAPhone(phone: string): boolean {
  const normalized = validateAndNormalizePhone(phone);
  return normalized !== null && normalized.startsWith('+1');
}

/**
 * Extract country code from phone number
 */
export function getCountryCode(phone: string): string {
  const normalized = validateAndNormalizePhone(phone);
  if (!normalized) return '';

  const match = normalized.match(/^\+(\d{1,3})/);
  return match ? match[1] : '';
}

/**
 * Mask phone number for display (security)
 * +15551234567 -> +1 555 ***-****
 */
export function maskPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 11) {
    const areaCode = cleaned.slice(1, 4);
    return `+1 ${areaCode} ***-****`;
  }

  if (cleaned.length === 10) {
    const areaCode = cleaned.slice(0, 3);
    return `+1 ${areaCode} ***-****`;
  }

  return phone;
}
