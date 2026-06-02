'use client';

import React, { useEffect, useState } from 'react';
import { Mail, Calendar, Check, X, Loader2, Clock, Shield } from 'lucide-react';
import Sidebar from '@/src/components/Sidebar';

interface PasswordResetRequest {
  id: number;
  email: string;
  created_at: string;
  is_approved: boolean;
  is_used: boolean;
}

export default function PasswordResetRequestsPage() {
  const [requests, setRequests] = useState<PasswordResetRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approving, setApproving] = useState<number | null>(null);
  const [rejecting, setRejecting] = useState<number | null>(null);

  const fetchRequests = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/password-reset-requests/', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (err) {
      console.error("Network Error:", err);
      setError("Unable to connect to the backend database. Please ensure the Django server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const approveRequest = async (requestId: number) => {
    setApproving(requestId);
    try {
      const response = await fetch(`http://localhost:8000/api/password-reset-requests/${requestId}/approve/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        setRequests(requests.map(r => r.id === requestId ? { ...r, is_approved: true } : r));
      }
    } catch (err) {
      console.error("Error approving request:", err);
    } finally {
      setApproving(null);
    }
  };

  const rejectRequest = async (requestId: number) => {
    setRejecting(requestId);
    try {
      const response = await fetch(`http://localhost:8000/api/password-reset-requests/${requestId}/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        setRequests(requests.filter(r => r.id !== requestId));
      }
    } catch (err) {
      console.error("Error rejecting request:", err);
    } finally {
      setRejecting(null);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(() => fetchRequests(), 5000);
    return () => clearInterval(interval);
  }, []);

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Password Reset Requests</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Manage and approve password reset requests from users</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
              <p className="text-gray-500 font-medium">Loading requests...</p>
            </div>
          </div>
        ) : requests.length === 0 ? (
          <div className="py-12 text-center bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800">
            <Shield className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No password reset requests</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {requests.map((request) => (
              <div key={request.id} className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex items-center justify-between hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white font-medium">{request.email}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(request.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(request.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-4">
                  <div className="flex items-center gap-2">
                    {request.is_approved && (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                        Approved
                      </span>
                    )}
                    {request.is_used && (
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-medium rounded-full">
                        Used
                      </span>
                    )}
                    {!request.is_approved && !request.is_used && (
                      <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium rounded-full">
                        Pending
                      </span>
                    )}
                  </div>

                  {!request.is_approved && !request.is_used && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => approveRequest(request.id)}
                        disabled={approving === request.id}
                        className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors disabled:opacity-50"
                      >
                        {approving === request.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => rejectRequest(request.id)}
                        disabled={rejecting === request.id}
                        className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
                      >
                        {rejecting === request.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
