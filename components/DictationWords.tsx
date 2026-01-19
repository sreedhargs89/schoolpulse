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
        {Object.values(
          words.reduce((groups, word) => {
            let key = 'mixed';

            // patterns
            if (/[a-z][^aeiou]e$/.test(word)) key = 'split_digraph'; // e.g. cube, tube, cone
            else if (/ee|ea/.test(word)) key = 'long_e';
            else if (/ai|ay/.test(word)) key = 'long_a';
            else if (/oa|ow/.test(word)) key = 'long_o'; // e.g. boat, bow
            else if (/ue|ew/.test(word)) key = 'long_u'; // e.g. glue
            else if (/oo/.test(word)) key = 'oo';
            else if (/ou/.test(word)) key = 'ou';
            else if (/oi|oy/.test(word)) key = 'oi';
            else if (/ar|er|ir|or|ur/.test(word)) key = 'r_controlled';

            if (!groups[key]) groups[key] = [];
            groups[key].push(word);
            return groups;
          }, {} as Record<string, string[]>)
        ).map((groupWords, groupIndex, allGroups) => (
          <div key={groupIndex}>
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
            {/* Show separator line if not the last group */}
            {groupIndex < allGroups.length - 1 && (
              <div className="ml-1 my-3 w-12 h-1 bg-indigo-200/50 rounded-full" />
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-indigo-600 mt-3">
        Practice these words at home for dictation
      </p>
    </div>
  );
}
