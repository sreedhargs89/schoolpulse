import monthsIndex from '@/data/months-index.json';
import announcementsData from '@/data/announcements.json';

// Import all month data files
import november2025 from '@/data/november-2025.json';
import december2025 from '@/data/december-2025.json';
import january2026 from '@/data/january-2026.json';

export interface ScheduleItem {
  time: string;
  subject: string;
  activity: string;
}

export interface DaySchedule {
  date: string;
  dayOfWeek: string;
  isHoliday: boolean;
  holidayName?: string;
  schedule: ScheduleItem[];
}

export interface WeekData {
  weekStart: string;
  weekEnd: string;
  dictationWords: string[];
  days: DaySchedule[];
}

export interface Rhyme {
  title: string;
  content: string;
}

export interface ImportantDate {
  date: string;
  event: string;
  type: 'holiday' | 'event' | 'activity';
  description: string;
}

export interface MonthData {
  month: string;
  year: number;
  class: string;
  school: string;
  weeks: WeekData[];
  rhymes: Rhyme[];
  shloka: {
    sanskrit: string;
    transliteration: string;
    meaning: string;
  };
  story: {
    title: string;
    moral: string;
  };
  importantDates?: ImportantDate[];
}

export interface MonthInfo {
  id: string;
  month: string;
  year: number;
  file: string;
}

export interface Announcement {
  id: number;
  message: string;
  type: 'info' | 'warning' | 'holiday' | 'important';
  createdAt: string;
  expiresAt: string;
}

// Map of month IDs to their data
const monthDataMap: Record<string, MonthData> = {
  'november-2025': november2025 as MonthData,
  'december-2025': december2025 as MonthData,
  'january-2026': january2026 as MonthData,
  // Add more months here as they are created:
  // 'february-2026': february2026 as MonthData,
};

export function getAvailableMonths(): MonthInfo[] {
  return monthsIndex.months;
}

export function findMonthForDate(date: string): string | null {
  const months = getAvailableMonths();
  for (const month of months) {
    const data = monthDataMap[month.id];
    if (data) {
      for (const week of data.weeks) {
        if (week.days.some((d) => d.date === date)) {
          return month.id;
        }
      }
    }
  }
  return null;
}

export function getCurrentMonthId(): string {
  // Try to find the month that contains today's date
  const today = new Date().toISOString().split('T')[0];
  const monthForToday = findMonthForDate(today);

  // If today's date is found in any month data, use that month
  if (monthForToday) {
    return monthForToday;
  }

  // Otherwise, fall back to the configured current month
  return monthsIndex.currentMonth;
}

export function getMonthData(monthId?: string): MonthData {
  const id = monthId || getCurrentMonthId();
  return monthDataMap[id] || monthDataMap[getCurrentMonthId()];
}

export function getAnnouncements(): Announcement[] {
  const today = new Date().toISOString().split('T')[0];
  return (announcementsData.announcements as Announcement[]).filter(
    (a) => a.expiresAt >= today
  );
}

export function getDaySchedule(date: string, monthId?: string): DaySchedule | null {
  const data = getMonthData(monthId);
  for (const week of data.weeks) {
    const day = week.days.find((d) => d.date === date);
    if (day) return day;
  }
  return null;
}

export function getWeekForDate(date: string, monthId?: string): WeekData | null {
  const data = getMonthData(monthId);
  const targetDate = new Date(date);

  for (const week of data.weeks) {
    const weekStart = new Date(week.weekStart);
    const weekEnd = new Date(week.weekEnd);
    if (targetDate >= weekStart && targetDate <= weekEnd) {
      return week;
    }
  }
  return null;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function getAllDates(monthId?: string): string[] {
  const data = getMonthData(monthId);
  const dates: string[] = [];
  for (const week of data.weeks) {
    for (const day of week.days) {
      dates.push(day.date);
    }
  }
  return dates.sort();
}

export function getImportantDates(monthId?: string): ImportantDate[] {
  const data = getMonthData(monthId);
  return data.importantDates || [];
}

export function getUpcomingEvents(daysAhead: number = 7): ImportantDate[] {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + daysAhead);

  const todayStr = today.toISOString().split('T')[0];
  const futureStr = futureDate.toISOString().split('T')[0];

  // Gather from all months
  const months = getAvailableMonths();
  const allEvents: ImportantDate[] = [];

  for (const month of months) {
    const data = monthDataMap[month.id];
    if (data?.importantDates) {
      allEvents.push(...data.importantDates);
    }
  }

  return allEvents
    .filter((e) => e.date >= todayStr && e.date <= futureStr)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getTodayEvent(): ImportantDate | null {
  const today = getToday();
  const months = getAvailableMonths();

  for (const month of months) {
    const data = monthDataMap[month.id];
    if (data?.importantDates) {
      const event = data.importantDates.find((e) => e.date === today);
      if (event) return event;
    }
  }
  return null;
}

export function getSubjectColor(subject: string): string {
  const colors: Record<string, string> = {
    'LITERACY': 'bg-blue-100 text-blue-800 border-blue-200',
    'NUMERACY': 'bg-green-100 text-green-800 border-green-200',
    'KANNADA': 'bg-purple-100 text-purple-800 border-purple-200',
    'HINDI': 'bg-pink-100 text-pink-800 border-pink-200',
    'GENERAL AWARENESS': 'bg-amber-100 text-amber-800 border-amber-200',
    'STORY': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'ART': 'bg-rose-100 text-rose-800 border-rose-200',
    'Snack Break': 'bg-orange-50 text-orange-600 border-orange-200',
    'Prayer/Rhymes & Circle Time': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'General Assembly': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    'Meditation': 'bg-teal-50 text-teal-700 border-teal-200',
    'MAKAR SANKRANTI ACTIVITY': 'bg-orange-100 text-orange-800 border-orange-200',
    'SOCIO EMOTIONAL SKILLS': 'bg-violet-100 text-violet-800 border-violet-200',
  };

  // Check for partial matches
  for (const [key, value] of Object.entries(colors)) {
    if (subject.toUpperCase().includes(key.toUpperCase())) {
      return value;
    }
  }

  return 'bg-gray-100 text-gray-800 border-gray-200';
}
