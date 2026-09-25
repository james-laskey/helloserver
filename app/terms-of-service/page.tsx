// app/terms-of-service/page.tsx

import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | HelloAi Language Tutor',
  description: 'Terms of service for HelloAi - AI-powered language learning app',
};

export default function TermsOfService() {
  const effectiveDate = 'May 21, 2025';

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#6C67F2] via-[#8B88FF] to-[#53C691] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#6C67F2] to-[#53C691] px-6 py-8">
            <h1 className="text-3xl font-bold text-white text-center">Terms of Service</h1>
            <p className="text-white/80 text-center mt-2">HelloAi Language Tutor</p>
          </div>
          
          <div className="p-6 md:p-8 space-y-6 text-gray-700">
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500">
              <p><strong>Effective Date:</strong> {effectiveDate}</p>
            </div>

            <section>
              <h2 className="text-xl font-semibold text-[#6C67F2] mb-3">1. Acceptance of Terms</h2>
              <p>
                By downloading, accessing, or using the HelloAI mobile application ("App"), you agree to be bound 
                by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the App.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#6C67F2] mb-3">2. Description of Service</h2>
              <p>
                HelloAI provides AI-powered language learning services, including interactive tutoring sessions, 
                flashcard generation, quizzes, and progress tracking across multiple languages.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#6C67F2] mb-3">3. User Accounts</h2>
              <p>You must create an account to use our services. You agree to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Be responsible for all activities under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#6C67F2] mb-3">4. Subscriptions and Payments</h2>
              <p>
                HelloAi offers a free tier with limited features and premium subscriptions for full access. 
                Subscription fees are billed in advance on a recurring basis. You may cancel anytime through 
                your account settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#6C67F2] mb-3">5. Refund Policy</h2>
              <p>
                Due to the digital nature of our services, all subscription purchases are non-refundable. 
                You may cancel your subscription at any time to prevent future charges.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#6C67F2] mb-3">6. Acceptable Use Policy</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Use the App for any illegal purpose</li>
                <li>Attempt to reverse engineer or extract source code</li>
                <li>Interfere with or disrupt the App's functionality</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Use automated scripts to interact with the App</li>
                <li>Share your account credentials with others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#6C67F2] mb-3">7. Intellectual Property</h2>
              <p>
                All content, features, and functionality of the App are owned by HelloAi and are protected by 
                copyright, trademark, and other intellectual property laws. You may not copy, modify, or distribute 
                any content without our prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#6C67F2] mb-3">8. User-Generated Content</h2>
              <p>
                You retain ownership of content you create within the App. By submitting content, you grant us 
                a license to use, store, and display that content for the purpose of providing our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#6C67F2] mb-3">9. Termination</h2>
              <p>
                We may terminate or suspend your account immediately for violations of these Terms. You may delete 
                your account at any time through the App settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#6C67F2] mb-3">10. Disclaimer of Warranties</h2>
              <p>
                The App is provided "as is" without warranties of any kind. We do not guarantee that the App will 
                be uninterrupted or error-free, or that your language learning outcomes will meet your expectations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#6C67F2] mb-3">11. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, HelloAi shall not be liable for any indirect, incidental, 
                or consequential damages arising from your use of the App.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#6C67F2] mb-3">12. Governing Law</h2>
              <p>
                These Terms shall be governed by the laws of the State of Delaware, without regard to its conflict 
                of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#6C67F2] mb-3">13. Changes to Terms</h2>
              <p>
                We may modify these Terms at any time. Continued use of the App after changes constitutes acceptance 
                of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#6C67F2] mb-3">14. Contact</h2>
              <p>For questions about these Terms, contact us at <strong>legal@helloai.com</strong>.</p>
            </section>

            <div className="border-t border-gray-200 pt-6 mt-6 text-center text-sm text-gray-500">
              <p>By using HelloAI, you agree to these Terms of Service.</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-white/70 text-sm">
          <Link href="/" className="hover:text-white transition mx-2">Home</Link>
          <span>•</span>
          <Link href="/privacy-policy" className="hover:text-white transition mx-2">Privacy Policy</Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-white transition mx-2">Contact</Link>
        </div>
      </div>
    </main>
  );
}