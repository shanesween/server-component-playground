import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: (session.user as any).id,
        phoneNumber: (session.user as any).phoneNumber,
        firstName: (session.user as any).firstName,
        lastName: (session.user as any).lastName,
        displayName: (session.user as any).displayName,
        onboardingCompleted: (session.user as any).onboardingCompleted || false,
      }
    });

  } catch (error) {
    console.error('Error getting user data:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user data'
      },
      { status: 500 }
    );
  }
}