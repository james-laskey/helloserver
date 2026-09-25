// app/api/stripe/create-payment-intent/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { amount, rewardTierName } = await req.json();

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: 'Please enter a valid amount' },
        { status: 400 }
      );
    }

    // Create payment intent with your existing product
    // The amount is determined by the customer
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents and ensure integer
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        product_id: 'prod_US4b0ZB7hQlQwZ',
        reward_tier: rewardTierName || 'custom',
        customer_entered_amount: amount.toString(),
      },
      // Optional: Add a description that shows on the customer's statement
      description: `Hello Ai Language App - ${rewardTierName || 'Custom Contribution'}`,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}