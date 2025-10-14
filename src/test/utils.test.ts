import { describe, it, expect } from 'vitest';
import { 
  formatCurrency, 
  formatNumber, 
  formatPercentage, 
  formatDate,
  calculatePercentageChange,
  getInitials,
  isValidEmail,
} from '@/lib/utils';

describe('Utils', () => {
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1234.56, 'EUR', 'es-ES')).toBe('1.234,56 €');
      expect(formatCurrency(1000, 'USD', 'en-US')).toBe('$1,000.00');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers correctly', () => {
      expect(formatNumber(1234.56, 'es-ES')).toBe('1.234,56');
      expect(formatNumber(1000, 'en-US')).toBe('1,000');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentages correctly', () => {
      expect(formatPercentage(25.5, 'es-ES')).toBe('25,5 %');
      expect(formatPercentage(100, 'en-US')).toBe('100.0 %');
    });
  });

  describe('formatDate', () => {
    it('should format dates correctly', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date, 'es-ES')).toBe('15 ene 2024');
      expect(formatDate(date, 'en-US')).toBe('Jan 15, 2024');
    });
  });

  describe('calculatePercentageChange', () => {
    it('should calculate percentage change correctly', () => {
      expect(calculatePercentageChange(120, 100)).toBe(20);
      expect(calculatePercentageChange(80, 100)).toBe(-20);
      expect(calculatePercentageChange(100, 0)).toBe(100);
    });
  });

  describe('getInitials', () => {
    it('should get initials correctly', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('María José García')).toBe('MG');
      expect(getInitials('A')).toBe('A');
    });
  });

  describe('isValidEmail', () => {
    it('should validate emails correctly', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('user@domain.co.uk')).toBe(true);
    });
  });
});

