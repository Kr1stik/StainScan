'use client';

import React, { useEffect, useState, useRef } from 'react';
import { 
  History, 
  Search, 
  ScanSearch,
  Filter, 
  ChevronRight, 
  Loader2, 
  User as UserIcon, 
  Shirt, 
  Percent, 
  Calendar,
  Download,
  Upload,
  FileSpreadsheet,
  FileText,
  X,
  Target,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import Sidebar from '@/src/components/Sidebar';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface HistoryItem {
  id: number;
  user: string;
  garment: string;
  stain_detected: string;
  confidence_score: number;
  date: string;
  uploaded_time?: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScan, setSelectedScan] = useState<HistoryItem | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/admin/history/?page=${currentPage}`, { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setHistory(data.results);
        setTotalPages(data.total_pages);
      }
    } catch (err) {
      console.error("Network Error:", err);
      setError("Unable to connect to the backend database. Please ensure the Django server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [currentPage]);

  // Reset to page 1 on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const displayedHistory = history.filter((item) => 
    item.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.stain_detected?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.garment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 ml-64">
        <main className="max-w-6xl mx-auto p-8 space-y-8">
          {error && (
            <div className="p-4 text-sm font-bold text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-800 rounded-2xl flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {error}
            </div>
          )}
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Activity History</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Review system-wide fabric scans and analysis records.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setIsLoading(true);
                  fetchHistory();
                }}
                className="px-4 py-2 text-xs font-black text-cyan-600 dark:text-cyan-400 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              >
                Refresh
              </button>

              <div className="relative ml-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search activity..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                  ) : displayedHistory.length > 0 ? (
                    displayedHistory.map((item) => (
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
                            <span className="font-bold text-gray-900 dark:text-white text-sm">{item.stain_detected}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <Percent size={14} className="text-cyan-600" />
                            <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{item.confidence_score}%</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar size={14} />
                            {item.date}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button 
                            onClick={() => setSelectedScan(item)}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
                          >
                            Details
                            <ChevronRight size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="text-center p-4 text-gray-500">
                      <td colSpan={6}>No records found in database</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
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

          {!isLoading && history.length > 0 && (
            <div className="text-center py-6">
              <p className="text-sm text-gray-400 italic">Showing {displayedHistory.length} scan results</p>
            </div>
          )}

          {/* Details Modal */}
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
                          <UserIcon size={10} /> Scanned By
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
    </div>
  );
}
