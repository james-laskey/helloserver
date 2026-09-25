// app/beta/bug-report/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function BugReportPage() {
  const [formData, setFormData] = useState({
    email: '',
    title: '',
    description: '',
    steps: '',
    expectedResult: '',
    actualResult: '',
    severity: 'medium',
    deviceInfo: '',
    appVersion: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/beta/bug-report', {
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
      setError('Failed to submit bug report. Please try again.');
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Bug Report Submitted</h2>
            <p className="text-gray-600 mb-6">
              Thank you for helping us improve HelloAi! Our team will review your report.
            </p>
            <div className="space-y-3">
              <Link href="/beta/bug-report" className="block text-[#6C67F2] hover:underline">
                Submit Another Report
              </Link>
              <Link href="/" className="block text-gray-500 hover:underline">
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#6C67F2] via-[#8B88FF] to-[#53C691] py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-6">
            <h1 className="text-2xl font-bold text-white text-center">Report a Bug</h1>
            <p className="text-white/80 text-center mt-2">Help us make HelloAi better</p>
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
                  Your Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="your-beta-email@example.com"
                />
                <p className="text-xs text-gray-500 mt-1">Must be the email you used to join the beta</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bug Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Brief description of the issue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="What happened? What did you expect to happen?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Steps to Reproduce
                </label>
                <textarea
                  rows={3}
                  value={formData.steps}
                  onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="1. Open the app\n2. Tap on...\n3. Observe that..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Result
                  </label>
                  <textarea
                    rows={2}
                    value={formData.expectedResult}
                    onChange={(e) => setFormData({ ...formData, expectedResult: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="What should have happened"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Actual Result
                  </label>
                  <textarea
                    rows={2}
                    value={formData.actualResult}
                    onChange={(e) => setFormData({ ...formData, actualResult: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="What actually happened"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Severity
                  </label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="low">Low - Minor inconvenience</option>
                    <option value="medium">Medium - Annoying but workable</option>
                    <option value="high">High - Major feature broken</option>
                    <option value="critical">Critical - App crash or data loss</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    App Version
                  </label>
                  <input
                    type="text"
                    value={formData.appVersion}
                    onChange={(e) => setFormData({ ...formData, appVersion: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., 1.0.0 (build 42)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Device Info
                </label>
                <input
                  type="text"
                  value={formData.deviceInfo}
                  onChange={(e) => setFormData({ ...formData, deviceInfo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Samsung Galaxy S24, Android 14"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50"
              >
                {isLoading ? 'Submitting...' : 'Submit Bug Report'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}