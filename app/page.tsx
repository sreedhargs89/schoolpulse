'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import DaySchedule from '@/components/DaySchedule';
import DictationWords from '@/components/DictationWords';
import MonthSelector from '@/components/MonthSelector';
import ImportantDates from '@/components/ImportantDates';
import ShareButton from '@/components/ShareButton';
import RecentUpdates from '@/components/RecentUpdates';
import {
  getMonthData,
  getDaySchedule,
  getWeekForDate,
  formatDate,
  getAllDates,
  getAvailableMonths,
  getCurrentMonthId,
  getImportantDates,
  DaySchedule as DayScheduleType,
  WeekData,
  MonthInfo,
  ImportantDate,
} from '@/lib/data';

export default function Home() {
  const searchParams = useSearchParams();
  const urlDate = searchParams.get('date');

  const [selectedMonthId, setSelectedMonthId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [dayData, setDayData] = useState<DayScheduleType | null>(null);
  const [weekData, setWeekData] = useState<WeekData | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableMonths, setAvailableMonths] = useState<MonthInfo[]>([]);
  const [monthData, setMonthData] = useState<{ month: string; year: number; class: string } | null>(null);
  const [importantDates, setImportantDates] = useState<ImportantDate[]>([]);

  // Initialize months
  useEffect(() => {
    const months = getAvailableMonths();
    setAvailableMonths(months);
    setSelectedMonthId(getCurrentMonthId());
  }, []);

  // Handle URL date parameter changes
  useEffect(() => {
    if (urlDate && availableDates.includes(urlDate)) {
      setSelectedDate(urlDate);
    }
  }, [urlDate, availableDates]);

  // Update dates when month changes
  useEffect(() => {
    if (!selectedMonthId) return;

    const dates = getAllDates(selectedMonthId);
    setAvailableDates(dates);

    // Only set default date if no URL date and no date selected yet
    if (!urlDate && !selectedDate) {
      const today = new Date().toISOString().split('T')[0];
      const defaultDate = dates.includes(today) ? today : dates[0];
      setSelectedDate(defaultDate);
    } else if (urlDate && dates.includes(urlDate)) {
      setSelectedDate(urlDate);
    } else if (!dates.includes(selectedDate)) {
      // Current date not in this month, reset to first available
      setSelectedDate(dates[0]);
    }

    const data = getMonthData(selectedMonthId);
    setMonthData({ month: data.month, year: data.year, class: data.class });
    setImportantDates(getImportantDates(selectedMonthId));
  }, [selectedMonthId]);

  // Update day data when date changes
  useEffect(() => {
    if (selectedDate && selectedMonthId) {
      setDayData(getDaySchedule(selectedDate, selectedMonthId));
      setWeekData(getWeekForDate(selectedDate, selectedMonthId));
    }
  }, [selectedDate, selectedMonthId]);

  const navigateDay = (direction: number) => {
    const currentIndex = availableDates.indexOf(selectedDate);
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < availableDates.length) {
      setSelectedDate(availableDates[newIndex]);
    }
  };

  if (!dayData || !monthData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const currentIndex = availableDates.indexOf(selectedDate);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < availableDates.length - 1;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <MonthSelector
            months={availableMonths}
            selectedMonthId={selectedMonthId}
            onMonthChange={setSelectedMonthId}
          />
          <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-medium">
            {monthData.class}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Daily Schedule</h1>
          <RecentUpdates />
        </div>
      </div>

      {/* Date Navigator */}
      <div className="flex items-center justify-between mb-6 bg-white rounded-xl p-2 sm:p-3 border border-gray-200 shadow-sm gap-1 sm:gap-2">
        <button
          onClick={() => navigateDay(-1)}
          disabled={!hasPrev}
          className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
            hasPrev
              ? 'hover:bg-gray-100 text-gray-700'
              : 'text-gray-300 cursor-not-allowed'
          }`}
        >
          <span className="hidden sm:inline">← Prev</span>
          <span className="sm:hidden">←</span>
        </button>

        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-orange-50 border border-orange-200 rounded-lg px-2 sm:px-4 py-2 font-medium text-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm sm:text-base min-w-0 flex-1 max-w-[180px] sm:max-w-none"
        >
          {availableDates.map((date) => (
            <option key={date} value={date}>
              {formatDate(date)}
            </option>
          ))}
        </select>

        <button
          onClick={() => navigateDay(1)}
          disabled={!hasNext}
          className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
            hasNext
              ? 'hover:bg-gray-100 text-gray-700'
              : 'text-gray-300 cursor-not-allowed'
          }`}
        >
          <span className="hidden sm:inline">Next →</span>
          <span className="sm:hidden">→</span>
        </button>
      </div>

      {/* Day Schedule */}
      <DaySchedule day={dayData} showHeader={false} />

      {/* Share Buttons */}
      <div className="mt-4 flex justify-end">
        <ShareButton day={dayData} />
      </div>

      {/* Dictation Words */}
      {weekData && weekData.dictationWords.length > 0 && (
        <div className="mt-6">
          <DictationWords words={weekData.dictationWords} />
        </div>
      )}

      {/* Important Dates */}
      {importantDates.length > 0 && (
        <div className="mt-6">
          <ImportantDates dates={importantDates} title="Upcoming Important Dates" />
        </div>
      )}

      {/* Quick Links */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <Link
          href={`/week?month=${selectedMonthId}`}
          className="bg-white rounded-xl p-4 border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all"
        >
          <div className="text-2xl mb-2">📆</div>
          <div className="font-semibold text-gray-800">View Full Week</div>
          <div className="text-sm text-gray-500">See all activities for the week</div>
        </Link>
        <Link
          href={`/rhymes?month=${selectedMonthId}`}
          className="bg-white rounded-xl p-4 border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all"
        >
          <div className="text-2xl mb-2">🎵</div>
          <div className="font-semibold text-gray-800">Rhymes & Shloka</div>
          <div className="text-sm text-gray-500">This month&apos;s songs and verses</div>
        </Link>
      </div>
    </div>
  );
}
