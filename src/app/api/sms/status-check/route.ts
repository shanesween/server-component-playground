import { NextResponse } from 'next/server';
import { getSMSServiceStatus } from '@/lib/services/sms';

/**
 * Check SMS service configuration status
 * Useful for debugging and monitoring
 */
export async function GET() {
    try {
        const status = getSMSServiceStatus();

        return NextResponse.json({
            success: true,
            smsService: status,
            environment: process.env.NODE_ENV,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('SMS status check error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to check SMS service status' },
            { status: 500 }
        );
    }
}
