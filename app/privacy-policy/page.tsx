// app/privacy-policy/page.tsx

import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | HelloAI Language Tutor',
  description: 'Privacy policy for HelloAI - AI-powered language learning app',
};

export default function PrivacyPolicy() {
  const lastUpdated = 'May 21, 2025';
  const effectiveDate = 'May 21, 2025';

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#6C67F2] via-[#8B88FF] to-[#53C691] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#6C67F2] to-[#53C691] px-6 py-8">
            <h1 className="text-3xl font-bold text-white text-center">Privacy Policy</h1>
            <p className="text-white/80 text-center mt-2">HelloAI Language Tutor</p>
          </div>
          
          <div className="p-6 md:p-8 space-y-6 text-gray-700">
            {/* Last Updated */}
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500">
              <p><strong>Last Updated:</strong> {lastUpdated}</p>
            </div>

            {/* 1. Introduction */}
            <section>
              <h2 className="text-xl font-semibold text-[#6C67F2] mb-3">1. Introduction</h2>
              <p className="mb-2">
                Welcome to HelloAi ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, 
                and safeguard your information when you use our mobile application HelloAi (the "App") and our website 
                at helloai.com (the "Site").
              </p>
              <p>
                We are committed to protecting your privacy and ensuring you have a positive experience using our 
                language learning services. Please read this Privacy Policy carefully. By accessing or using our 
                services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.
              </p>
            </section>

            {/* 2. Information We Collect */}
            <section>
              <h2 className="text-xl font-semibold text-[#6C67F2] mb-3">2. Information We Collect</h2>
              
              <h3 className="font-semibold text-gray-800 mt-3 mb-2">2.1 Personal Information You Provide</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Name and email address (for account creation)</li>
                <li>Native language and target language preferences</li>
                <li>Proficiency level and learning goals</li>
                <li>Learning style preferences</li>
                <li>Payment information (processed by third-party payment processors)</li>
              </ul>

              <h3 className="font-semibold text-gray-800 mt-3 mb-2">2.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Device information (model, operating system, unique device identifiers)</li>
                <li>Usage data (features accessed, time spent, learning progress)</li>
                <li>Voice recordings (only during active tutoring sessions)</li>
                <li>Chat transcripts and conversation history</li>
                <li>Quiz results and flashcard mastery data</li>
                <li>IP address and network information</li>
              </ul>

              <h3 className="font-semibold text-gray-800 mt-3 mb-2">2.3 AI-Generated Data</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Flashcard sets generated for you</li>
                <li>Quiz questions and your answers</li>
                <li>Personalized lesson content</li>
                <li>Grammar corrections and feedback</li>
              </ul>
            </section>

            {/* 3. How We Use Your Information */}
            <section>
              <h2 className="text-xl font-semibold text-[#6C67F2] mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>To provide, personalize, and improve our language learning services</li>
                <li>To generate AI-powered flashcards and quizzes tailored to your level</li>
                <li>To process voice recognition and provide pronunciation feedback</li>
                <li>To track your learning progress and generate statistics</li>
                <li>To communicate with you about your account and updates</li>
                <li>To respond to customer support inquiries</li>
                <li>To detect, prevent, and address technical issues</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            {/* 4. AI and Third-Party Services */}
            <section>
              <h2 className="text-xl font-semibold text-[#6C67F2] mb-3">4. AI and Third-Party Services</h2>
              <p className="mb-2">
                HelloAi uses third-party AI services (including DeepSeek API) to power our language tutoring features. 
                When you interact with the AI tutor:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Your messages and conversation context are sent to the AI service provider</li>
                <li>These providers may process your data according to their own privacy policies</li>
                <li>We do not allow AI providers to use your data for training their models unless explicitly stated</li>
              </ul>
              <p className="mt-2">
                We also use the following third-party services:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Google AdMob</strong> - For displaying advertisements (only after completing quizzes/flashcards)</li>
                <li><strong>Vercel</strong> - For hosting our backend services</li>
                <li><strong>PostgreSQL</strong> - For secure database storage</li>
                <li><strong>Expo</strong> - For app development and updates</li>
              </ul>
            </section>

            {/* 5. Advertising */}
            <section>
              <h2 className="text-xl font-semibold text-[#6C67F2] mb-3">5. Advertising</h2>
              <p>
                HelloAi displays interstitial advertisements after you complete quizzes or flashcard sessions. 
                We use Google AdMob to serve these ads. AdMob may collect and use your advertising ID to serve 
                personalized ads. You can reset your advertising ID or opt out of personalized ads in your 
                device settings.
              </p>
              <p className="mt-2">
                <strong>Children's Privacy:</strong> Our app is intended for general audiences. We do not knowingly 
                collect personal information from children under 13. If you believe a child has provided us with 
                personal information, please contact us.
              </p>
            </section>

            {/* 6. Data Retention */}
            <section>
              <h2 className="text-xl font-semibold text-[#6C67F2] mb-3">6. Data Retention</h2>
              <p>
                We retain your personal information for as long as your account is active or as needed to provide 
                you with our services. We may retain certain information after account deletion for legal compliance, 
                fraud prevention, and legitimate business purposes. Conversation logs are retained for 30 days after 
                account deletion.
              </p>
            </section>

            {/* 7. Data Security */}
            <section>
              <h2 className="text-xl font-semibold text-[#6C67F2] mb-3">7. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information, 
                including encryption in transit (TLS) and at rest. However, no method of transmission over the Internet 
                or electronic storage is 100% secure. While we strive to protect your personal information, we cannot 
                guarantee its absolute security.
              </p>
            </section>

            {/* 8. Your Rights */}
            <section>
              <h2 className="text-xl font-semibold text-[#6C67F2] mb-3">8. Your Rights</h2>
              <p>Depending on your location, you may have the following rights regarding your personal information:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Opt-out:</strong> Opt out of data collection for advertising purposes</li>
              </ul>
              <p className="mt-2">
                To exercise these rights, please contact us at <strong>privacy@helloai.com</strong>.
              </p>
            </section>

            {/* 9. International Data Transfers */}
            <section>
              <h2 className="text-xl font-semibold text-[#6C67F2] mb-3">9. International Data Transfers</h2>
              <p>
                Your information may be transferred to and maintained on servers located outside your state, province, 
                country, or other governmental jurisdiction where data protection laws may differ. By using our services, 
                you consent to the transfer of your data to the United States and other countries where we operate.
              </p>
            </section>

            {/* 10. Changes to This Privacy Policy */}
            <section>
              <h2 className="text-xl font-semibold text-[#6C67F2] mb-3">10. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
                new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this 
                Privacy Policy periodically for any changes.
              </p>
            </section>

            {/* 11. Contact Information */}
            <section>
              <h2 className="text-xl font-semibold text-[#6C67F2] mb-3">11. Contact Information</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at:</p>
              <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                <p><strong>Email:</strong> privacy@helloai.com</p>
                <p><strong>Website:</strong> helloai.com/contact</p>
                <p><strong>Address:</strong> [Your Business Address]</p>
              </div>
            </section>

            {/* 12. California Privacy Rights */}
            <section>
              <h2 className="text-xl font-semibold text-[#6C67F2] mb-3">12. California Privacy Rights (CCPA)</h2>
              <p>
                If you are a California resident, you have the right to request information about how we share your 
                personal information with third parties. California residents may also request the specific pieces of 
                personal information we have collected. To make such a request, please contact us at privacy@helloai.com.
              </p>
            </section>

            {/* GDPR Notice */}
            <section>
              <h2 className="text-xl font-semibold text-[#6C67F2] mb-3">13. GDPR Notice (For EEA Users)</h2>
              <p>
                If you are located in the European Economic Area, you have the right to lodge a complaint with your 
                local data protection authority. Our legal basis for processing your personal information is your 
                consent and our legitimate interest in providing our services.
              </p>
            </section>
            <section>
            <h2 className="text-xl font-semibold text-[#6C67F2] mb-3">14. Account Deletion</h2>
            <p>
                You have the right to delete your account at any time. To request account deletion:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Visit our <Link href="/delete-account" className="text-[#6C67F2] hover:underline">Account Deletion Page</Link></li>
                <li>Enter your email address and password to verify your identity</li>
                <li>Confirm by typing "DELETE MY ACCOUNT"</li>
            </ul>
            <p className="mt-2">
                Upon deletion, all your personal data, conversation history, flashcards, and quiz results will be 
                permanently removed from our systems within 48 hours.
            </p>
            </section>

            <div className="border-t border-gray-200 pt-6 mt-6 text-center text-sm text-gray-500">
              <p>By using HelloAi, you agree to this Privacy Policy.</p>
              <p className="mt-2">© {new Date().getFullYear()} HelloAI. All rights reserved.</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="text-center mt-6 text-white/70 text-sm">
          <Link href="/" className="hover:text-white transition mx-2">Home</Link>
          <span>•</span>
          <Link href="/terms-of-service" className="hover:text-white transition mx-2">Terms of Service</Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-white transition mx-2">Contact</Link>
        </div>
      </div>
    </main>
  );
}