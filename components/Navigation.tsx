'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Today', icon: '📖' },
    { href: '/week', label: 'Week', icon: '7️⃣' },
    { href: '/month', label: 'Month', icon: '📆' },
    { href: '/dates', label: 'Events', icon: '🔔' },
    { href: '/rhymes', label: 'Rhymes', icon: '🎵' },
    { href: '/admin', label: 'Admin', icon: '⚙️' },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 border-b border-purple-800/30 sticky top-0 z-40 shadow-lg">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">💓</span>
            <span className="font-bold text-white hidden sm:inline drop-shadow-md">SchoolPulse</span>
          </Link>
          <div className="flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                      ? 'bg-white/25 text-white shadow-md backdrop-blur-sm ring-2 ring-white/30'
                      : 'text-white/90 hover:bg-white/15 hover:text-white'
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
