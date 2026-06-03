'use client';

import { useState } from 'react';
import { User, KeyRound, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Import the Next.js router
import { toast } from 'sonner';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Initialize the router

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); // Clear old errors

    try {
      // 1. Send the username and password to Django
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      // 2. Check if login was successful
      if (response.ok) {
        const data = await response.json();
        
        // Save the VIP wristband (token) in the browser
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);

        // 3. Redirect to the dashboard!
        toast.success('Successfully logged in!');
        router.push('/dashboard');
      } else {
        setError('Invalid username or password.');
      }
    } catch (err) {
      setError('Could not connect to the server. Is Django running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5 w-full max-w-md">
      {/* Error Message Display */}
      {error && <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
        <div className="relative">
          <User className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-10 p-3 border rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all bg-white text-gray-900" 
            placeholder="Enter your Django username"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-12 p-3 border rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all bg-white text-gray-900"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-cyan-600 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-cyan-100 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin mr-2" size={20} />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  );
}

