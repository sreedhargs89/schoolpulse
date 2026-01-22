'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function VasantPanchamiPopup() {
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        // 1. Check expiration: Jan 23, 2026 12:00 PM
        const now = new Date();
        const expirationDate = new Date('2026-01-23T12:00:00');

        if (now > expirationDate) return;

        // 2. Check if user has already seen the popup in this session
        // Using sessionStorage so it shows again if they close and reopen the app,
        // but stays dismissed if they just refresh the page.
        const hasSeen = sessionStorage.getItem('seen_vasant_panchami_2026');

        if (!hasSeen) {
            setShowPopup(true);
        }
    }, []);

    const handleDismiss = () => {
        setShowPopup(false);
        sessionStorage.setItem('seen_vasant_panchami_2026', 'true');
    };

    if (!showPopup) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-300 border-2 border-yellow-400">
                {/* Hero Image */}
                <div className="relative w-full h-48 bg-yellow-50">
                    <Image
                        src="/images/vasant-panchami.png"
                        alt="Vasant Panchami Celebration"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-4">
                        <h3 className="text-yellow-900 font-bold text-xl leading-tight">Vasant Panchami ✨</h3>
                        <p className="text-yellow-700 text-xs font-medium uppercase tracking-wider mt-1">Special Dress Code</p>
                    </div>
                    <p className="text-gray-700 text-base leading-relaxed mb-6 font-medium">
                        Please note that on the occasion of <span className="text-yellow-600 font-bold">Vasant Panchami</span> (23rd Jan 2026), all children need to come dressed in any <span className="bg-yellow-100 px-1 rounded text-yellow-800 font-bold">yellow attire</span>.
                    </p>

                    {/* Educational Link */}
                    <div className="mb-6 bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-sm text-yellow-800">
                        <span className="mr-1">Did you know what Vasant Panchami is?</span>
                        <a
                            href="https://www.artofliving.org/in-en/culture/reads/vasant-panchami"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold underline text-yellow-900 hover:text-yellow-700 decoration-yellow-500 underline-offset-2"
                        >
                            Click here to know more
                        </a>
                        <span className="ml-1">so you can explain it to your kid.</span>
                    </div>

                    {/* Actions */}
                    <button
                        onClick={handleDismiss}
                        className="w-full px-4 py-3 bg-yellow-400 text-yellow-900 font-bold rounded-xl hover:bg-yellow-500 transition-colors shadow-md shadow-yellow-200"
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
}
