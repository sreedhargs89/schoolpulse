'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Today', icon: '📖' },
    { href: '/week', label: 'Week', icon: '3️⃣0️⃣' },
    { href: '/month', label: 'Month', icon: '📆' },
    { href: '/dates', label: 'Events', icon: '🔔' },
    { href: '/rhymes', label: 'Rhymes', icon: '🎵' },
    { href: '/admin', label: 'Admin', icon: '⚙️' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">💓</span>
            <span className="font-bold text-orange-600 hidden sm:inline">SchoolPulse</span>
          </Link>
          <div className="flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <span className="sm:hidden">{link.icon}</span>
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
