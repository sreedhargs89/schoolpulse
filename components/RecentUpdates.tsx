'use client';

import { useState, useEffect } from 'react';
import updatesData from '@/data/updates.json';

interface Update {
  id: number;
  date: string;
  title: string;
  message: string;
  type: 'info' | 'notice' | 'urgent';
  expiresAt: string;
  link?: string;
  linkText?: string;
}

export default function RecentUpdates() {
  const [isOpen, setIsOpen] = useState(false);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    // Filter out expired updates
    const today = new Date().toISOString().split('T')[0];
    const activeUpdates = (updatesData.updates as Update[]).filter(
      (u) => u.expiresAt >= today
    );
    setUpdates(activeUpdates);

    // Check if there are updates user hasn't seen
    const lastSeen = localStorage.getItem('updates_last_seen');
    if (activeUpdates.length > 0) {
      const latestUpdate = activeUpdates[0];
      if (!lastSeen || lastSeen < latestUpdate.date) {
        setHasNew(true);
      }
    }
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setHasNew(false);
    localStorage.setItem('updates_last_seen', new Date().toISOString().split('T')[0]);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'notice':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <>
      {/* Updates Button */}
      <button
        onClick={handleOpen}
        className="relative flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-all text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="hidden sm:inline">Updates</span>
        {updates.length > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full px-1">
            {updates.length}
          </span>
        )}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Content */}
          <div className="relative bg-white w-full sm:w-96 max-h-[70vh] rounded-t-2xl sm:rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-orange-50">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Recent Updates
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Updates List */}
            <div className="p-4 overflow-y-auto max-h-[50vh]">
              {updates.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No updates at the moment</p>
              ) : (
                <div className="space-y-3">
                  {updates.map((update) => (
                    <div
                      key={update.id}
                      className={`p-3 rounded-lg border ${getTypeStyle(update.type)}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium">{update.title}</h3>
                        <span className="text-xs opacity-70 whitespace-nowrap">
                          {formatDate(update.date)}
                        </span>
                      </div>
                      <p className="text-sm mt-1 opacity-90 whitespace-pre-line">{update.message}</p>
                      {update.link && (
                        <a
                          href={update.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 px-3 py-1.5 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          {update.linkText || 'Learn More'}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
