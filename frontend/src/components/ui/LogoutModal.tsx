'use client';

import React from 'react';
import { LogOut, AlertCircle } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with stronger blur */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-sm transform overflow-hidden rounded-[2rem] bg-white shadow-2xl transition-all animate-in zoom-in-95 fade-in duration-200">
        {/* Top Decorative bar */}
        <div className="h-2 bg-gradient-to-r from-cyan-400 to-cyan-600" />
        
        <div className="p-8">
            {/* Icon Header - Using AlertCircle for a more "prompt" feel */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 rotate-3 hover:rotate-0 transition-transform duration-300 shadow-sm border border-cyan-100">
              <LogOut size={36} strokeWidth={2} />
            </div>

            {/* Text Content */}
            <h3 className="mb-2 text-2xl font-extrabold text-gray-900 tracking-tight">Ready to leave?</h3>
            <p className="mb-8 text-gray-500 text-balance">
              Sign out of your account to keep your stain scanning history secure.
            </p>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={onClose}
                className="w-full rounded-2xl border-2 border-gray-100 bg-white py-3.5 text-sm font-bold text-gray-500 hover:bg-gray-50 hover:border-gray-200 active:scale-[0.96] transition-all"
              >
                Wait, no
              </button>
              <button
                onClick={onConfirm}
                className="w-full rounded-2xl bg-cyan-600 py-3.5 text-sm font-bold text-white shadow-xl shadow-cyan-200/50 hover:bg-cyan-700 active:scale-[0.96] transition-all flex items-center justify-center gap-2"
              >
                Sign Out
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
