'use client';

import { ImportantDate, formatShortDate } from '@/lib/data';

interface ImportantDatesProps {
  dates: ImportantDate[];
  title?: string;
  showAll?: boolean;
}

export default function ImportantDates({ dates, title = "Important Dates", showAll = false }: ImportantDatesProps) {
  if (!dates || dates.length === 0) return null;

  const today = new Date().toISOString().split('T')[0];

  // Filter to show only upcoming dates unless showAll is true
  const displayDates = showAll
    ? dates
    : dates.filter(d => d.date >= today).slice(0, 5);

  if (displayDates.length === 0) return null;

  const typeStyles: Record<string, { bg: string; textColor: string; border: string }> = {
    holiday: { bg: 'bg-red-500', textColor: 'text-white', border: 'border-red-200' },
    event: { bg: 'bg-blue-500', textColor: 'text-white', border: 'border-blue-200' },
    activity: { bg: 'bg-green-500', textColor: 'text-white', border: 'border-green-200' },
  };

  const isToday = (date: string) => date === today;
  const isPast = (date: string) => date < today;

  // Extract day number from date string (YYYY-MM-DD)
  const getDayNumber = (dateStr: string) => {
    return parseInt(dateStr.split('-')[2], 10);
  };

  // Get month abbreviation
  const getMonthAbbr = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span>📌</span> {title}
      </h3>
      <div className="space-y-2">
        {displayDates.map((item, index) => {
          const style = typeStyles[item.type] || typeStyles.event;
          const todayHighlight = isToday(item.date);
          const past = isPast(item.date);
          const dayNum = getDayNumber(item.date);
          const monthAbbr = getMonthAbbr(item.date);

          return (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg border ${todayHighlight ? 'ring-2 ring-orange-400 bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'
                } ${past ? 'opacity-50' : ''}`}
            >
              {/* Date Badge */}
              <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg ${style.bg} ${style.textColor} flex-shrink-0`}>
                <div className="text-xs font-semibold leading-none">{monthAbbr}</div>
                <div className="text-xl font-bold leading-none mt-0.5">{dayNum}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800">{item.event}</span>
                  {todayHighlight && (
                    <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                      TODAY
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">{item.description}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatShortDate(item.date)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {!showAll && dates.filter(d => d.date >= today).length > 5 && (
        <div className="text-xs text-gray-500 mt-3 text-center">
          <span className="bg-gray-100 px-2 py-1 rounded">
            + {dates.filter(d => d.date >= today).length - 5} more upcoming events
          </span>
          <p className="mt-1 text-gray-400">Visit Events page to see all dates</p>
        </div>
      )}
    </div>
  );
}
