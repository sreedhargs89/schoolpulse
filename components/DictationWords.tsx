'use client';

interface DictationWordsProps {
  words: string[];
}

export default function DictationWords({ words }: DictationWordsProps) {
  if (!words || words.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-4">
      <h3 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
        <span>📝</span> Dictation Words for This Week
      </h3>
      <div className="flex flex-wrap gap-2">
        {words.map((word, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-white rounded-full text-sm font-medium text-indigo-700 border border-indigo-200 shadow-sm"
          >
            {word}
          </span>
        ))}
      </div>
      <p className="text-xs text-indigo-600 mt-3">
        Practice these words at home for dictation
      </p>
    </div>
  );
}
