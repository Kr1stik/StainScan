'use client';

import React from 'react';
import { User, UserCircle } from 'lucide-react';
import Sidebar from '@/src/components/Sidebar';

export default function ProfilePage() {
  // Static user information
  const fullName = 'Admin';
  const email = 'admin@stainscan.com';

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 ml-64">
        <main className="max-w-4xl mx-auto p-8 lg:p-12 space-y-10">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Profile Details</h1>
            <p className="text-gray-500 dark:text-gray-400">View your personal account information.</p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Personal Information Card */}
            <section className="bg-white dark:bg-[#1a1a1a] rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
              <div className="p-8 border-b border-gray-50 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl text-cyan-600 dark:text-cyan-400">
                    <User size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Profile Header */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group">
                    <UserCircle className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">System Administrator</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-50 dark:border-gray-800">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                    <p className="text-gray-900 dark:text-white font-medium mt-1">{fullName}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                    <p className="text-gray-900 dark:text-white font-medium mt-1">{email}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
