import { NextResponse } from 'next/server';
import { checkDatabaseConnection } from '@/lib/db';

export async function GET() {
    try {
        const result = await checkDatabaseConnection();
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            { connected: false, error: 'Database connection test failed' },
            { status: 500 }
        );
    }
}
