import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { 
      email, 
      title, 
      description, 
      steps, 
      expectedResult, 
      actualResult, 
      severity, 
      deviceInfo, 
      appVersion,
      screenshots 
    } = await request.json();

    if (!email || !title || !description) {
      return NextResponse.json({ error: 'Email, title, and description are required' }, { status: 400 });
    }

    // Find beta tester
    const betaTester = await prisma.betaTester.findUnique({
      where: { email }
    });

    if (!betaTester) {
      return NextResponse.json({ error: 'You must be a beta tester to submit bug reports' }, { status: 403 });
    }

    const bugReport = await prisma.bugReport.create({
      data: {
        betaTesterId: betaTester.id,
        title,
        description,
        steps,
        expectedResult,
        actualResult,
        severity: severity || 'medium',
        deviceInfo,
        appVersion,
        screenshots: screenshots || []
      }
    });

    // Optional: Send notification email to admin
    // await sendBugReportNotification(bugReport);

    return NextResponse.json({
      success: true,
      bugId: bugReport.id,
      message: 'Bug report submitted successfully'
    });
  } catch (error) {
    console.error('Bug report error:', error);
    return NextResponse.json({ error: 'Failed to submit bug report' }, { status: 500 });
  }
}