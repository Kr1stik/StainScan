'use client';

import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function LoginVisual() {
  return (
    <div className="relative flex flex-col items-center justify-center p-6 w-full">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-cyan-200/20 rounded-full blur-3xl -translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-300/10 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />

      <div className="relative bg-white/10 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl border border-white/10 text-center w-full max-w-sm">
        {/* Avatar/Illustration Section - Smaller sizes */}
        <div className="relative mx-auto mb-6 w-28 h-28">
          <div className="absolute inset-0 bg-cyan-500 rounded-full shadow-lg shadow-cyan-900/50 animate-pulse" />
          <div className="absolute inset-1.5 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-cyan-100">
             <img 
               src="/logo.png" 
               alt="Avatar" 
               className="w-16 h-16 object-contain opacity-90"
             />
          </div>
          <div className="absolute -right-1 -bottom-1 bg-white p-2 rounded-xl shadow-lg text-cyan-600">
            <Sparkles size={18} />
          </div>
        </div>

        {/* New Description Text - More compact */}
        <h2 className="text-xl font-bold text-white mb-3">
          Intelligent fabric analysis
        </h2>
        <p className="text-cyan-50/80 leading-snug font-medium text-sm">
          Scan garments to detect <span className="text-cyan-300 font-bold">black ink</span>, <span className="text-cyan-300 font-bold">sweat</span>, and <span className="text-cyan-300 font-bold">mold</span> with AI.
        </p>
        
        <div className="mt-6 flex items-center justify-center gap-2 text-cyan-400 font-semibold text-xs">
          <ShieldCheck size={14} />
          <span>Secured by StainScan AI</span>
        </div>
      </div>
    </div>
  );
}
