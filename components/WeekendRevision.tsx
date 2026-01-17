'use client';

interface WeekendRevisionContent {
    weekCovered: string;
    subjects: {
        [key: string]: string[];
    };
}

interface WeekendRevisionProps {
    content: WeekendRevisionContent;
    date: string;
}

// Subject color mapping
const subjectColors: { [key: string]: { border: string; text: string; bullet: string } } = {
    'Literacy': { border: 'border-blue-200', text: 'text-blue-700', bullet: 'text-blue-500' },
    'Numeracy': { border: 'border-green-200', text: 'text-green-700', bullet: 'text-green-500' },
    'General Awareness': { border: 'border-orange-200', text: 'text-orange-700', bullet: 'text-orange-500' },
    'Kannada': { border: 'border-red-200', text: 'text-red-700', bullet: 'text-red-500' },
    'Hindi': { border: 'border-pink-200', text: 'text-pink-700', bullet: 'text-pink-500' },
    'Art': { border: 'border-purple-200', text: 'text-purple-700', bullet: 'text-purple-500' },
    'Story': { border: 'border-indigo-200', text: 'text-indigo-700', bullet: 'text-indigo-500' },
    'Socio Emotional Skills': { border: 'border-teal-200', text: 'text-teal-700', bullet: 'text-teal-500' },
};

// Subject icon mapping
const subjectIcons: { [key: string]: string } = {
    'Literacy': '📖',
    'Numeracy': '🔢',
    'General Awareness': '🌍',
    'Kannada': '🔤',
    'Hindi': '✍️',
    'Art': '🎨',
    'Story': '📚',
    'Socio Emotional Skills': '💭',
};

export default function WeekendRevision({ content, date }: WeekendRevisionProps) {
    // Get default colors for subjects not in the mapping
    const getSubjectStyle = (subject: string) => {
        return subjectColors[subject] || { border: 'border-gray-200', text: 'text-gray-700', bullet: 'text-gray-500' };
    };

    const getSubjectIcon = (subject: string) => {
        return subjectIcons[subject] || '📝';
    };

    return (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
            {/* Header */}
            <div className="mb-6 text-center">
                <div className="text-4xl mb-2">📚</div>
                <h2 className="text-2xl font-bold text-purple-800 mb-1">Weekly Summary</h2>
                <p className="text-sm text-purple-600">Week: {content.weekCovered}</p>
            </div>

            {/* Revision Sections - Dynamic */}
            <div className="space-y-6">
                {Object.entries(content.subjects).map(([subject, topics]) => {
                    if (topics.length === 0) return null;

                    const style = getSubjectStyle(subject);
                    const icon = getSubjectIcon(subject);

                    return (
                        <div key={subject} className={`bg-white rounded-lg p-4 border ${style.border}`}>
                            <h3 className={`font-semibold ${style.text} mb-3 flex items-center gap-2`}>
                                <span className="text-xl">{icon}</span>
                                <span>{subject}</span>
                            </h3>
                            <ul className="space-y-2">
                                {topics.map((topic, index) => (
                                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                        <span className={`${style.bullet} mt-1`}>•</span>
                                        <span>{topic}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
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
