import { describe, it, expect } from 'vitest';
import { 
  getDateRange, 
  getPreviousPeriod, 
  getLast12Months,
  formatDateRange,
  isToday,
  isThisMonth,
  isThisYear,
} from '@/lib/date';

describe('Date Utils', () => {
  describe('getDateRange', () => {
    it('should get month range correctly', () => {
      const date = new Date('2024-01-15');
      const range = getDateRange('month', date);
      
      expect(range.start.getMonth()).toBe(0); // January
      expect(range.start.getDate()).toBe(1);
      expect(range.end.getMonth()).toBe(0); // January
      expect(range.end.getDate()).toBe(31);
    });

    it('should get year range correctly', () => {
      const date = new Date('2024-06-15');
      const range = getDateRange('year', date);
      
      expect(range.start.getFullYear()).toBe(2024);
      expect(range.start.getMonth()).toBe(0); // January
      expect(range.start.getDate()).toBe(1);
      expect(range.end.getFullYear()).toBe(2024);
      expect(range.end.getMonth()).toBe(11); // December
      expect(range.end.getDate()).toBe(31);
    });
  });

  describe('getPreviousPeriod', () => {
    it('should get previous month correctly', () => {
      const date = new Date('2024-01-15');
      const previous = getPreviousPeriod('month', date);
      
      expect(previous.start.getMonth()).toBe(11); // December
      expect(previous.start.getFullYear()).toBe(2023);
    });
  });

  describe('getLast12Months', () => {
    it('should return 12 months', () => {
      const months = getLast12Months();
      expect(months).toHaveLength(12);
    });

    it('should have correct structure', () => {
      const months = getLast12Months();
      const firstMonth = months[0];
      
      expect(firstMonth).toHaveProperty('date');
      expect(firstMonth).toHaveProperty('start');
      expect(firstMonth).toHaveProperty('end');
      expect(firstMonth).toHaveProperty('label');
    });
  });

  describe('formatDateRange', () => {
    it('should format date range correctly', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-31');
      
      const formatted = formatDateRange(start, end, 'es');
      expect(formatted).toContain('1');
      expect(formatted).toContain('31');
      expect(formatted).toContain('ene');
    });
  });

  describe('date checks', () => {
    it('should check if date is today', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      expect(isToday(today)).toBe(true);
      expect(isToday(yesterday)).toBe(false);
    });

    it('should check if date is this month', () => {
      const thisMonth = new Date();
      const lastMonth = new Date(thisMonth);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      expect(isThisMonth(thisMonth)).toBe(true);
      expect(isThisMonth(lastMonth)).toBe(false);
    });

    it('should check if date is this year', () => {
      const thisYear = new Date();
      const lastYear = new Date(thisYear);
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      
      expect(isThisYear(thisYear)).toBe(true);
      expect(isThisYear(lastYear)).toBe(false);
    });
  });
});

