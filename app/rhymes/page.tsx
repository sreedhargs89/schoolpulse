'use client';

import { useState, useEffect } from 'react';
import { getMonthData, Rhyme } from '@/lib/data';

export default function RhymesPage() {
  const [rhymes, setRhymes] = useState<Rhyme[]>([]);
  const [shloka, setShloka] = useState<{
    sanskrit: string;
    transliteration: string;
    meaning: string;
  } | null>(null);
  const [story, setStory] = useState<{ title: string; moral: string } | null>(null);
  const [monthInfo, setMonthInfo] = useState<{ month: string; year: number } | null>(null);

  useEffect(() => {
    const data = getMonthData();
    setRhymes(data.rhymes);
    setShloka(data.shloka);
    setStory(data.story);
    setMonthInfo({ month: data.month, year: data.year });
  }, []);

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-1">
          {monthInfo.month} {monthInfo.year}
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Rhymes & Shloka</h1>
        <p className="text-sm text-gray-500">Practice these at home with your child</p>
      </div>

      {/* Shloka */}
      {shloka && (
        <div className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
          <h2 className="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2">
            <span>🙏</span> Shloka of the Month
          </h2>
          <div className="space-y-3">
            <p className="text-lg font-medium text-amber-900 leading-relaxed">
              {shloka.sanskrit}
            </p>
            <p className="text-amber-700 italic">
              {shloka.transliteration}
            </p>
            <div className="pt-2 border-t border-amber-200">
              <p className="text-sm font-medium text-amber-800">Meaning:</p>
              <p className="text-amber-700">{shloka.meaning}</p>
            </div>
          </div>
        </div>
      )}

      {/* Rhymes */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>🎵</span> Rhymes for the Month
        </h2>
        <div className="space-y-4">
          {rhymes.map((rhyme, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-200 transition-colors"
            >
              <h3 className="font-semibold text-blue-800 mb-3">{rhyme.title}</h3>
              <pre className="text-gray-700 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {rhyme.content}
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* Story */}
      {story && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
          <h2 className="text-lg font-semibold text-indigo-800 mb-3 flex items-center gap-2">
            <span>📖</span> Story of the Month
          </h2>
          <p className="text-xl font-medium text-indigo-900 mb-2">{story.title}</p>
          <div className="bg-white/50 rounded-lg p-3 mt-3">
            <p className="text-sm font-medium text-indigo-700">Moral:</p>
            <p className="text-indigo-800">{story.moral}</p>
          </div>
        </div>
      )}
    </div>
  );
}
