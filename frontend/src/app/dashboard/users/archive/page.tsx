'use client';

import React, { useEffect, useState } from 'react';
import { Search, Mail, Calendar, RefreshCcw, Trash2, Loader2, Archive } from 'lucide-react';
import Sidebar from '@/src/components/Sidebar';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  date_joined: string;
  is_active: boolean;
}

export default function ArchivedUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchArchivedUsers();
  }, [currentPage]);

  const fetchArchivedUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/admin/users/archived/?page=${currentPage}`, { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.results);
        setTotalPages(data.total_pages);
      }
    } catch (err) {
      console.error("Network Error:", err);
      setError("Unable to connect to the backend database.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId: number) => {
    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/admin/users/${userId}/toggle-status/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: true })
      });
      
      if (response.ok) {
        setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
      }
    } catch (error) {
      console.error("Failed to re-activate user:", error);
    }
  };

  const handlePurgeUser = async (userId: number) => {
    if (window.confirm("Are you sure you want to permanently delete this user? This cannot be undone.")) {
      try {
        const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/admin/users/${userId}/purge/`, { method: 'DELETE' });
        if (response.ok) {
          setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
        }
      } catch (error) {
        console.error("Failed to purge user:", error);
      }
    }
  };

  const displayedUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {error && (
          <div className="p-4 mb-6 text-sm font-bold text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-800 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <Archive className="text-cyan-500" />
              Archived Accounts
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Manage and purge deactivated user accounts</p>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-3 px-4 py-2.5 mb-8 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
          <Search className="text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search archived users..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400 outline-none"
          />
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">User</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Email</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
                        <p className="text-gray-500 font-medium">Loading archives...</p>
                      </div>
                    </td>
                  </tr>
                ) : displayedUsers.length > 0 ? (
                  displayedUsers.map((user) => {
                    const displayName = `${user.first_name} ${user.last_name}`.trim() || user.username;
                    return (
                      <tr key={user.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-xl flex items-center justify-center font-bold">
                              {displayName[0].toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-900 dark:text-white">{displayName}</span>
                              <span className="text-xs text-gray-400">@{user.username}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Mail size={14} className="text-gray-400" />
                            {user.email}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right space-x-4">
                          <button 
                            onClick={() => handleToggleUserStatus(user.id)}
                            className="text-sm font-bold text-green-500 hover:text-green-600 transition-colors inline-flex items-center gap-1.5"
                          >
                            <RefreshCcw size={14} />
                            Activate
                          </button>
                          <button 
                            onClick={() => handlePurgeUser(user.id)}
                            className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors inline-flex items-center gap-1.5"
                          >
                            <Trash2 size={14} />
                            Delete Permanently
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3} className="px-8 py-10 text-center text-gray-500 font-medium">
                      Archive ledger is empty.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center px-8 py-5 border-t border-gray-50 dark:border-gray-800">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm font-bold text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
