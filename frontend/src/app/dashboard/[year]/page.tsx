"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  ScanSearch, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Loader2, 
  Calendar, 
  Shirt, 
  User,
  BarChart3
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import Sidebar from '@/src/components/Sidebar';

interface DashboardStats {
  totalUsers: number;
  totalScans: number;
  topStain: string;
  leastStain: string;
  stainGraphData: { name: string; percentage: number }[];
}

export default function YearlyAnalysisPage() {
  const params = useParams();
  const currentYear = params.year as string;

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [yearlyScans, setYearlyScans] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 15;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = yearlyScans.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(yearlyScans.length / itemsPerPage);

  const getStainColor = (name: string) => {
    const colors: Record<string, string> = {
      'Ballpen Ink': '#06b6d4',
      'Used Cooking Oil': '#eab308',
      'Mud': '#78350f',
    };
    return colors[name] || '#6366f1';
  };

  useEffect(() => {
    const fetchYearData = async () => {
      try {
        setIsLoading(true);
        const [statsRes, trendRes, historyRes] = await Promise.all([
          fetch(`http://localhost:8000/api/admin/dashboard/?year=${currentYear}`),
          fetch(`http://localhost:8000/api/analytics/growth/?year=${currentYear}`),
          fetch(`http://localhost:8000/api/admin/history/?year=${currentYear}`)
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (trendRes.ok) setTrendData(await trendRes.json());
        if (historyRes.ok) setYearlyScans(await historyRes.json());
      } catch (err) {
        setError("Failed to fetch historical data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchYearData();
  }, [currentYear]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <Sidebar />
        <main className="flex-1 ml-64 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <Link href="/dashboard" className="text-cyan-400 hover:underline text-sm font-bold flex items-center gap-2 mb-2">
          ← Back to Overview
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">
          {currentYear} Detailed Historical Analysis
        </h1>

        {/* 3 Metric Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard icon={<ScanSearch />} label="Total Scans" value={stats.totalScans} color="blue" />
            <MetricCard icon={<TrendingUp />} label="Top Stain" value={stats.topStain} color="amber" />
            <MetricCard icon={<TrendingDown />} label="Least Common" value={stats.leastStain} color="red" />
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Annual Growth Line Chart */}
          <div className="bg-white dark:bg-[#1a1a1a] p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
               <TrendingUp size={20} className="text-cyan-500" /> System Growth Trend
             </h2>
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                    <XAxis dataKey="month" tick={{fill: '#9ca3af'}} />
                    <YAxis tick={{fill: '#9ca3af'}} />
                    <Tooltip />
                    <Line type="monotone" dataKey="scans" stroke="#06b6d4" strokeWidth={4} dot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Stain Distribution Pie Chart */}
          <div className="bg-white dark:bg-[#1a1a1a] p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
               <BarChart3 size={20} className="text-cyan-500" /> Stain Distribution
             </h2>
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.stainGraphData}
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="percentage"
                    >
                      {stats?.stainGraphData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getStainColor(entry.name)} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* Paginated Scan Log Table */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden">
           <div className="p-6 border-b border-gray-100 dark:border-gray-800">
             <h2 className="text-xl font-bold">{currentYear} Detailed Scan Log</h2>
           </div>
           <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Garment</th>
                  <th className="px-6 py-4">Stain</th>
                  <th className="px-6 py-4">Uploaded At</th>
                  <th className="px-6 py-4">Confidence</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {currentItems.map((scan) => (
                  <tr key={scan.id} className="text-sm">
                    <td className="px-6 py-4 font-bold">@{scan.user}</td>
                    <td className="px-6 py-4 text-gray-400">{scan.garment}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-xs font-bold">
                        {scan.stain_detected === "Cooking Oil" ? "Used Cooking Oil" : scan.stain_detected}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{scan.uploaded_time || "12:00 AM"}</td>
                    <td className="px-6 py-4 font-black text-cyan-400">{scan.confidence_score}%</td>
                    <td className="px-6 py-4 text-xs text-gray-500">{scan.date}</td>
                  </tr>
                ))}
              </tbody>
           </table>
           
           {/* Pagination */}
           <div className="p-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="text-xs font-bold disabled:opacity-50">Previous</button>
              <span className="text-xs text-gray-400">Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="text-xs font-bold disabled:opacity-50">Next</button>
           </div>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ icon, label, value, color }: any) {
  const colorMap: any = {
    cyan: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600',
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600'
  };
  return (
    <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 flex items-center gap-4">
      <div className={`p-4 rounded-2xl ${colorMap[color]}`}>{React.cloneElement(icon, { size: 24 })}</div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-xl font-extrabold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
      </div>
    </div>
  );
}
