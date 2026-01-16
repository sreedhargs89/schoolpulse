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

  const typeStyles: Record<string, { bg: string; icon: string; border: string }> = {
    holiday: { bg: 'bg-red-50', icon: '🎉', border: 'border-red-200' },
    event: { bg: 'bg-blue-50', icon: '📅', border: 'border-blue-200' },
    activity: { bg: 'bg-green-50', icon: '🎨', border: 'border-green-200' },
  };

  const isToday = (date: string) => date === today;
  const isPast = (date: string) => date < today;

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

          return (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg border ${style.bg} ${style.border} ${todayHighlight ? 'ring-2 ring-orange-400' : ''
                } ${past ? 'opacity-50' : ''}`}
            >
              <div className="text-xl">{style.icon}</div>
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
