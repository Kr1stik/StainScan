'use client';

import React, { useEffect, useState } from 'react';
import { Search, Mail, Calendar, Ban, Eye, X, Award, Loader2 } from 'lucide-react';
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
  achievements?: { id: number; name: string; description: string }[];
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/admin/users/?page=${currentPage}`, { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          setUsers(data.results);
          setTotalPages(data.total_pages);
        }
      } catch (err) {
        console.error("Network Error:", err);
        setError("Unable to connect to the backend database. Please ensure the Django server is running.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage]);

  const handleToggleUserStatus = async (userId: number, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    
    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/admin/users/${userId}/toggle-status/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: nextStatus })
      });
      
      if (response.ok) {
        // If the user was deactivated, remove them from the active users list immediately
        if (!nextStatus) {
          setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
        } else {
          // If they were activated (unlikely from this page but for safety), update their status
          setUsers(prevUsers => 
            prevUsers.map(u => u.id === userId ? { ...u, is_active: nextStatus } : u)
          );
        }
      }
    } catch (error) {
      console.error("Failed to alter user lifecycle state:", error);
    }
  };

  const displayedUsers = [...users]
    .filter(user => 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'az') {
        return a.username.localeCompare(b.username);
      } else {
        return new Date(b.date_joined).getTime() - new Date(a.date_joined).getTime();
      }
    });

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
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">User Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">View and manage registered system users</p>
          </div>
        </div>

        {/* Search Bar Container */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <div className="flex flex-1 items-center gap-3 px-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
            <Search className="text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search users by name, username or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400 outline-none"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Sort by:</span>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-cyan-500/20 outline-none cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="az">A-Z</option>
            </select>
          </div>
        </div>

        {/* Data Table Card */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">User</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Email</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Joined Date</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
                        <p className="text-gray-500 font-medium">Loading user data...</p>
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
                            <div className="w-10 h-10 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 rounded-xl flex items-center justify-center font-bold">
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
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar size={14} className="text-gray-400" />
                            {new Date(user.date_joined).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            user.is_active 
                              ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                            {user.is_active ? 'Active' : 'Inactive'}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button 
                            onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                            className={`inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-xl transition-all ${
                              user.is_active 
                                ? 'text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' 
                                : 'text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                            }`}
                          >
                            <Ban size={14} />
                            {user.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-10 text-center text-gray-500">
                      No users found.
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

      {/* Achievement Tracker Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1a1a] w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center text-xl font-bold">
                    {(selectedUser.first_name[0] || selectedUser.username[0]).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {`${selectedUser.first_name} ${selectedUser.last_name}`.trim() || selectedUser.username}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5 text-sm">
                      <Mail size={12} />
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">User Achievement Tracker</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedUser.achievements && selectedUser.achievements.length > 0 ? (
                      selectedUser.achievements.map((achievement) => (
                        <div 
                          key={achievement.id} 
                          className="flex items-center gap-4 p-4 bg-cyan-50/50 dark:bg-cyan-900/10 border border-cyan-100/50 dark:border-cyan-800/30 rounded-2xl group transition-all"
                        >
                          <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-xl flex items-center justify-center">
                            <Award size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{achievement.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{achievement.description}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[2rem]">
                        <Award size={32} className="mx-auto text-gray-200 dark:text-gray-800 mb-2" />
                        <p className="text-gray-400 font-medium">No achievements unlocked yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:opacity-90 transition-opacity"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
