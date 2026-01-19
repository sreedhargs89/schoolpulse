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
      <div className="space-y-4">
        {Object.entries(
          words.reduce((groups, word) => {
            // Simple heuristic to group by ending sound (last 2-3 chars)
            // Prioritize longer matches for specific families like 'une', 'ube', 'ute'
            // Fallback to 'Mixed'
            let key = 'Mixed';
            if (word.endsWith('ube')) key = '-ube Words';
            else if (word.endsWith('ute')) key = '-ute Words';
            else if (word.endsWith('use')) key = '-use Words';
            else if (word.endsWith('une')) key = '-une Words';
            else if (word.endsWith('ule')) key = '-ule Words';
            else if (word.endsWith('ure')) key = '-ure Words';
            else if (word.endsWith('ue')) key = '-ue Words';
            else if (word.endsWith('oat')) key = '-oat Words';
            else if (word.endsWith('ose')) key = '-ose Words';
            else if (word.endsWith('one')) key = '-one Words';
            else if (word.endsWith('oal')) key = '-oal Words';

            if (!groups[key]) groups[key] = [];
            groups[key].push(word);
            return groups;
          }, {} as Record<string, string[]>)
        ).map(([groupName, groupWords]) => (
          <div key={groupName}>
            <h4 className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold mb-1.5 ml-1">
              {groupName}
            </h4>
            <div className="flex flex-wrap gap-2">
              {groupWords.map((word, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white rounded-full text-sm font-medium text-indigo-700 border border-indigo-200 shadow-sm"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-indigo-600 mt-3">
        Practice these words at home for dictation
      </p>
    </div>
  );
}
