/**
 * Phone number formatting utilities for Indian phone numbers
 */

/**
 * Format phone number to Indian style
 * Handles various input formats and returns standardized Indian format
 * @param {string} phone - Phone number string
 * @returns {string} Formatted phone number in Indian style (+91-XXXXX-XXXXX)
 */
export const formatIndianPhone = (phone) => {
  if (!phone) return '';

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // If already 10 digits (without country code)
  if (cleaned.length === 10) {
    return `+91-${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  }

  // If 12 digits (with country code 91)
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    const numberPart = cleaned.slice(2);
    return `+91-${numberPart.slice(0, 5)}-${numberPart.slice(5)}`;
  }

  // If already has +91 prefix with hyphens, return as is
  if (phone.startsWith('+91-')) {
    return phone;
  }

  // Default: try to extract 10 digits and format
  const digits = cleaned.slice(-10);
  if (digits.length === 10) {
    return `+91-${digits.slice(0, 5)}-${digits.slice(5)}`;
  }

  // Return original if can't format
  return phone;
};

/**
 * Display phone number in user-friendly format
 * @param {string} phone - Phone number string
 * @returns {string} Formatted phone number for display
 */
export const displayPhone = (phone) => {
  return formatIndianPhone(phone);
};

/**
 * Validate Indian phone number
 * @param {string} phone - Phone number string to validate
 * @returns {boolean} True if valid Indian phone number
 */
export const isValidIndianPhone = (phone) => {
  if (!phone) return false;
  const cleaned = phone.replace(/\D/g, '');
  // Should be 10 digits or 12 digits (with country code)
  return cleaned.length === 10 || (cleaned.length === 12 && cleaned.startsWith('91'));
};
