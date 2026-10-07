/**
 * Currency Formatter Utility
 * Formats monetary amounts in Indian Rupees (₹) using Indian numbering system (e.g. ₹24,999, ₹1,19,999).
 */

export const formatRupee = (amount: number | string | undefined | null): string => {
  const num = typeof amount === 'number' ? amount : Number(amount);
  if (isNaN(num)) return '₹0';
  return '₹' + Math.round(num).toLocaleString('en-IN');
};

export const CURRENCY_SYMBOL = '₹';
