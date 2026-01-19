'use client';

import { useState, useEffect } from 'react';
import DaySchedule from '@/components/DaySchedule';
import DictationWords from '@/components/DictationWords';
import WeekendRevision from '@/components/WeekendRevision';
import { getMonthData, WeekData, formatShortDate, getToday } from '@/lib/data';

export default function WeekPage() {
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const [monthInfo, setMonthInfo] = useState<{ month: string; year: number } | null>(null);

  useEffect(() => {
    const data = getMonthData();
    setWeeks(data.weeks);
    setMonthInfo({ month: data.month, year: data.year });

    // Find current week based on today's date
    const today = getToday();
    const currentWeekIndex = data.weeks.findIndex((week) => {
      return week.days.some((day) => day.date === today);
    });
    if (currentWeekIndex >= 0) {
      setSelectedWeekIndex(currentWeekIndex);
    }
  }, []);

  // Scroll selected week into view
  useEffect(() => {
    const selectedBtn = document.getElementById(`week-btn-${selectedWeekIndex}`);
    if (selectedBtn) {
      selectedBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedWeekIndex]);

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

  // Find Saturday's revision content for this week
  const saturdayRevision = selectedWeek.days.find(
    day => day.dayOfWeek === 'Saturday' && day.isWeekendRevision && day.weekendRevisionContent
  );

  // Filter to show only holidays (not weekend revision, not Sunday, not regular weekdays)
  const specialDays = selectedWeek.days.filter(day =>
    day.isHoliday && !day.isWeekendRevision && day.dayOfWeek !== 'Sunday'
  );

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
      {/* Week Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
        {weeks.map((week, index) => (
          <button
            key={week.weekStart}
            id={`week-btn-${index}`}
            onClick={() => setSelectedWeekIndex(index)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex-shrink-0 ${selectedWeekIndex === index
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

      {/* Week Revision Summary (if available) */}
      {saturdayRevision && saturdayRevision.weekendRevisionContent && (
        <div className="mb-6">
          <WeekendRevision
            content={saturdayRevision.weekendRevisionContent}
            date={saturdayRevision.date}
          />
        </div>
      )}

      {/* Special Days (Holidays, Events) */}
      {specialDays.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">🎉 Special Days This Week</h3>
          {specialDays.map((day) => (
            <DaySchedule key={day.date} day={day} compact />
          ))}
        </div>
      )}
    </div>
  );
}
