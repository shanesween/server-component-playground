import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';

export async function POST(request: NextRequest) {
    try {
        // Get the NextAuth session
        const session = await getServerSession(authConfig);

        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: 'Authentication required' },
                { status: 401 }
            );
        }

        const { firstName } = await request.json();

        if (!firstName) {
            return NextResponse.json(
                { success: false, error: 'First name is required' },
                { status: 400 }
            );
        }

        // Update user with first name and mark onboarding as completed
        await db
            .update(users)
            .set({
                firstName: firstName,
                displayName: firstName,
                onboardingCompleted: true,
                updatedAt: new Date(),
            })
            .where(eq(users.id, (session.user as any).id));

        return NextResponse.json({
            success: true,
            message: 'Onboarding completed successfully',
        });

    } catch (error) {
        console.error('Error completing onboarding:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to complete onboarding'
            },
            { status: 500 }
        );
    }
}
