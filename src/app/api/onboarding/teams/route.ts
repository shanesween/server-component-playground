import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userToTeam } from '@/lib/db/schema';
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

        const { teamIds } = await request.json();

        if (!teamIds || !Array.isArray(teamIds) || teamIds.length === 0) {
            return NextResponse.json(
                { success: false, error: 'At least one team must be selected' },
                { status: 400 }
            );
        }

        // Clear existing team selections for this user
        await db
            .delete(userToTeam)
            .where(eq(userToTeam.userId, (session.user as any).id));

        // Insert new team selections
        const teamSelections = teamIds.map((teamId: number) => ({
            userId: (session.user as any).id,
            teamId: teamId,
            sport: 'nfl',
        }));

        await db.insert(userToTeam).values(teamSelections);

        return NextResponse.json({
            success: true,
            message: `Successfully saved ${teamIds.length} favorite team${teamIds.length !== 1 ? 's' : ''}`,
            count: teamIds.length,
        });

    } catch (error) {
        console.error('Error saving favorite teams:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to save favorite teams'
            },
            { status: 500 }
        );
    }
}
