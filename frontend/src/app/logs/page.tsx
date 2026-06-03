"use client";

import React, { useEffect, useState } from 'react';
import { Terminal, ShieldAlert, AlertTriangle, Info, Clock, User, Loader2, RefreshCcw } from 'lucide-react';
import Sidebar from '@/src/components/Sidebar';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface SystemLog {
  id: number;
  log_level: string;
  user: string;
  event_action: string;
  details: string;
  timestamp: string;
}

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${NEXT_PUBLIC_API_URL}/api/admin/system-logs/`);
      if (res.ok) setLogs(await res.json());
    } catch (err) {
      console.error("Log Fetch Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getLevelStyles = (level: string) => {
    switch (level.toUpperCase()) {
      case 'ERROR': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'WARNING': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3 uppercase tracking-tighter">
              <Terminal className="text-cyan-500" size={32} />
              System Event Logs
            </h1>
            <p className="text-gray-500 font-medium mt-1">Monitor processing events, API errors, and network validation states.</p>
          </div>
          <button onClick={fetchLogs} className="p-3 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 transition-all">
            <RefreshCcw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800">
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Level</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Event Action</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-1/3">Technical Details</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {isLoading ? (
                  <tr><td colSpan={5} className="py-20 text-center"><Loader2 className="mx-auto animate-spin text-cyan-500" /></td></tr>
                ) : logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${getLevelStyles(log.log_level)}`}>
                        {log.log_level}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                        <User size={14} className="text-gray-400" /> @{log.user}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-extrabold text-gray-900 dark:text-white">{log.event_action}</p>
                    </td>
                    <td className="px-6 py-5">
                      <code className="text-[11px] font-mono bg-gray-100 dark:bg-black/40 p-2 rounded-lg block text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800">
                        {log.details}
                      </code>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                        <Clock size={14} /> {log.timestamp}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
