'use client';

interface WeekendRevisionContent {
    weekCovered: string;
    literacy: string[];
    numeracy: string[];
    generalAwareness: string[];
}

interface WeekendRevisionProps {
    content: WeekendRevisionContent;
    date: string;
}

export default function WeekendRevision({ content, date }: WeekendRevisionProps) {
    return (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
            {/* Header */}
            <div className="mb-6 text-center">
                <div className="text-4xl mb-2">📚</div>
                <h2 className="text-2xl font-bold text-purple-800 mb-1">Weekend Revision</h2>
                <p className="text-sm text-purple-600">Week: {content.weekCovered}</p>
            </div>

            {/* Revision Sections */}
            <div className="space-y-6">
                {/* Literacy */}
                {content.literacy.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <h3 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                            <span className="text-xl">📖</span>
                            <span>Literacy</span>
                        </h3>
                        <ul className="space-y-2">
                            {content.literacy.map((topic, index) => (
                                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>{topic}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Numeracy */}
                {content.numeracy.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                        <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                            <span className="text-xl">🔢</span>
                            <span>Numeracy</span>
                        </h3>
                        <ul className="space-y-2">
                            {content.numeracy.map((topic, index) => (
                                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                    <span className="text-green-500 mt-1">•</span>
                                    <span>{topic}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* General Awareness */}
                {content.generalAwareness.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                        <h3 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                            <span className="text-xl">🌍</span>
                            <span>General Awareness</span>
                        </h3>
                        <ul className="space-y-2">
                            {content.generalAwareness.map((topic, index) => (
                                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                    <span className="text-orange-500 mt-1">•</span>
                                    <span>{topic}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Footer Message */}
            <div className="mt-6 text-center">
                <p className="text-sm text-purple-600 bg-purple-100 rounded-lg py-2 px-4 inline-block">
                    💡 Practice these topics at home for better understanding!
                </p>
            </div>
        </div>
    );
}
