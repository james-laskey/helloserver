import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ✅ ADD THIS - This handles the actual signup
export async function POST(request: NextRequest) {
  try {
    const { email, name, deviceType, deviceModel, osVersion } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if already signed up
    const existing = await prisma.betaTester.findUnique({
      where: { email }
    });

    if (existing) {
      return NextResponse.json({ 
        message: 'You are already on our beta list!' 
      });
    }

    // Create beta tester entry
    await prisma.betaTester.create({
      data: {
        email,
        name,
        deviceType,
        deviceModel,
        osVersion,
        status: 'pending'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for joining the beta! We will contact you soon.'
    });
  } catch (error) {
    console.error('Beta signup error:', error);
    return NextResponse.json({ error: 'Failed to sign up for beta' }, { status: 500 });
  }
}

// For admin dashboard - get all signups
export async function GET(request: NextRequest) {
  try {
    const betaTesters = await prisma.betaTester.findMany({
      include: {
        bugReports: { select: { id: true } },
        feedback: { select: { id: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(betaTesters);
  } catch (error) {
    console.error('Error fetching beta signups:', error);
    return NextResponse.json({ error: 'Failed to fetch signups' }, { status: 500 });
  }
}

// For admin dashboard - update status
export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updated = await prisma.betaTester.update({
      where: { id },
      data: { 
        status,
        joinedAt: status === 'active' ? new Date() : undefined
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating beta tester:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}