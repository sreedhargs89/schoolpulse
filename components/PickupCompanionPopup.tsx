'use client';

import { useState, useEffect } from 'react';
import { getToday, getDaySchedule } from '@/lib/data';

// A collection of "loud words" / conversation starters
const GREETINGS = [
    "How was your lunch today? 🥪",
    "Did you make anyone smile today? 😊",
    "What was the most fun thing you did? 🎉",
    "Who did you play with at recess? 🏃‍♂️",
    "Did you learn something new today? 🧠",
    "What made you laugh today? 😂",
    "Was anyone kind to you today? 💖",
    "Did you help anyone today? 🤝",
    "What was the hardest thing you did? 💪",
    "Rate your day from 1 to 10! 🌟"
];

export default function PickupCompanionPopup() {
    const [showPopup, setShowPopup] = useState(false);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const checkTime = () => {
            const now = new Date();
            const hour = now.getHours();
            const minutes = now.getMinutes();
            const totalMinutes = hour * 60 + minutes;

            // 1. Don't show on Weekends (0 = Sunday, 6 = Saturday)
            const dayOfWeek = now.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) return;

            // 2. Don't show on Holidays
            const todayStr = getToday();
            const daySchedule = getDaySchedule(todayStr);
            if (daySchedule?.isHoliday) return;

            // Time window: 12:30 PM to 2:00 PM
            const START_TIME = 12 * 60 + 30; // 12:30 PM
            const END_TIME = 14 * 60; // 2:00 PM

            if (totalMinutes >= START_TIME && totalMinutes <= END_TIME) {
                // todayStr is already defined above
                const hasSeen = sessionStorage.getItem(`seen_pickup_popup_${todayStr}`);

                if (!hasSeen) {
                    // Pick a random greeting
                    const randomGreeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
                    setGreeting(randomGreeting);
                    setShowPopup(true);
                }
            }
        };

        checkTime();
        // Check every minute just in case the app is left open
        const interval = setInterval(checkTime, 60000);
        return () => clearInterval(interval);

    }, []);

    const handleDismiss = () => {
        setShowPopup(false);
        const todayStr = getToday();
        sessionStorage.setItem(`seen_pickup_popup_${todayStr}`, 'true');
    };

    if (!showPopup) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-500 border-t-4 border-green-500">
                <div className="p-6 text-center">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-3xl animate-bounce">
                        👋
                    </div>
                    <h3 className="text-xl font-black text-gray-800 mb-2">Welcome Back!</h3>
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-6">Ask your Super Kid:</p>

                    <div className="bg-green-50 p-4 rounded-xl border border-green-100 mb-6">
                        <p className="text-lg font-bold text-green-800 leading-snug">
                            "{greeting}"
                        </p>
                    </div>

                    <button
                        onClick={handleDismiss}
                        className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200"
                    >
                        Let's Talk! 🚀
                    </button>
                </div>
            </div>
        </div>
    );
}
