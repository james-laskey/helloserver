// app/crowdfund/page.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import title from '../../public/images/title.png';
import why from '../../public/images/why.png';
import comparison from '../../public/images/comparison.png';
import screenshotA from '../../public/screenshots/callScreenA.png'
import screenshotB from '../../public/screenshots/FlashcardScreenA.png'
import screenshotC from '../../public/screenshots/QuizScreenA.png'
import creator from '../../public/images/creator.png'
import logo from '../../public/images/logo.png'
// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Stripe Payment Form Component with customer-entered amount
const StripePaymentForm = ({ 
  initialAmount, 
  rewardTierName, 
  onSuccess, 
  onError 
}: { 
  initialAmount: number | null;
  rewardTierName: string;
  onSuccess: () => void; 
  onError: (error: string) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [amount, setAmount] = useState<string>(initialAmount?.toString() || '');
  const [amountError, setAmountError] = useState('');

  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    const parts = numericValue.split('.');
    const formattedValue = parts[0] + (parts[1] !== undefined ? '.' + parts[1].slice(0, 2) : '');
    setAmount(formattedValue);
    setAmountError('');
  };

  const handleSuggestedAmount = (suggestedAmount: number) => {
    setAmount(suggestedAmount.toString());
    setAmountError('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) return;

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue < 1) {
      setAmountError('Please enter a valid amount (minimum $1)');
      return;
    }

    if (amountValue > 10000) {
      setAmountError('Amount cannot exceed $10,000');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: amountValue,
          rewardTierName,
        }),
      });

      const { clientSecret } = await response.json();

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (error) {
        onError(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        await fetch('/api/crowdfund/record-contribution', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: amountValue,
            rewardTier: rewardTierName,
            paymentIntentId: paymentIntent.id,
          }),
        });
        onSuccess();
      }
    } catch (err) {
      onError('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 font-medium mb-2">Choose a suggested amount</label>
        <div className="flex flex-wrap gap-2">
          {[10, 25, 50, 100].map((suggestedAmount) => (
            <button
              key={suggestedAmount}
              type="button"
              onClick={() => handleSuggestedAmount(suggestedAmount)}
              className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-[#53C691] hover:text-white transition"
            >
              ${suggestedAmount}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Or enter custom amount</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">$</span>
          <input
            type="text"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="0.00"
            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53C691] focus:border-transparent outline-none text-lg"
          />
        </div>
        {amountError && <p className="text-red-500 text-sm mt-1">{amountError}</p>}
        <p className="text-gray-500 text-xs mt-1">Minimum $1 • Maximum $10,000</p>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Card Details</label>
        <div className="bg-white rounded-lg p-4 border border-gray-300">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': { color: '#aab7c4' },
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                },
                invalid: { color: '#9e2146' },
              },
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing || !amount || parseFloat(amount) < 1}
        className="w-full bg-[#635BFF] text-white py-3 rounded-lg font-semibold hover:bg-[#4a42cc] transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Processing...
          </div>
        ) : (
          `Contribute ${amount ? `$${parseFloat(amount).toFixed(2)}` : ''}`
        )}
      </button>
      
      <p className="text-xs text-gray-500 text-center">
        Your contribution supports the development of Hello Ai language learning app
      </p>
    </form>
  );
};

// Main Crowdfund Page Component
export default function CrowdfundPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const fundingGoal = 20000;
  const currentFunding = 0;
  const fundingPercentage = (currentFunding / fundingGoal) * 100;
  const backersCount = 0;

  const rewardTiers = [
    {
      id: 1,
      name: 'Early Language Learner',
      amount: 10,
      description: 'Access to the full app for 3 months + name on website supporter list',
      popular: false,
    },
    {
      id: 2,
      name: 'Language Enthusiast',
      amount: 25,
      description: '6 months full access + sticker pack + name on website',
      popular: true,
    },
    {
      id: 3,
      name: 'Fluent Speaker',
      amount: 50,
      description: '1 year full access + exclusive founders badge + sticker pack + T-shirt',
      popular: false,
    },
    {
      id: 4,
      name: 'Language Master',
      amount: 100,
      description: 'Lifetime access + all rewards + name in app credits',
      popular: false,
    },
  ];

  const appFeatures = [
    {
      title: 'AI Voice Tutor',
      description: 'Natural conversations with an AI tutor that adapts to your skill level.',
      icon: '🤖',
    },
    {
      title: 'Smart Flashcards',
      description: 'AI-generated flashcards tailored to your learning goals.',
      icon: '📇',
    },
    {
      title: 'Personalized Quizzes',
      description: 'Multiple-choice quizzes that adapt to your progress.',
      icon: '📝',
    },
    {
      title: '8+ Languages',
      description: 'Spanish, French, Japanese, Korean, German, Italian, English, Chinese.',
      icon: '🌍',
    },
    {
      title: 'Voice Recognition',
      description: 'Real-time pronunciation feedback and conversation practice.',
      icon: '🎙️',
    },
    {
      title: 'Progress Tracking',
      description: 'Detailed analytics to track your learning journey.',
      icon: '📊',
    },
  ];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const getDisplayAmount = () => {
    if (customAmount) return parseInt(customAmount);
    if (selectedAmount) return selectedAmount;
    return null;
  };

  const handleVenmoPayment = () => {
    const amount = getDisplayAmount();
    if (!amount) {
      alert('Please select or enter a contribution amount');
      return;
    }
    window.location.href = `https://venmo.com/helloaifund?txn=pay&amount=${amount}&note=Hello%20Ai%20Crowdfund`;
  };

  const handleZellePayment = () => {
    const amount = getDisplayAmount();
    if (!amount) {
      alert('Please select or enter a contribution amount');
      return;
    }
    alert(`Please send $${amount} via Zelle to: james.laskey23@gmail.com\n\nAfter sending, please email your confirmation to helloai.operations@gmail.com with your selected reward tier.`);
    setShowSuccess(true);
  };

  const handleStripeSuccess = () => {
    setShowSuccess(true);
  };

  const handleStripeError = (error: string) => {
    alert(`Payment failed: ${error}`);
  };

  const handlePaymentMethodSelect = (method: string) => {
    const amount = getDisplayAmount();
    if (!amount) {
      alert('Please select or enter a contribution amount first');
      return;
    }
    setSelectedPaymentMethod(method);
  };

  const renderPaymentForm = () => {
    const amount = getDisplayAmount();
    if (!amount) return null;

    const selectedTier = rewardTiers.find(t => t.amount === selectedAmount);
    const rewardTierName = selectedTier?.name || 'Custom Contribution';

    if (selectedPaymentMethod === 'venmo') {
      return (
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-4">You'll be redirected to Venmo to complete your payment.</p>
          <button
            onClick={handleVenmoPayment}
            className="w-full bg-[#008CFF] text-white py-3 rounded-lg font-semibold hover:bg-[#0070cc] transition"
          >
            Continue to Venmo
          </button>
        </div>
      );
    }

    if (selectedPaymentMethod === 'zelle') {
      return (
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-4">You'll see Zelle instructions to complete your payment.</p>
          <button
            onClick={handleZellePayment}
            className="w-full bg-[#6C67F2] text-white py-3 rounded-lg font-semibold hover:bg-[#5a55d1] transition"
          >
            Get Zelle Instructions
          </button>
        </div>
      );
    }

    if (selectedPaymentMethod === 'stripe') {
      return (
        <div className="mt-6">
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-600 text-center">Your support helps bring AI language learning to everyone</p>
          </div>
          <Elements stripe={stripePromise}>
            <StripePaymentForm 
              initialAmount={selectedAmount || null}
              rewardTierName={rewardTierName}
              onSuccess={handleStripeSuccess}
              onError={handleStripeError}
            />
          </Elements>
        </div>
      );
    }

    return null;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#6C67F2] via-[#8B88FF] to-[#53C691]">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <Link href="/" className="text-white text-xl font-bold flex items-center gap-2">
            <Image
                        src={logo}
                        alt="App screenshot"
                        height={75}
                        />
            Hello Ai
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Help Us Bring AI Language
            <span className="block text-[#53C691]">Learning to Everyone</span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Join our mission to make language learning accessible through real AI conversations.
          </p>
          
          {/* Funding Progress */}
          <div className="max-w-2xl mx-auto bg-white/10 rounded-2xl p-6 mb-8">
            <div className="flex justify-between text-white mb-2">
              <span className="font-semibold">Goal: ${fundingGoal.toLocaleString()}</span>
              <span className="font-semibold">{fundingPercentage.toFixed(0)}% Funded</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-4 mb-4">
              <div className="bg-[#53C691] h-4 rounded-full transition-all duration-500" style={{ width: `${fundingPercentage}%` }} />
            </div>
            <p className="text-white/80">{backersCount} backers</p>
          </div>
        </div>
      </section>

      {/* Two-Column Layout: Left (Features + Creator) | Right (Reward Tiers + Payment) */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* LEFT COLUMN - Scrolling Features & Creator Info */}
            <div className="space-y-8 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
              
              {/* Creator Section */}
              <div className="bg-gradient-to-br from-[#6C67F2]/10 to-[#53C691]/10 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6C67F2] to-[#53C691] flex items-center justify-center">
                    <Image
                        src={creator}
                        alt="App screenshot"
                        width={ 100}
                        height={100}
                        />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">James Laskey</h3>
                    <p className="text-gray-600">Creator & Developer</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  I'm a full-stack developer and former personal trainer turned software engineer. 
                  I built Hello Ai to combine my passion for language learning with cutting-edge AI technology. 
                  With your support, I can dedicate more time to developing features and bringing this app to 
                  learners worldwide.
                </p>
              </div>

              {/* App Features Section */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-3xl">✨</span> App Features
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {appFeatures.map((feature, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition">
                      <div className="text-3xl mb-2">{feature.icon}</div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Screenshot Placeholders */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-3xl">📱</span> App Preview
                </h2>
                <div>
                    <Image
                        src={title}
                        alt="App screenshot"
                        width={ 600}
                        height={600}
                        />
                        <Image
                        src={comparison}
                        alt="App screenshot"
                        width={600}
                        height={600}
                        />
                        <Image
                        src={why}
                        alt="App screenshot"
                        width={600}
                        height={600}
                        />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {/* Placeholder images - replace with actual screenshots */}
                  <div className="aspect-[9/19] bg-gray-200 rounded-xl flex items-center justify-center">
                    <Image
                        src={screenshotA}
                        alt="App screenshot"
                        />
                  </div>
                  <div className="aspect-[9/19] bg-gray-200 rounded-xl flex items-center justify-center">
                    <Image
                        src={screenshotB}
                        alt="App screenshot"
                        />
                  </div>
                  <div className="aspect-[9/19] bg-gray-200 rounded-xl flex items-center justify-center">
                    <Image
                        src={screenshotC}
                        alt="App screenshot"
                        />
                  </div>
                </div>
              </div>

              {/* Fund Usage Breakdown */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Where Your Money Goes</h2>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">iOS Development (MacBook)</span>
                      <span className="font-semibold text-gray-900">$2,500</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#6C67F2] h-2 rounded-full" style={{ width: '12.5%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">Server Infrastructure</span>
                      <span className="font-semibold text-gray-900">$2,000</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#6C67F2] h-2 rounded-full" style={{ width: '10%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">AI API Expenses</span>
                      <span className="font-semibold text-gray-900">$1,000</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#6C67F2] h-2 rounded-full" style={{ width: '5%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">Internal Expansion</span>
                      <span className="font-semibold text-gray-900">$14,500</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#6C67F2] h-2 rounded-full" style={{ width: '72.5%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - Reward Tiers & Payment */}
            <div className="space-y-8">
              {/* Reward Tiers */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Choose Your Reward Tier</h2>
                <div className="space-y-4">
                  {rewardTiers.map((tier) => (
                    <div
                      key={tier.id}
                      className={`rounded-2xl p-5 transition-all cursor-pointer border-2 ${
                        selectedAmount === tier.amount
                          ? 'border-[#53C691] bg-gradient-to-br from-[#6C67F2]/5 to-[#53C691]/5 shadow-lg'
                          : 'border-gray-200 bg-white hover:shadow-md'
                      }`}
                      onClick={() => handleAmountSelect(tier.amount)}
                    >
                      {tier.popular && (
                        <span className="inline-block bg-[#FF8C00] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                          Most Popular
                        </span>
                      )}
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{tier.description}</p>
                        </div>
                        <p className="text-3xl font-bold text-[#53C691]">${tier.amount}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Custom Amount */}
                  <div className="rounded-2xl p-5 border-2 border-gray-200 bg-white">
                    <p className="text-gray-700 mb-3 text-center">Or enter a custom amount:</p>
                    <div className="inline-flex items-center border-2 border-gray-300 rounded-lg overflow-hidden w-full">
                      <span className="bg-gray-100 px-4 py-2 text-gray-700 font-semibold">$</span>
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                        placeholder="Custom amount"
                        className="px-4 py-2 flex-1 outline-none"
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Select Payment Method</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => handlePaymentMethodSelect('venmo')}
                    className={`w-full flex items-center justify-center gap-3 p-3 rounded-xl transition-all ${
                      selectedPaymentMethod === 'venmo'
                        ? 'bg-gradient-to-r from-[#008CFF] to-[#6C67F2] text-white shadow-lg'
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:shadow-md'
                    }`}
                  >
                    <span className="text-2xl">💚</span>
                    <span className="font-semibold text-lg">Pay with Venmo</span>
                    <span className="text-sm opacity-75">@helloaifund</span>
                  </button>

                  <button
                    onClick={() => handlePaymentMethodSelect('zelle')}
                    className={`w-full flex items-center justify-center gap-3 p-3 rounded-xl transition-all ${
                      selectedPaymentMethod === 'zelle'
                        ? 'bg-gradient-to-r from-[#6C67F2] to-[#53C691] text-white shadow-lg'
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:shadow-md'
                    }`}
                  >
                    <span className="text-2xl">🏦</span>
                    <span className="font-semibold text-lg">Pay with Zelle</span>
                    <span className="text-sm opacity-75">james.laskey23@gmail.com</span>
                  </button>

                  <button
                    onClick={() => handlePaymentMethodSelect('stripe')}
                    className={`w-full flex items-center justify-center gap-3 p-3 rounded-xl transition-all ${
                      selectedPaymentMethod === 'stripe'
                        ? 'bg-gradient-to-r from-[#635BFF] to-[#008CFF] text-white shadow-lg'
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:shadow-md'
                    }`}
                  >
                    <span className="text-2xl">💳</span>
                    <span className="font-semibold text-lg">Pay with Credit Card (Coming Soon)</span>
                    <span className="text-sm opacity-75">Stripe</span>
                  </button>
                </div>

                {/* Payment Form */}
                {selectedPaymentMethod && renderPaymentForm()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">When will I get access?</h3>
              <p className="text-gray-600">Alpha access begins immediately after campaign ends. Full release expected within 60 days.</p>
            </div>
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">Venmo (@helloaifund), Zelle (james.laskey23@gmail.com), and credit cards via Stripe.</p>
            </div>
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Is there a refund policy?</h3>
              <p className="text-gray-600">All contributions are final but directly support development. Contact us with any concerns.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You for Your Support!</h3>
            <p className="text-gray-600 mb-6">We've received your pledge and will email you with next steps.</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="inline-block bg-[#53C691] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#45b07d] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm">© 2026 Hello Ai. All rights reserved.</p>
        </div>
      </footer>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #53C691;
          border-radius: 10px;
        }
      `}</style>
    </main>
  );
}