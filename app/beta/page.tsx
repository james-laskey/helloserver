// app/beta/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function BetaSignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    deviceType: '',
    deviceModel: '',
    osVersion: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/beta/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to submit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#6C67F2] via-[#8B88FF] to-[#53C691] py-12">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You're on the list!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your interest in the HelloAi beta program. We'll send you an invite to join as soon as spots become available.
            </p>
            <Link href="/" className="text-[#6C67F2] hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#6C67F2] via-[#8B88FF] to-[#53C691] py-12">
      <div className="container mx-auto px-4 max-w-lg">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#6C67F2] to-[#53C691] px-6 py-8">
            <h1 className="text-2xl font-bold text-white text-center">Join the Beta Program</h1>
            <p className="text-white/80 text-center mt-2">Be among the first to try HelloAi</p>
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C67F2] focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name (Optional)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C67F2] focus:border-transparent"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Device Type
                </label>
                <select
                  value={formData.deviceType}
                  onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C67F2] focus:border-transparent"
                >
                  <option value="">Select device type</option>
                  <option value="iOS">iOS (iPhone/iPad)</option>
                  <option value="Android">Android</option>
                  <option value="Both">Both</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Device Model (Optional)
                </label>
                <input
                  type="text"
                  value={formData.deviceModel}
                  onChange={(e) => setFormData({ ...formData, deviceModel: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C67F2] focus:border-transparent"
                  placeholder="e.g., iPhone 14 Pro, Samsung Galaxy S24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OS Version (Optional)
                </label>
                <input
                  type="text"
                  value={formData.osVersion}
                  onChange={(e) => setFormData({ ...formData, osVersion: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C67F2] focus:border-transparent"
                  placeholder="e.g., iOS 17.2, Android 14"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#6C67F2] hover:bg-[#5a57d9] text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50"
              >
                {isLoading ? 'Submitting...' : 'Join Beta Waitlist'}
              </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4">
              By joining, you agree to receive emails about the beta program.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}