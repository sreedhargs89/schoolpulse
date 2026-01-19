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
      <div className="flex flex-col gap-3">
        {(() => {
          // Broad categorisation for specific visual separation request
          const oWords = words.filter(w => /oa|ow|oe|o[^aeiou]e$|o.e$/.test(w));
          const uWords = words.filter(w => /ue|ew|ui|oo|u[^aeiou]e$|u.e$/.test(w));
          const otherWords = words.filter(w => !oWords.includes(w) && !uWords.includes(w));

          const renderList = (list: string[]) => (
            <div className="flex flex-wrap gap-2">
              {list.map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  className="px-3 py-1 bg-white rounded-full text-sm font-medium text-indigo-700 border border-indigo-200 shadow-sm"
                >
                  {word}
                </span>
              ))}
            </div>
          );

          return (
            <>
              {oWords.length > 0 && renderList(oWords)}

              {oWords.length > 0 && uWords.length > 0 && (
                <div className="h-px bg-indigo-200/60 w-full" />
              )}

              {uWords.length > 0 && renderList(uWords)}

              {(oWords.length > 0 || uWords.length > 0) && otherWords.length > 0 && (
                <div className="h-px bg-indigo-200/60 w-full" />
              )}

              {otherWords.length > 0 && renderList(otherWords)}
            </>
          );
        })()}
      </div>
      <p className="text-xs text-indigo-600 mt-3">
        Practice these words at home for dictation
      </p>
    </div>
  );
}
