'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getMonthData, DaySchedule as DayScheduleType, getAvailableMonths, getCurrentMonthId, MonthInfo } from '@/lib/data';
import MonthSelector from '@/components/MonthSelector';

function MonthViewContent() {
  const searchParams = useSearchParams();
  const urlMonth = searchParams.get('month');

  const [selectedMonthId, setSelectedMonthId] = useState<string>('');
  const [monthInfo, setMonthInfo] = useState<{ month: string; year: number } | null>(null);
  const [daysMap, setDaysMap] = useState<Map<string, DayScheduleType>>(new Map());
  const [availableMonths, setAvailableMonths] = useState<MonthInfo[]>([]);

  // Initialize months
  useEffect(() => {
    const months = getAvailableMonths();
    setAvailableMonths(months);
    const defaultMonth = urlMonth || getCurrentMonthId();
    setSelectedMonthId(defaultMonth);
  }, []);

  // Handle URL month parameter changes
  useEffect(() => {
    if (urlMonth && availableMonths.length > 0) {
      setSelectedMonthId(urlMonth);
    }
  }, [urlMonth, availableMonths]);

  // Update data when month changes
  useEffect(() => {
    if (!selectedMonthId) return;

    const data = getMonthData(selectedMonthId);
    setMonthInfo({ month: data.month, year: data.year });

    const map = new Map<string, DayScheduleType>();
    for (const week of data.weeks) {
      for (const day of week.days) {
        map.set(day.date, day);
      }
    }
    setDaysMap(map);
  }, [selectedMonthId]);

  if (!monthInfo) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Generate calendar grid for January 2026
  const year = monthInfo.year;
  const monthIndex = new Date(`${monthInfo.month} 1, ${year}`).getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday
  const totalDays = lastDay.getDate();

  const weeks: (number | null)[][] = [];
  let currentWeek: (number | null)[] = [];

  // Fill empty slots before the 1st
  for (let i = 0; i < startDayOfWeek; i++) {
    currentWeek.push(null);
  }

  // Fill in the days
  for (let day = 1; day <= totalDays; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Fill empty slots after the last day
  while (currentWeek.length > 0 && currentWeek.length < 7) {
    currentWeek.push(null);
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDateString = (day: number) => {
    return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <MonthSelector
            months={availableMonths}
            selectedMonthId={selectedMonthId}
            onMonthChange={setSelectedMonthId}
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          {monthInfo.month} {monthInfo.year}
        </h1>
        <p className="text-sm text-gray-500">Click on a day to see the schedule</p>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {dayNames.map((name) => (
            <div
              key={name}
              className="py-3 text-center text-sm font-semibold text-gray-600"
            >
              {name}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 border-b border-gray-100 last:border-b-0">
            {week.map((day, dayIndex) => {
              if (day === null) {
                return <div key={dayIndex} className="h-24 bg-gray-50" />;
              }

              const dateStr = getDateString(day);
              const dayData = daysMap.get(dateStr);
              const isHoliday = dayData?.isHoliday;
              const hasSchedule = dayData && !isHoliday && dayData.schedule.length > 0;
              const isWeekend = dayIndex === 0 || dayIndex === 6;
              const isToday = dateStr === new Date().toISOString().split('T')[0];

              return (
                <Link
                  href={`/?date=${dateStr}`}
                  key={dayIndex}
                  className={`h-24 p-2 border-r border-gray-100 last:border-r-0 hover:bg-orange-50 transition-colors ${isWeekend && !hasSchedule ? 'bg-gray-50' : ''
                    } ${isToday ? 'ring-2 ring-orange-400 ring-inset' : ''}`}
                >
                  <div className="flex flex-col h-full">
                    <span
                      className={`text-sm font-medium ${isHoliday
                        ? 'text-orange-600'
                        : isWeekend
                          ? 'text-gray-400'
                          : 'text-gray-700'
                        }`}
                    >
                      {day}
                    </span>
                    {isHoliday && (
                      <span className="text-xs text-orange-600 mt-1 line-clamp-2">
                        {dayData.holidayName}
                      </span>
                    )}
                    {hasSchedule && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-400" title="Literacy"></span>
                        <span className="w-2 h-2 rounded-full bg-green-400" title="Numeracy"></span>
                        <span className="w-2 h-2 rounded-full bg-purple-400" title="Languages"></span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-400"></span>
          <span>Literacy</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-400"></span>
          <span>Numeracy</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-purple-400"></span>
          <span>Languages</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 ring-2 ring-orange-400 rounded"></span>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}

export default function MonthPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    }>
      <MonthViewContent />
    </Suspense>
  );
}
