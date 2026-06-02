'use client';

import React from 'react';
import LoginForm from '@/src/components/LoginForm';
import LoginVisual from '@/src/components/LoginVisual';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Left Side: Visual Section */}
        <div className="hidden md:flex w-full md:w-1/2 bg-[#0f2847] flex-col items-center justify-center relative overflow-hidden p-8">
          <LoginVisual />
        </div>

        {/* Right Side: Form Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center bg-white px-8 md:px-16 py-12">
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
