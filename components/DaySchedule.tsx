'use client';

import { DaySchedule as DayScheduleType, getSubjectColor, formatDate } from '@/lib/data';

interface DayScheduleProps {
  day: DayScheduleType;
  showHeader?: boolean;
  compact?: boolean;
}

export default function DaySchedule({ day, showHeader = true, compact = false }: DayScheduleProps) {
  if (day.isHoliday) {
    return (
      <div className={`${compact ? 'p-3' : 'p-6'} bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200`}>
        {showHeader && (
          <h2 className="text-lg font-semibold text-orange-800 mb-2">
            {formatDate(day.date)}
          </h2>
        )}
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎉</span>
          <div>
            <p className="text-xl font-bold text-orange-700">{day.holidayName}</p>
            <p className="text-orange-600">School Holiday</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${compact ? 'p-3' : 'p-6'} bg-white rounded-xl border border-gray-200 shadow-sm`}>
      {showHeader && (
        <h2 className={`${compact ? 'text-base' : 'text-lg'} font-semibold text-gray-800 mb-4`}>
          {formatDate(day.date)}
        </h2>
      )}
      <div className="space-y-2">
        {day.schedule.map((item, index) => (
          <div
            key={index}
            className={`flex ${compact ? 'gap-2 p-2' : 'gap-4 p-3'} rounded-lg border ${getSubjectColor(item.subject)}`}
          >
            <div className={`${compact ? 'text-xs w-16' : 'text-sm w-24'} font-medium shrink-0`}>
              {item.time}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`font-semibold ${compact ? 'text-xs' : 'text-sm'} break-words`}>
                {item.subject}
              </div>
              {item.activity && (
                <div className={`${compact ? 'text-xs' : 'text-sm'} opacity-80 break-words`}>
                  {item.activity}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
