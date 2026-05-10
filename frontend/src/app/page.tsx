'use client';
import LoginForm from '@/src/components/LoginForm';
import LoginVisual from '@/src/components/LoginVisual';

export default function LoginPage() {
  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      <div className="flex flex-col justify-center p-8 md:p-24">
        <h1 className="text-4xl font-bold mb-10">Welcome back</h1>
        <LoginForm />
      </div>
      <div className="hidden md:block">
        <LoginVisual />
      </div>
    </main>
  );
}