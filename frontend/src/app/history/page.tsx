'use client';

import React, { useEffect, useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  ChevronRight, 
  Loader2, 
  User as UserIcon, 
  Shirt, 
  Percent, 
  Calendar 
} from 'lucide-react';
import Sidebar from '@/src/components/Sidebar';

interface HistoryItem {
  id: number;
  user: string;
  garment: string;
  stainDetected: string;
  confidenceScore: number;
  date: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/admin/history/');
        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        } else {
          // Fallback mock data if API fails
          setHistory([
            { id: 1, user: 'sarah_j', garment: 'T-Shirt', stainDetected: 'Black Ink', confidenceScore: 94, date: 'May 10, 2024' },
            { id: 2, user: 'johndoe', garment: 'Hoodie', stainDetected: 'Sweat Stain', confidenceScore: 88, date: 'May 08, 2024' },
            { id: 3, user: 'alex_s', garment: 'Dress', stainDetected: 'Red Wine', confidenceScore: 92, date: 'May 05, 2024' },
            { id: 4, user: 'm_garcia', garment: 'Jeans', stainDetected: 'Oil Stain', confidenceScore: 85, date: 'May 01, 2024' },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch history:', error);
        // Fallback mock data
        setHistory([
          { id: 1, user: 'sarah_j', garment: 'T-Shirt', stainDetected: 'Black Ink', confidenceScore: 94, date: 'May 10, 2024' },
          { id: 2, user: 'johndoe', garment: 'Hoodie', stainDetected: 'Sweat Stain', confidenceScore: 88, date: 'May 08, 2024' },
          { id: 3, user: 'alex_s', garment: 'Dress', stainDetected: 'Red Wine', confidenceScore: 92, date: 'May 05, 2024' },
          { id: 4, user: 'm_garcia', garment: 'Jeans', stainDetected: 'Oil Stain', confidenceScore: 85, date: 'May 01, 2024' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 ml-64">
        <main className="max-w-6xl mx-auto p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Activity History</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Review system-wide fabric scans and analysis records.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search activity..." 
                  className="pl-10 pr-4 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all w-64"
                />
              </div>
              <button className="p-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Filter size={20} />
              </button>
            </div>
          </div>

          {/* History List/Table */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                    <th className="px-8 py-5 text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">User</th>
                    <th className="px-8 py-5 text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Garment</th>
                    <th className="px-8 py-5 text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Stain Detected</th>
                    <th className="px-8 py-5 text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Confidence</th>
                    <th className="px-8 py-5 text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-8 py-5 text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
                          <p className="text-gray-500 font-medium">Retrieving scan history...</p>
                        </div>
                      </td>
                    </tr>
                  ) : history.length > 0 ? (
                    history.map((item) => (
                      <tr key={item.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400">
                              <UserIcon size={14} />
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white text-sm">@{item.user}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <Shirt size={14} className="text-gray-400" />
                            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{item.garment}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-500" />
                            <span className="font-bold text-gray-900 dark:text-white text-sm">{item.stainDetected}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <Percent size={14} className="text-cyan-600" />
                            <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{item.confidenceScore}%</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar size={14} />
                            {item.date}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors">
                            Details
                            <ChevronRight size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-8 py-10 text-center text-gray-500">
                        No history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {!isLoading && history.length > 0 && (
            <div className="text-center py-6">
              <p className="text-sm text-gray-400 italic">Showing {history.length} most recent scan results</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
