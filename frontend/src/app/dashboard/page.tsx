'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  ScanSearch, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight, 
  Clock,
  Loader2,
  BarChart3,
  User,
  Shirt,
  Calendar,
  ChevronRight,
  RotateCcw,
  X,
  Target,
  ShieldCheck
} from 'lucide-react';
import Sidebar from '@/src/components/Sidebar';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface DashboardStats {
  totalUsers: number;
  totalScans: number;
  topStain: string;
  leastStain: string;
  stainGraphData: { name: string; percentage: number }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalScans: 0,
    topStain: '-',
    leastStain: '-',
    stainGraphData: []
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshingActivities, setIsRefreshingActivities] = useState(false);
  const [selectedScan, setSelectedScan] = useState<any>(null);

  const fetchActivities = async () => {
    try {
      setIsRefreshingActivities(true);
      const activitiesRes = await fetch(`${NEXT_PUBLIC_API_URL}/api/admin/recent-activity/`, { cache: 'no-store' });
      if (activitiesRes.ok) {
        const activitiesData = await activitiesRes.json();
        setActivities(activitiesData);
      }
    } catch (err) {
      console.error("Error refreshing activities:", err);
    } finally {
      setIsRefreshingActivities(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const statsRes = await fetch(`${NEXT_PUBLIC_API_URL}/api/admin/dashboard/`, { cache: 'no-store' });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.error("Network Error:", err);
      setError("Unable to connect to the backend database. Please ensure the Django server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchActivities();

    const interval = setInterval(() => {
      fetchDashboardData();
      fetchActivities();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
        <Sidebar />
        <main className="flex-1 ml-64 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
            <p className="text-gray-500 font-medium">Loading dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

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
        
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Admin Overview</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Real-time system operational overview</p>
          </div>
        </div>
          
        <div className="flex gap-4 mb-8">
          {['2024', '2025', '2026'].map((year) => (
            <Link
              key={year}
              href={`/dashboard/${year}`}
              className="flex-1 p-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 font-bold text-lg transition-all duration-300 bg-white dark:bg-[#1a1a1a] text-gray-500 hover:bg-cyan-500/10 hover:border-cyan-500 hover:text-cyan-400 flex items-center justify-center gap-2 group"
            >
              {year} System Data
              <ChevronRight size={18} className="text-gray-300 group-hover:text-cyan-400 transition-colors" />
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5 transition-colors duration-300">
            <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-2xl text-cyan-600 dark:text-cyan-400">
              <Users size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Users</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{stats.totalUsers.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5 transition-colors duration-300">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400">
              <ScanSearch size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Scans</p>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">{stats.totalScans.toLocaleString()}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5 transition-colors duration-300">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl text-amber-600 dark:text-amber-400">
              <TrendingUp size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Most Common</p>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">{stats.topStain}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5 transition-colors duration-300">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-600 dark:text-red-400">
              <TrendingDown size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Least Common</p>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">{stats.leastStain}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
          <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl">
                <Clock size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Scans</h2>
            </div>
            <button
              onClick={fetchActivities}
              disabled={isRefreshingActivities}
              className="p-2.5 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl text-cyan-600 dark:text-cyan-400 hover:bg-cyan-600 hover:text-white dark:hover:bg-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh recent scans"
            >
              <RotateCcw size={20} className={isRefreshingActivities ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => setSelectedScan(item)}
                    className="flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-800/40 rounded-[1.5rem] transition-all group border border-transparent hover:border-gray-100 dark:hover:border-gray-800 cursor-pointer"
                  >
                    <div className="flex items-center gap-5 flex-1">
                      <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-900/20 rounded-2xl flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-sm">
                        <User size={22} />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1 items-center">
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">User</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">@{item.user}</p>
                        </div>

                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Garment</p>
                          <div className="flex items-center gap-2">
                            <Shirt size={14} className="text-gray-400" />
                            <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{item.garment || 'Standard Item'}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Detected Stain</p>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            <p className="text-sm font-extrabold text-gray-900 dark:text-white">{item.stain_detected}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Confidence</p>
                          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
                            <p className="text-sm font-black">{item.confidence_score}%</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</p>
                          <div className="flex items-center gap-2 text-gray-500">
                            <Calendar size={14} />
                            <p className="text-xs font-bold">{item.date}</p>
                          </div>
                        </div>
                      </div>
                      
                      <ChevronRight size={18} className="text-gray-300 group-hover:text-cyan-500 transition-colors ml-4" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[2.5rem]">
                  <Activity className="text-gray-300 mx-auto mb-4" size={32} />
                  <p className="text-gray-500 font-bold">No recent scans found</p>
                </div>
              )}
            </div>
            
            <Link href="/history" className="block w-full">
              <button className="w-full mt-6 py-3 text-sm font-bold text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors border-t border-gray-50 dark:border-gray-800 pt-6 cursor-pointer">
                View All System Activity
              </button>
            </Link>
          </div>
        </div>

        {/* Scan Details Modal */}
        {selectedScan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-white dark:bg-[#1a1a1a] w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="relative p-8">
                <button 
                  onClick={() => setSelectedScan(null)}
                  className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500">
                    <ScanSearch size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Scan Deep Dive</h2>
                    <p className="text-sm text-gray-500 font-medium">Record ID: #{selectedScan.id}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <User size={10} /> Scanned By
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">@{selectedScan.user}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <Shirt size={10} /> Garment Type
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedScan.garment}</p>
                    </div>
                  </div>

                  <div className="p-6 bg-cyan-500/5 rounded-3xl border border-cyan-500/10 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-[10px] font-black border border-cyan-500/20">
                        AI VERIFIED
                      </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                      {selectedScan.stain_detected === "Cooking Oil" ? "Used Cooking Oil" : selectedScan.stain_detected}
                    </p>
                    <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mt-2">
                      Confidence Score: {selectedScan.confidence_score}%
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <Clock size={10} /> Scan Time
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedScan.uploaded_time || "12:00 AM"}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <Calendar size={10} /> Scan Date
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedScan.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3 p-4 bg-green-500/5 rounded-2xl border border-green-500/10 text-green-600 dark:text-green-400">
                    <ShieldCheck size={20} />
                    <p className="text-xs font-black uppercase tracking-widest">✓ System Status: Approved</p>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedScan(null)}
                  className="w-full mt-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
                >
                  Close Detailed View
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
