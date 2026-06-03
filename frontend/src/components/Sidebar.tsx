'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Users,
  Archive,
  History,
  Terminal,
  Settings,
  Menu,
  Key
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'User Management', href: '/users', icon: Users },
    { name: 'Archived Accounts', href: '/dashboard/users/archive', icon: Archive },
    { name: 'Password Reset', href: '/password-reset-requests', icon: Key },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Activity History', href: '/history', icon: History },
    { name: 'System Logs', href: '/logs', icon: Terminal },
  ];

  const settingsLink = { name: 'Settings', href: '/settings', icon: Settings };

  return (
    <aside className={`fixed left-0 top-0 h-full bg-white dark:bg-[#111] border-r border-gray-100 dark:border-gray-800 flex flex-col z-30 shadow-sm transition-all duration-300 ease-in-out ${isCollapsed ? 'w-[72px]' : 'w-64'}`}>
      {/* Top Header (Conditional Hamburger/Logo Toggle) */}
      <div 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`flex items-center h-16 px-4 mt-2 mb-4 cursor-pointer group transition-all duration-300 ${isCollapsed ? 'justify-center' : 'px-6'}`}
        title={isCollapsed ? "Expand menu" : "Collapse menu"}
      >
        {isCollapsed ? (
          <div className="p-3 text-gray-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:bg-gray-50 dark:group-hover:bg-gray-800 rounded-full transition-all animate-in fade-in duration-300">
            <Menu size={22} />
          </div>
        ) : (
          <div className="flex items-center justify-between w-full animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="flex items-center">
              <div className="bg-cyan-50 dark:bg-cyan-900/20 p-1 rounded-lg border border-cyan-100 dark:border-cyan-800 mr-3 shadow-sm">
                <img src="/logo.png" alt="StainScan" className="h-6 w-6 object-contain" />
              </div>
              <span className="text-lg font-black text-gray-900 dark:text-white tracking-tight">StainScan</span>
            </div>
            <div className="text-gray-400 group-hover:text-cyan-500 transition-colors">
              <Menu size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Links (Gemini Hover Effect) */}
      <nav className="flex-1 px-3 space-y-1">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              title={isCollapsed ? link.name : ""}
              className={`
                flex items-center h-12 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer
                ${isCollapsed ? 'px-3 justify-start' : 'px-4'}
                ${isActive 
                  ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }
              `}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
              <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100 pl-4'}`}>
                {link.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="px-3 pb-4 border-t border-gray-50 dark:border-gray-800 pt-4">
        <Link
          href={settingsLink.href}
          title={isCollapsed ? settingsLink.name : ""}
          className={`
            flex items-center h-12 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer
            ${isCollapsed ? 'px-3 justify-start' : 'px-4'}
            ${pathname === settingsLink.href
              ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30' 
              : 'text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }
          `}
        >
          <settingsLink.icon size={22} strokeWidth={pathname === settingsLink.href ? 2.5 : 2} className="shrink-0" />
          <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100 pl-4'}`}>
            {settingsLink.name}
          </span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
