'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  User, 
  Users,
  History,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'User Management', href: '/users', icon: Users },
    { name: 'Profile Management', href: '/profile', icon: User },
    { name: 'Activity History', href: '/history', icon: History },
  ];

  const settingsLink = { name: 'Settings', href: '/settings', icon: Settings };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-[#111] border-r border-gray-100 dark:border-gray-800 flex flex-col z-30 shadow-sm transition-colors duration-300">
      {/* Branding Header */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-cyan-50 dark:bg-cyan-900/20 p-1.5 rounded-xl border border-cyan-100 dark:border-cyan-800">
          <img src="/logo.png" alt="StainScan Logo" className="h-8 w-8 object-contain" />
        </div>
        <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">StainScan</span>
      </div>

      {/* Top Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 mt-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200
                ${isActive 
                  ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 shadow-sm shadow-cyan-100/30' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10'
                }
              `}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="p-4 border-t border-gray-50 dark:border-gray-800">
        <Link
          href={settingsLink.href}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200
            ${pathname === settingsLink.href
              ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 shadow-sm shadow-cyan-100/30' 
              : 'text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10'
            }
          `}
        >
          <settingsLink.icon size={20} strokeWidth={pathname === settingsLink.href ? 2.5 : 2} />
          {settingsLink.name}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
