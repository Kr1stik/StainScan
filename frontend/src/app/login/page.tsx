'use client';

import React from 'react';
import LoginForm from '@/src/components/LoginForm';
import LoginVisual from '@/src/components/LoginVisual';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Central Floating Card - More compact dimensions */}
      <div className="flex flex-col md:flex-row bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-4xl w-full min-h-[520px]">
        
        {/* Left Side: Visual Section */}
        <div className="hidden md:flex w-full md:w-1/2 bg-[#0f2847] items-center justify-center p-8">
          <LoginVisual />
        </div>

        {/* Right Side: Form Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-12 py-10 bg-white">
          <div className="max-w-sm w-full mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-500 mb-8 text-base">Please sign in to your account.</p>
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
