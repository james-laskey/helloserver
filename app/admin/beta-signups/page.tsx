'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface BetaTester {
  id: string;
  email: string;
  name: string | null;
  deviceType: string | null;
  deviceModel: string | null;
  osVersion: string | null;
  status: string;
  joinedAt: string | null;
  createdAt: string;
  bugReports: { id: string }[];
  feedback: { id: string }[];
}

export default function AdminBetaSignupsPage() {
  const [signups, setSignups] = useState<BetaTester[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSignups();
  }, []);

  const fetchSignups = async () => {
    try {
      const response = await fetch('/api/admin/beta-signups');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      setSignups(data);
      setError('');
    } catch (error) {
      console.error('Error fetching signups:', error);
      setError('Failed to load beta signups. Make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const filtered = getFilteredSignups();
    
    const headers = ['Email', 'Name', 'Device Type', 'Device Model', 'OS Version', 'Status', 'Signed Up', 'Joined', 'Bug Reports', 'Feedback'];
    
    const rows = filtered.map(s => [
      s.email,
      s.name || '',
      s.deviceType || '',
      s.deviceModel || '',
      s.osVersion || '',
      s.status,
      new Date(s.createdAt).toLocaleDateString(),
      s.joinedAt ? new Date(s.joinedAt).toLocaleDateString() : 'Not joined',
      s.bugReports.length.toString(),
      s.feedback.length.toString()
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beta-signups-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFilteredSignups = () => {
    let filtered = signups;
    
    if (filter !== 'all') {
      filtered = filtered.filter(s => s.status === filter);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(s => 
        s.email.toLowerCase().includes(searchLower) ||
        (s.name && s.name.toLowerCase().includes(searchLower))
      );
    }
    
    return filtered;
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/admin/beta-signups', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      
      if (response.ok) {
        // Refresh the list
        fetchSignups();
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredSignups = getFilteredSignups();
  const pendingCount = signups.filter(s => s.status === 'pending').length;
  const activeCount = signups.filter(s => s.status === 'active').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-red-600 mb-4">⚠️ {error}</div>
            <p className="text-gray-600 mb-4">Please make sure you are logged in as admin.</p>
            <button
              onClick={() => fetchSignups()}
              className="bg-[#6C67F2] text-white px-4 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#6C67F2] to-[#53C691] px-6 py-6">
            <h1 className="text-2xl font-bold text-white">Beta Signups</h1>
            <p className="text-white/80 mt-1">Manage beta testers and send invites</p>
          </div>

          <div className="p-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{signups.length}</div>
                <div className="text-sm text-blue-800">Total Signups</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
                <div className="text-sm text-yellow-800">Pending Invites</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{activeCount}</div>
                <div className="text-sm text-green-800">Active Testers</div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6 justify-between items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-[#6C67F2] text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-[#6C67F2] text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter('active')}
                  className={`px-4 py-2 rounded-lg ${filter === 'active' ? 'bg-[#6C67F2] text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Active
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search by email or name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg w-64"
                />
                <button
                  onClick={exportToCSV}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Export CSV
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Device</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Signed Up</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSignups.map((signup) => (
                    <tr key={signup.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <a href={`mailto:${signup.email}`} className="text-[#6C67F2] hover:underline">
                          {signup.email}
                        </a>
                       </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{signup.name || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {signup.deviceType && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100">
                            {signup.deviceType}
                          </span>
                        )}
                        {signup.deviceModel && (
                          <div className="text-xs text-gray-500 mt-1">{signup.deviceModel}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={signup.status}
                          onChange={(e) => updateStatus(signup.id, e.target.value)}
                          className={`text-sm px-2 py-1 rounded-full ${
                            signup.status === 'active' ? 'bg-green-100 text-green-800' :
                            signup.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(signup.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <a
                            href={`mailto:${signup.email}?subject=HelloAi%20Beta%20Invite`}
                            className="text-[#6C67F2] hover:underline text-sm"
                          >
                            Send Email
                          </a>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(signup.email);
                              alert('Email copied to clipboard');
                            }}
                            className="text-gray-500 hover:text-gray-700 text-sm"
                          >
                            Copy
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredSignups.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No beta signups found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}