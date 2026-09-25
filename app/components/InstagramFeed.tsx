// app/components/InstagramFeed.tsx
'use client';

import Script from 'next/script';
import Link from 'next/link';
import { useState } from 'react';

// Declare the Instagram global type
declare global {
  interface Window {
    instgrm: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

interface InstagramPost {
  id: string;
  url: string;
  caption?: string;
}

interface InstagramFeedProps {
  username: string;
  posts?: InstagramPost[]; // Optional array of specific posts to display
  showLatest?: boolean; // If true, shows the latest post from the profile
}

export default function InstagramFeed({ username, posts = [], showLatest = false }: InstagramFeedProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const handleScriptLoad = () => {
    setScriptLoaded(true);
    // Process any existing embed blocks after script loads
    if (typeof window !== 'undefined' && window.instgrm?.Embeds) {
      window.instgrm.Embeds.process();
    }
  };

  // Default posts to display if none provided (replace with your actual post URLs)
  const defaultPosts: InstagramPost[] = [
    {
      id: 'post1',
      url: 'https://www.instagram.com/p/DXV61nmD_Xk/',
      caption: 'Just saying hello! 🎉'
    },
    {
      id: 'post2',
      url: 'https://www.instagram.com/p/DXe2kcmD3Yf/',
      caption: 'Voice Conversations with AI 🤖💬'
    },
    {
      id: 'post3',
      url: 'https://www.instagram.com/p/DXgvbuoG3_n/?img_index=1',
      caption: 'Features Sneak Peek 👀✨'
    }
  ];

  const displayPosts = posts.length > 0 ? posts : defaultPosts;

  return (
    <>
      <Script 
        src="https://www.instagram.com/embed.js" 
        strategy="lazyOnload"
        onLoad={handleScriptLoad}
      />
      
      <div className="space-y-8">
        {/* Profile Header */}
        <div className="flex justify-center">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#833AB4] via-[#E4405F] to-[#F56040] flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">🤖</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">@{username}</p>
                  <p className="text-sm text-gray-500">AI Language Tutor</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specific Instagram Posts Display */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {displayPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform transition hover:scale-105">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#833AB4] via-[#E4405F] to-[#F56040] flex items-center justify-center">
                    <span className="text-white text-xs font-bold">IG</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">@{username}</p>
                  </div>
                </div>
                
                {/* Instagram Post Embed */}
                <blockquote 
                  className="instagram-media" 
                  data-instgrm-permalink={post.url}
                  data-instgrm-version="14"
                  style={{ 
                    background: 'transparent', 
                    border: 0, 
                    margin: 0, 
                    padding: 0,
                    minWidth: '100%',
                    width: '100%'
                  }}
                >
                  <div style={{ 
                    background: '#fafafa', 
                    border: '1px solid #dbdbdb', 
                    borderRadius: '12px', 
                    padding: '16px',
                    textAlign: 'center',
                    fontFamily: 'Arial, sans-serif'
                  }}>
                    <p style={{ margin: 0, color: '#8a8a8a', fontSize: '14px' }}>
                      📸 View on Instagram
                    </p>
                    {post.caption && (
                      <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
                        {post.caption}
                      </p>
                    )}
                  </div>
                </blockquote>
              </div>
            </div>
          ))}
        </div>

        {/* Latest Post Section - Optional */}
        {showLatest && (
          <div className="flex justify-center mt-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#833AB4] via-[#E4405F] to-[#F56040] flex items-center justify-center">
                    <span className="text-white text-sm font-bold">📸</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Latest Post</p>
                    <p className="text-xs text-gray-500">Most recent from Instagram</p>
                  </div>
                </div>
                
                <blockquote 
                  className="instagram-media" 
                  data-instgrm-permalink={`https://www.instagram.com/${username}/`}
                  data-instgrm-version="14"
                  style={{ background: 'transparent', border: 0, margin: 0, padding: 0 }}
                >
                  <div style={{ 
                    background: '#fafafa', 
                    border: '1px solid #dbdbdb', 
                    borderRadius: '12px', 
                    padding: '24px',
                    textAlign: 'center'
                  }}>
                    <p style={{ margin: 0, color: '#8a8a8a' }}>
                      📸 Loading latest post from @{username}...
                    </p>
                  </div>
                </blockquote>
              </div>
            </div>
          </div>
        )}

        {/* Follow Button */}
        <div className="text-center mt-8">
          <Link 
            href={`https://instagram.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#833AB4] via-[#E4405F] to-[#F56040] text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition transform hover:scale-105"
          >
            <span>Follow @helloai_ucb</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </>
  );
}