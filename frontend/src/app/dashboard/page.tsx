'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  ScanSearch, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight, 
  Clock,
  Loader2,
  BarChart3
} from 'lucide-react';
import Sidebar from '@/src/components/Sidebar';

interface DashboardStats {
  totalUsers: number;
  totalScans: number;
  topStain: string;
  leastStain: string;
  stainGraphData: { name: string; percentage: number }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const activities = [
    { id: 1, user: 'johndoe', action: 'registered', time: '2 mins ago', color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 2, user: 'System', action: 'Scan: Mud detected (92%)', time: '15 mins ago', color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { id: 3, user: 'alex_smith', action: 'Scan: Ballpen Ink detected (88%)', time: '1 hour ago', color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 4, user: 'm_garcia', action: 'Updated profile', time: '3 hours ago', color: 'text-gray-600', bg: 'bg-gray-50' },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/admin/dashboard/');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          // Realistic Fallback mock data
          setStats({
            totalUsers: 1245,
            totalScans: 8430,
            topStain: 'Mud',
            leastStain: 'Cooking Oil',
            stainGraphData: [
              { name: 'Mud', percentage: 55 },
              { name: 'Ballpen Ink', percentage: 30 },
              { name: 'Cooking Oil', percentage: 15 }
            ]
          });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setStats({
          totalUsers: 1245,
          totalScans: 8430,
          topStain: 'Mud',
          leastStain: 'Cooking Oil',
          stainGraphData: [
            { name: 'Mud', percentage: 55 },
            { name: 'Ballpen Ink', percentage: 30 },
            { name: 'Cooking Oil', percentage: 15 }
          ]
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
        <Sidebar />
        <main className="flex-1 ml-64 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
            <p className="text-gray-500 font-medium">Loading analytics...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Admin Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">System statistics and recent activity</p>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5 transition-colors duration-300">
            <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-2xl text-cyan-600 dark:text-cyan-400">
              <Users size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Users</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{stats.totalUsers.toLocaleString()}</span>
                <span className="text-xs font-bold text-green-600 flex items-center">
                  <ArrowUpRight size={12} />
                  12%
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">this week</p>
            </div>
          </div>

          {/* Total Scans */}
          <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5 transition-colors duration-300">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400">
              <ScanSearch size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Scans</p>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">{stats.totalScans.toLocaleString()}</h3>
              <p className="text-xs text-gray-400 mt-0.5">System wide</p>
            </div>
          </div>

          {/* Most Common Stain */}
          <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5 transition-colors duration-300">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl text-amber-600 dark:text-amber-400">
              <TrendingUp size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Most Common</p>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">{stats.topStain}</h3>
              <p className="text-xs text-gray-400 mt-0.5">Highest frequency</p>
            </div>
          </div>

          {/* Least Common Stain */}
          <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5 transition-colors duration-300">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-600 dark:text-red-400">
              <TrendingDown size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Least Common</p>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">{stats.leastStain}</h3>
              <p className="text-xs text-gray-400 mt-0.5">Lowest frequency</p>
            </div>
          </div>
        </div>

        {/* Stain Comparison Chart */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden mb-8 transition-colors duration-300">
          <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center gap-3">
            <div className="p-2 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 rounded-xl">
              <BarChart3 size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Stain Comparison</h2>
          </div>
          <div className="p-8 space-y-6">
            {stats.stainGraphData.map((stain, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-gray-700 dark:text-gray-300">{stain.name}</span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">{stain.percentage}%</span>
                </div>
                <div className="w-full h-3 bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${stain.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
          <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center gap-3">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-400">
              <Activity size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {activities.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-2xl transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 ${item.bg} dark:bg-opacity-20 ${item.color} rounded-xl flex items-center justify-center font-bold`}>
                      {item.user[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        <span className="text-cyan-600 dark:text-cyan-400">@{item.user}</span> {item.action}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <Clock size={12} />
                        {item.time}
                      </div>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline">View Details</button>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-3 text-sm font-bold text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors border-t border-gray-50 dark:border-gray-800 pt-6">
              View All System Activity
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
