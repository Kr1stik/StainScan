'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { User, Mail, Save, Pencil, X, UserCircle } from 'lucide-react';
import Sidebar from '@/src/components/Sidebar';

export default function ProfilePage() {
  // Edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('Admin');
  const [email, setEmail] = useState('admin@stainscan.com');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Successfully updated profile information!');
    setIsEditingProfile(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 ml-64">
        <main className="max-w-4xl mx-auto p-8 lg:p-12 space-y-10">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Profile Management</h1>
            <p className="text-gray-500 dark:text-gray-400">Update your personal information and profile picture.</p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Personal Information Card */}
            <section className="bg-white dark:bg-[#1a1a1a] rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
              <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl text-cyan-600 dark:text-cyan-400">
                    <User size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
                </div>
                {!isEditingProfile && (
                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 rounded-xl transition-all"
                  >
                    <Pencil size={16} />
                    Edit Profile
                  </button>
                )}
              </div>

              <div className="p-8 space-y-8">
                {/* Profile Header */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group">
                    <UserCircle className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">System Administrator</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">admin@stainscan.com</p>
                  </div>
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-900 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all"
                          placeholder="Your full name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-900 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold rounded-2xl transition-all active:scale-[0.98]"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-2xl shadow-lg shadow-cyan-200 transition-all active:scale-[0.98]"
                      >
                        <Save size={18} />
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
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
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
