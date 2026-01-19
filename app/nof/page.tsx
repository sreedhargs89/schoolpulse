'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useUpdates } from '@/context/UpdatesContext';

function NOFContent() {
    const { updates } = useUpdates();

    // Filter updates related to NOF/Olympiad, but exclude the self-referential promo (ID 8000)
    const nofUpdates = updates.filter(u =>
        (u.title?.toUpperCase().includes('NOF') ||
            u.title?.toUpperCase().includes('OLYMPIAD') ||
            u.message?.toUpperCase().includes('NOF') ||
            u.category?.toUpperCase().includes('NOF')) &&
        u.id !== 8000
    );

    const schedule = [
        { class: "Nursery to 2", subject: "Phonics", day: "Monday", date: "09-Feb-26" },
        { class: "1 to 5", subject: "Cyber", day: "Monday", date: "09-Feb-26" },
        { class: "1 to 10", subject: "Critical Thinking", day: "Tuesday", date: "10-Feb-26" },
        { class: "Nursery to 10", subject: "Hindi", day: "Tuesday", date: "10-Feb-26" },
        { class: "5 to 10", subject: "French", day: "Wednesday", date: "11-Feb-26" },
        { class: "1 to 10", subject: "GK", day: "Thursday", date: "12-Feb-26" },
        { class: "Nursery to 10", subject: "English", day: "Friday", date: "13-Feb-26" },
        { class: "Nursery to 10", subject: "Science", day: "Saturday", date: "14-Feb-26" },
        { class: "Nursery to 10", subject: "Math", day: "Sunday", date: "15-Feb-26" }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3">
                    NOF Champions League
                </h1>
                <p className="text-gray-500 font-medium text-lg">
                    National Olympiad Foundation (2025-26)
                </p>
            </div>

            {/* Important Updates Section */}
            {nofUpdates.length > 0 && (
                <div className="mb-10">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="text-2xl">📢</span> Latest Announcements
                    </h2>
                    <div className="grid gap-4">
                        {nofUpdates.map((update) => (
                            <div key={update.id} className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -mr-10 -mt-10 opacity-50 blur-xl"></div>
                                <div className="relative">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-800 text-lg">{update.title}</h3>
                                        {update.createdAt && <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{update.createdAt}</span>}
                                    </div>
                                    <p className="text-gray-600 mb-3 leading-relaxed">{update.message}</p>
                                    {update.link && (
                                        update.link.startsWith('/') ? (
                                            <Link
                                                href={update.link}
                                                className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:underline bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                {update.linkText || "View Details"} ↗
                                            </Link>
                                        ) : (
                                            <a
                                                href={update.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:underline bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                {update.linkText || "View Details"} ↗
                                            </a>
                                        )
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Schedule Section */}
            <div className="bg-white rounded-2xl shadow-xl shadow-blue-50 overflow-hidden border border-blue-100">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    <h2 className="text-2xl font-bold relative z-10 text-center">🏆 Exam Schedule</h2>
                    <p className="text-blue-100 text-center text-sm mt-1 mb-2 font-medium">Exam Window: 09:00 AM to 08:00 PM (IST)</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Day</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Eligible Classes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {schedule.map((item, idx) => (
                                <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-800">{item.date}</span>
                                            <span className="text-xs text-blue-500 font-medium">{item.day}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 group-hover:bg-indigo-100">
                                            {item.subject}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600 font-medium">{item.class}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-8 text-center">
                <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium">
                    ← Back to Dashboard
                </Link>
            </div>
        </div>
    );
}

export default function NOFPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center text-gray-400">Loading NOF Schedule...</div>}>
            <NOFContent />
        </Suspense>
    );
}
