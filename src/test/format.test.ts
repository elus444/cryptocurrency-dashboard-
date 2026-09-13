import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPercentage } from '@/utils/format';

describe('formatCurrency', () => {
  it('formats positive values', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
  });
  it('handles zero with high precision', () => {
    expect(formatCurrency(0)).toBe('$0.000000');
  });
});

describe('formatPercentage', () => {
  it('formats a percentage with sign', () => {
    expect(formatPercentage(0.125, 2, true)).toContain('12.5');
  });
});
