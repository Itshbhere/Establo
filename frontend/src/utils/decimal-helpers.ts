import Decimal from 'decimal.js';

/**
 * Convert a Decimal to a number
 * Note: This may lose precision for very large numbers
 */
export function toNumber(decimal: Decimal): number {
  return decimal.toNumber();
}

/**
 * Check if a Decimal is less than or equal to another value
 */
export function isLessThanOrEqual(decimal: Decimal, value: Decimal | number): boolean {
  return decimal.lte(value);
}

/**
 * Check if a Decimal is greater than another value
 */
export function isGreaterThan(decimal: Decimal, value: Decimal | number): boolean {
  return decimal.gt(value);
}

/**
 * Subtract a Decimal from another
 */
export function subtract(decimal: Decimal, valueToSubtract: Decimal): Decimal {
  return decimal.minus(valueToSubtract);
}

/**
 * Create a formatter for decimal values
 */
export function formatDecimal(decimal: Decimal, decimals: number = 2): string {
  return decimal.toFixed(decimals);
} 