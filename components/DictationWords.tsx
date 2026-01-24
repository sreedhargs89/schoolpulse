'use client';

interface DictationWordsProps {
  words: string[];
  sentences?: string[];
}

export default function DictationWords({ words, sentences }: DictationWordsProps) {
  if ((!words || words.length === 0) && (!sentences || sentences.length === 0)) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-4">
      <h3 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
        <span>📝</span> Dictation Practice
      </h3>

      {words && words.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-indigo-600 mb-2 uppercase tracking-wide">Words</h4>
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
        </div>
      )}

      {sentences && sentences.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-indigo-600 mb-2 uppercase tracking-wide">Practice Sentences</h4>
          <ul className="space-y-2">
            {sentences.map((sentence, idx) => (
              <li key={idx} className="flex gap-2 items-start text-indigo-900 bg-white/60 p-2 rounded-lg text-sm">
                <span className="text-indigo-400 mt-0.5">•</span>
                <span>
                  {sentence.split(' ').map((word, wIdx) => {
                    // Highlight dictation words in the sentence (simple case-insensitive match)
                    const cleanWord = word.replace(/[^a-zA-Z]/g, '');
                    const isDictationWord = words?.some(dw => dw.toLowerCase() === cleanWord.toLowerCase());
                    return isDictationWord ? (
                      <strong key={wIdx} className="font-semibold text-indigo-700">{word} </strong>
                    ) : (
                      <span key={wIdx}>{word} </span>
                    );
                  })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-indigo-600 mt-3">
        Practice these words and sentences at home for dictation
      </p>
    </div>
  );
}
