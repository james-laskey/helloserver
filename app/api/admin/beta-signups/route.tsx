import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Fetch all beta signups
export async function GET(request: NextRequest) {
  try {
    // You should add authentication here
    // For now, you can add a simple secret key check
    const authHeader = request.headers.get('authorization');
    const isValid = authHeader === `Bearer ${process.env.ADMIN_SECRET_KEY}`;
    
    // For development, you can skip auth. For production, uncomment the check below
    // if (!isValid && process.env.NODE_ENV === 'production') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const betaTesters = await prisma.betaTester.findMany({
      include: {
        bugReports: {
          select: { id: true }
        },
        feedback: {
          select: { id: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(betaTesters);
  } catch (error) {
    console.error('Error fetching beta signups:', error);
    return NextResponse.json({ error: 'Failed to fetch signups' }, { status: 500 });
  }
}

// PUT: Update beta tester status
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