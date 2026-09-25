// app/page.tsx

import Link from 'next/link';
import Image from 'next/image';
import InstagramFeed from './components/InstagramFeed';

export default function Home() {
  // Replace with your Instagram username
  const INSTAGRAM_USERNAME = 'helloai_ucb';
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#6C67F2] via-[#8B88FF] to-[#53C691]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-6 py-20 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="text-yellow-400">✨</span>
              <span className="text-white text-sm font-medium">AI-Powered Language Learning</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6">
              Master Languages Through
              <span className="block text-[#53C691] mt-2">Real Conversations</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
              Hello Ai combines AI tutoring, interactive flashcards, and personalized quizzes to help you learn 8+ languages naturally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#features" className="bg-white text-[#6C67F2] px-8 py-3 rounded-full font-semibold hover:shadow-lg transition">
                Explore Features
              </Link>
              <Link href="https://www.instagram.com/p/DXgvbuoG3_n/?utm_source=ig_embed&ig_rid=e1030605-7eeb-4b8f-8858-f48bc3eac04c" className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition">
                Watch Demo
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#features" className="bg-white text-[#6C67F2] px-8 py-3 rounded-full font-semibold hover:shadow-lg transition">
                Explore Features
              </Link>
              <Link href="https://www.instagram.com/p/DXgvbuoG3_n/?utm_source=ig_embed&ig_rid=e1030605-7eeb-4b8f-8858-f48bc3eac04c" className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition">
                Watch Demo
              </Link>
              {/* Add this new button */}
              <Link href="/crowdfund" className="bg-[#53C691] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#45b07d] transition shadow-lg">
                Support on Crowdfund →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white/10 backdrop-blur-sm py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white">8+</div>
              <div className="text-white/80 mt-2">Languages</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">1,000+</div>
              <div className="text-white/80 mt-2">Flashcards</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-white/80 mt-2">Practice Quizzes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">Real-time</div>
              <div className="text-white/80 mt-2">Voice Conversations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Learn Smarter, Not Harder</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to master a new language in one intuitive app
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 - AI Tutor */}
            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-xl transition">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#6C67F2] to-[#8B88FF] rounded-full flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-3">AI Voice Tutor</h3>
              <p className="text-gray-600 text-center">
                Have natural conversations with an AI tutor that adapts to your skill level. Real-time voice recognition and text-to-speech for immersive practice.
              </p>
            </div>

            {/* Feature 2 - Flashcards */}
            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-xl transition">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FF8C00] to-[#FFB347] rounded-full flex items-center justify-center">
                  <span className="text-2xl">📇</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-3">Smart Flashcards</h3>
              <p className="text-gray-600 text-center">
                AI-generated flashcards tailored to your learning goals. Track your mastery and focus on words you struggle with.
              </p>
            </div>

            {/* Feature 3 - Quizzes */}
            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-xl transition">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#53C691] to-[#6EDBAF] rounded-full flex items-center justify-center">
                  <span className="text-2xl">📝</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-3">Personalized Quizzes</h3>
              <p className="text-gray-600 text-center">
                Test your knowledge with multiple-choice quizzes that adapt to your progress. Get instant explanations for wrong answers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Languages Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Languages You Can Learn</h2>
            <p className="text-xl text-gray-600">Start your journey with any of these 8 languages</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { lang: 'Spanish', emoji: '🇪🇸', color: '#c60b1e' },
              { lang: 'French', emoji: '🇫🇷', color: '#0055a4' },
              { lang: 'Japanese', emoji: '🇯🇵', color: '#bc002d' },
              { lang: 'Korean', emoji: '🇰🇷', color: '#cd2e3a' },
              { lang: 'German', emoji: '🇩🇪', color: '#000000' },
              { lang: 'Italian', emoji: '🇮🇹', color: '#009246' },
              { lang: 'English', emoji: '🇬🇧', color: '#00247d' },
              { lang: 'Chinese', emoji: '🇨🇳', color: '#de2910' },
            ].map((lang) => (
              <div key={lang.lang} className="bg-white rounded-xl p-4 text-center hover:shadow-md transition">
                <span className="text-4xl mb-2 block">{lang.emoji}</span>
                <span className="font-semibold text-gray-900">{lang.lang}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshot Showcase */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">See Hello Ai in Action</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Intuitive design that makes language learning feel natural
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Screenshot 1 - Call Screen */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="bg-[#6C67F2] p-4 flex justify-center">
                <div className="w-full max-w-[280px] aspect-[9/19] bg-gray-800 rounded-3xl overflow-hidden">
                  <div className="bg-[#1a1a2e] h-full flex flex-col">
                    <div className="bg-[#0f3460] p-3 flex justify-between items-center">
                      <div className="w-8 h-8 rounded-full bg-white/20" />
                      <div className="text-center">
                        <div className="text-white text-xs">00:00</div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/20" />
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center p-4">
                      <div className="w-32 h-32 rounded-full bg-[#2a2a3e] border-4 border-[#53C691] flex items-center justify-center mb-4">
                        <span className="text-5xl">👩‍🏫</span>
                      </div>
                      <div className="text-white text-center">
                        <div className="font-bold text-lg">Spanish Tutor</div>
                        <div className="text-sm text-gray-400">🎧 Listening</div>
                      </div>
                    </div>
                    <div className="bg-black/80 p-3">
                      <div className="bg-[#2a2a3e] rounded-lg p-2 mb-2">
                        <div className="text-white text-xs">Tutor: ¡Hola! ¿Cómo estás?</div>
                      </div>
                    </div>
                    <div className="p-3 bg-[#1a1a1a] flex gap-2">
                      <div className="flex-1 h-10 bg-gray-700 rounded-full" />
                      <div className="w-10 h-10 bg-[#007AFF] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-900">Voice Call Interface</h3>
                <p className="text-gray-600 text-sm mt-1">Real-time conversation with AI tutor</p>
              </div>
            </div>

            {/* Screenshot 2 - Topic Selection */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="bg-[#6C67F2] p-4 flex justify-center">
                <div className="w-full max-w-[280px] aspect-[9/19] bg-gray-800 rounded-3xl overflow-hidden">
                  <div className="bg-[#6C67F2] h-full flex flex-col">
                    <div className="p-3 flex justify-between">
                      <div className="flex gap-2">
                        <div className="w-20 h-8 bg-white/20 rounded-full" />
                        <div className="w-8 h-8 rounded-full bg-white/20" />
                      </div>
                    </div>
                    <div className="flex-1 overflow-auto p-3">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-3xl">🇪🇸</span>
                        <span className="text-white text-2xl font-bold">Spanish</span>
                      </div>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-[#1a1a1a] rounded-xl p-3 mb-3 border-l-4 border-[#53C691]">
                          <div className="flex justify-between items-center mb-2">
                            <div className="bg-[#53C691] px-2 py-0.5 rounded text-white text-xs">Grammar</div>
                          </div>
                          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                          <div className="h-3 bg-gray-800 rounded w-full mb-3" />
                          <div className="flex gap-2">
                            <div className="flex-1 h-8 bg-[#53C691] rounded-full" />
                            <div className="flex-1 h-8 bg-[#FF8C00] rounded-full" />
                            <div className="flex-1 h-8 bg-[#6C67F2] rounded-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-900">Topic Selection</h3>
                <p className="text-gray-600 text-sm mt-1">Choose topics and learning modes</p>
              </div>
            </div>

            {/* Screenshot 3 - Learning Stats */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="bg-[#6C67F2] p-4 flex justify-center">
                <div className="w-full max-w-[280px] aspect-[9/19] bg-gray-800 rounded-3xl overflow-hidden">
                  <div className="bg-[#1a1a1a] h-full flex flex-col">
                    <div className="p-3 border-b border-gray-800">
                      <div className="text-white font-bold text-center">📊 Your Learning Stats</div>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-[#2a2a2a] rounded-xl p-3 text-center">
                          <div className="text-2xl font-bold text-[#53C691]">15</div>
                          <div className="text-white text-xs">Hours</div>
                        </div>
                        <div className="bg-[#2a2a2a] rounded-xl p-3 text-center">
                          <div className="text-2xl font-bold text-[#53C691]">23</div>
                          <div className="text-white text-xs">Quizzes</div>
                        </div>
                      </div>
                      <div className="bg-[#2a2a2a] rounded-xl p-3 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">🇪🇸</span>
                          <span className="text-white font-semibold flex-1">Spanish</span>
                          <span className="text-[#53C691] text-sm">85%</span>
                        </div>
                        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                          <div className="w-[85%] h-full bg-[#53C691] rounded-full" />
                        </div>
                      </div>
                      <div className="bg-[#2a2a2a] rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">🇫🇷</span>
                          <span className="text-white font-semibold flex-1">French</span>
                          <span className="text-[#6C67F2] text-sm">62%</span>
                        </div>
                        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                          <div className="w-[62%] h-full bg-[#6C67F2] rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-900">Progress Tracking</h3>
                <p className="text-gray-600 text-sm mt-1">Monitor your learning journey</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6C67F2]/10 to-[#53C691]/10 rounded-full px-4 py-2 mb-4">
              <span className="text-2xl">📸</span>
              <span className="text-gray-700 font-medium">Follow our journey</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Stay Connected on Instagram</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get daily language tips, app updates, and learning inspiration
            </p>
          </div>

          <InstagramFeed username={INSTAGRAM_USERNAME} />
        </div>
      </section>

      {/* Testimonials / Call to Action */}
      <section className="py-20 bg-gradient-to-r from-[#6C67F2] to-[#53C691]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Speaking with Confidence?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join learners mastering new languages through real conversations, not just exercises.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#6C67F2] px-8 py-3 rounded-full font-semibold hover:shadow-lg transition">
              Get Started Free
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition">
              View GitHub
            </button>
          </div>
          <p className="text-white/70 text-sm mt-6">No credit card required • Free tier available</p>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-[#FF8C00] to-[#FFB347]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Help Us Build the Future of Language Learning
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Your support helps us launch on iOS, Android, and add more languages.
          </p>
          <Link
            href="/crowdfund"
            className="inline-flex items-center gap-2 bg-white text-[#FF8C00] px-8 py-3 rounded-full font-semibold hover:shadow-lg transition"
          >
            <span>Support Our Crowdfund</span>
            <span>→</span>
          </Link>
          <p className="text-white/80 text-sm mt-4">Goal: $20,000</p>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🗣️</span>
                <span className="font-bold text-xl">Hello Ai</span>
              </div>
              <p className="text-gray-400 text-sm mt-2">AI-Powered Language Learning</p>
            </div>
            <div className="flex gap-6">
              <Link href="#features" className="text-gray-400 hover:text-white transition">Features</Link>
              <Link href="#demo" className="text-gray-400 hover:text-white transition">Demo</Link>
              <Link href="/api/health" className="text-gray-400 hover:text-white transition">API Status</Link>
              <Link href="https://github.com/james-laskey/hello-ai" className="text-gray-400 hover:text-white transition">GitHub</Link>
              <Link href="/beta">Join Beta Program</Link>
              <Link href="/beta/bug-report">Report a Bug</Link>
              <Link href="/beta/feedback">Give Feedback</Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            © 2026 Hello Ai. Built with React Native, Next.js, and DeepSeek AI.
          </div>
        </div>
      </footer>
    </main>
  );
}