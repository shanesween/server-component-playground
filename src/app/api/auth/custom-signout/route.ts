import { NextResponse } from 'next/server';
import { signOut } from '@/lib/services/auth';

export async function POST() {
  try {
    const result = await signOut();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Signout API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}