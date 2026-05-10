'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Lock, 
  ShieldCheck, 
  LogOut, 
  X 
} from 'lucide-react';
import Sidebar from '@/src/components/Sidebar';
import LogoutModal from '@/src/components/ui/LogoutModal';
import { useTheme } from '@/src/components/ThemeProvider';

export default function SettingsPage() {
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  // Use global theme state
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Security edit state
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Successfully updated password!');
    setIsChangingPassword(false);
  };

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    toast.success('Successfully logged out!');
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 ml-64">
        <main className="max-w-4xl mx-auto p-8 lg:p-12 space-y-10">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Settings</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage your system preferences and security.</p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* 1. Appearance Section */}
            <section className="bg-white dark:bg-[#1a1a1a] rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
              <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center gap-3">
                <div className="p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl text-cyan-600 dark:text-cyan-400">
                  <Sun size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Appearance</h2>
              </div>
              <div className="p-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-yellow-50 text-yellow-600'}`}>
                    {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">Dark Mode</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Adjust the interface to reduce eye strain</p>
                  </div>
                </div>
                <button 
                  onClick={toggleTheme}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${isDarkMode ? 'bg-cyan-600' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </section>

            {/* 2. Security Section */}
            <section className="bg-white dark:bg-[#1a1a1a] rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
              <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl text-cyan-600 dark:text-cyan-400">
                    <ShieldCheck size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Security</h2>
                </div>
                {!isChangingPassword && (
                  <button 
                    onClick={() => setIsChangingPassword(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 rounded-xl transition-all"
                  >
                    <Lock size={16} />
                    Change Password
                  </button>
                )}
              </div>

              <div className="p-8">
                {isChangingPassword ? (
                  <form onSubmit={handleUpdatePassword} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Current Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="password"
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-900 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all"
                          placeholder="Enter current password"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="password"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-900 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all"
                            placeholder="Enter new password"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Confirm New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="password"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-900 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all"
                            placeholder="Confirm new password"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsChangingPassword(false)}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold rounded-2xl transition-all active:scale-[0.98]"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-2xl shadow-lg shadow-cyan-200 transition-all active:scale-[0.98]"
                      >
                        <ShieldCheck size={18} />
                        Update Password
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Password</label>
                      <p className="text-gray-900 dark:text-white font-medium tracking-widest mt-1">••••••••</p>
                    </div>
                    <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-sm font-bold bg-cyan-50 dark:bg-cyan-900/20 px-3 py-1.5 rounded-lg">
                      <ShieldCheck size={16} />
                      Protected
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* 3. Account Actions Area */}
            <section className="bg-white dark:bg-[#1a1a1a] rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
              <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center gap-3">
                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400">
                  <LogOut size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Account Actions</h2>
              </div>
              <div className="p-8">
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="flex items-center gap-2 px-8 py-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 font-bold rounded-2xl transition-all active:scale-[0.98]"
                >
                  <LogOut size={20} />
                  Logout from Account
                </button>
                <p className="mt-4 text-xs text-gray-400 dark:text-gray-500 ml-1">
                  Signing out will end your current session. You will need to log in again to access the system.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
}
