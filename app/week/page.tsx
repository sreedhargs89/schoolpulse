'use client';

import { useState, useEffect } from 'react';
import DaySchedule from '@/components/DaySchedule';
import DictationWords from '@/components/DictationWords';
import { getMonthData, WeekData, formatShortDate } from '@/lib/data';

export default function WeekPage() {
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const [monthInfo, setMonthInfo] = useState<{ month: string; year: number } | null>(null);

  useEffect(() => {
    const data = getMonthData();
    setWeeks(data.weeks);
    setMonthInfo({ month: data.month, year: data.year });

    // Find current week based on today's date
    const today = new Date().toISOString().split('T')[0];
    const currentWeekIndex = data.weeks.findIndex((week) => {
      return week.days.some((day) => day.date === today);
    });
    if (currentWeekIndex >= 0) {
      setSelectedWeekIndex(currentWeekIndex);
    }
  }, []);

  if (weeks.length === 0 || !monthInfo) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const selectedWeek = weeks[selectedWeekIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-1">
          {monthInfo.month} {monthInfo.year}
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Week View</h1>
      </div>

      {/* Week Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {weeks.map((week, index) => (
          <button
            key={week.weekStart}
            onClick={() => setSelectedWeekIndex(index)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedWeekIndex === index
                ? 'bg-orange-500 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-orange-300'
            }`}
          >
            {formatShortDate(week.weekStart)} - {formatShortDate(week.weekEnd)}
          </button>
        ))}
      </div>

      {/* Dictation Words for the Week */}
      {selectedWeek.dictationWords.length > 0 && (
        <div className="mb-6">
          <DictationWords words={selectedWeek.dictationWords} />
        </div>
      )}

      {/* Days of the Week */}
      <div className="space-y-4">
        {selectedWeek.days.map((day) => (
          <DaySchedule key={day.date} day={day} compact />
        ))}
      </div>
    </div>
  );
}
