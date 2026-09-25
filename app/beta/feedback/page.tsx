// app/beta/feedback/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function BetaFeedbackPage() {
  const [formData, setFormData] = useState({
    email: '',
    rating: '',
    feedback: '',
    category: 'general'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/beta/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          rating: formData.rating ? parseInt(formData.rating) : null
        })
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              Your feedback helps shape the future of HelloAi.
            </p>
            <div className="space-y-3">
              <Link href="/beta/feedback" className="block text-[#6C67F2] hover:underline">
                Share More Feedback
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
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#6C67F2] to-[#53C691] px-6 py-6">
            <h1 className="text-2xl font-bold text-white text-center">Beta Feedback</h1>
            <p className="text-white/80 text-center mt-2">Help us improve HelloAi</p>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C67F2] focus:border-transparent"
                  placeholder="your-beta-email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating (1-5)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star.toString() })}
                      className={`text-3xl ${parseInt(formData.rating) >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C67F2] focus:border-transparent"
                >
                  <option value="general">General Feedback</option>
                  <option value="feature-request">Feature Request</option>
                  <option value="usability">Usability Issue</option>
                  <option value="performance">Performance</option>
                  <option value="crash">Crash Report</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Feedback *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.feedback}
                  onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C67F2] focus:border-transparent"
                  placeholder="Tell us what you think! What features would you like to see? What could be improved?"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#6C67F2] hover:bg-[#5a57d9] text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50"
              >
                {isLoading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}