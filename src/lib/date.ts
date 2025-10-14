import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, subYears, addMonths, addYears } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

export const locales = { es, en: enUS };

export function getDateRange(type: 'month' | 'quarter' | 'year', date: Date = new Date()) {
  switch (type) {
    case 'month':
      return {
        start: startOfMonth(date),
        end: endOfMonth(date),
      };
    case 'quarter':
      const quarter = Math.floor(date.getMonth() / 3);
      const quarterStart = new Date(date.getFullYear(), quarter * 3, 1);
      const quarterEnd = new Date(date.getFullYear(), quarter * 3 + 3, 0);
      return {
        start: quarterStart,
        end: quarterEnd,
      };
    case 'year':
      return {
        start: startOfYear(date),
        end: endOfYear(date),
      };
    default:
      return {
        start: startOfMonth(date),
        end: endOfMonth(date),
      };
  }
}

export function getPreviousPeriod(type: 'month' | 'quarter' | 'year', date: Date = new Date()) {
  switch (type) {
    case 'month':
      return getDateRange('month', subMonths(date, 1));
    case 'quarter':
      return getDateRange('quarter', subMonths(date, 3));
    case 'year':
      return getDateRange('year', subYears(date, 1));
    default:
      return getDateRange('month', subMonths(date, 1));
  }
}

export function getLast12Months(date: Date = new Date()) {
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const monthDate = subMonths(date, i);
    months.push({
      date: monthDate,
      start: startOfMonth(monthDate),
      end: endOfMonth(monthDate),
      label: format(monthDate, 'MMM yyyy'),
    });
  }
  return months;
}

export function getLast4Quarters(date: Date = new Date()) {
  const quarters = [];
  for (let i = 3; i >= 0; i--) {
    const quarterDate = subMonths(date, i * 3);
    const quarter = Math.floor(quarterDate.getMonth() / 3);
    quarters.push({
      date: quarterDate,
      start: new Date(quarterDate.getFullYear(), quarter * 3, 1),
      end: new Date(quarterDate.getFullYear(), quarter * 3 + 3, 0),
      label: `Q${quarter + 1} ${quarterDate.getFullYear()}`,
    });
  }
  return quarters;
}

export function getLast5Years(date: Date = new Date()) {
  const years = [];
  for (let i = 4; i >= 0; i--) {
    const yearDate = subYears(date, i);
    years.push({
      date: yearDate,
      start: startOfYear(yearDate),
      end: endOfYear(yearDate),
      label: yearDate.getFullYear().toString(),
    });
  }
  return years;
}

export function formatDateRange(start: Date, end: Date, locale: string = 'es') {
  const localeObj = locales[locale as keyof typeof locales] || locales.es;
  
  if (start.getFullYear() === end.getFullYear()) {
    if (start.getMonth() === end.getMonth()) {
      return format(start, 'd', { locale: localeObj }) + ' - ' + format(end, 'd MMM yyyy', { locale: localeObj });
    } else {
      return format(start, 'd MMM', { locale: localeObj }) + ' - ' + format(end, 'd MMM yyyy', { locale: localeObj });
    }
  } else {
    return format(start, 'd MMM yyyy', { locale: localeObj }) + ' - ' + format(end, 'd MMM yyyy', { locale: localeObj });
  }
}

export function getWeekdayName(date: Date, locale: string = 'es') {
  const localeObj = locales[locale as keyof typeof locales] || locales.es;
  return format(date, 'EEEE', { locale: localeObj });
}

export function getMonthName(date: Date, locale: string = 'es') {
  const localeObj = locales[locale as keyof typeof locales] || locales.es;
  return format(date, 'MMMM', { locale: localeObj });
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

export function isThisMonth(date: Date): boolean {
  const today = new Date();
  return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
}

export function isThisYear(date: Date): boolean {
  const today = new Date();
  return date.getFullYear() === today.getFullYear();
}

export function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function getFirstDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getLastDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getDateDifferenceInDays(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function parseDateString(dateString: string): Date {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateString}`);
  }
  return date;
}

export function formatDateForInput(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatDateTimeForInput(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm");
}

