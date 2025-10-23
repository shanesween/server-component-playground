import { NextResponse } from 'next/server';
import { getUser } from '@/lib/services/auth';

export async function GET() {
  try {
    const user = await getUser();
    
    if (user) {
      return NextResponse.json({ success: true, data: user });
    } else {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Get user API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}