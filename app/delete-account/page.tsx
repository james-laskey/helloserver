// app/delete-account/page.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DeleteAccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    
    if (confirmText !== 'DELETE MY ACCOUNT') {
      setError('Please type "DELETE MY ACCOUNT" to confirm.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(true);
        // Clear form
        setEmail('');
        setPassword('');
        setConfirmText('');
      } else {
        setError(data.error || 'Failed to delete account. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#6C67F2] via-[#8B88FF] to-[#53C691] py-12">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Deleted</h2>
            <p className="text-gray-600 mb-6">
              Your account has been successfully deleted. All your personal data, conversation history, 
              flashcards, and quiz results have been permanently removed.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#6C67F2] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5a57d9] transition"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#6C67F2] via-[#8B88FF] to-[#53C691] py-12">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-6">
            <h1 className="text-2xl font-bold text-white text-center">Delete Account</h1>
            <p className="text-white/80 text-center text-sm mt-1">This action cannot be undone</p>
          </div>
          
          <div className="p-6">
            {/* Warning Box */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-sm text-red-700 font-semibold">Warning: This action is permanent!</p>
                  <p className="text-sm text-red-600 mt-1">
                    Deleting your account will permanently remove all your data including:
                  </p>
                  <ul className="text-sm text-red-600 mt-2 list-disc list-inside space-y-1">
                    <li>Personal information (name, email, preferences)</li>
                    <li>Conversation history with the AI tutor</li>
                    <li>All flashcards and flashcard sets</li>
                    <li>Quiz results and progress statistics</li>
                    <li>Learning streaks and achievements</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            {/* Delete Form */}
            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">DELETE MY ACCOUNT</span> to confirm
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono"
                  placeholder="DELETE MY ACCOUNT"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Permanently Delete My Account'
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-gray-700 transition"
              >
                ← Cancel and return to home
              </Link>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-6 text-white/70 text-sm">
          <Link href="/" className="hover:text-white transition mx-2">Home</Link>
          <span>•</span>
          <Link href="/privacy-policy" className="hover:text-white transition mx-2">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms-of-service" className="hover:text-white transition mx-2">Terms</Link>
        </div>
      </div>
    </main>
  );
}