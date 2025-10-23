import { NextRequest, NextResponse } from 'next/server';
import { sendSMSVerificationCode, getSMSServiceStatus, formatPhoneNumber } from '@/lib/services/sms';

/**
 * Test SMS service endpoint
 * Only available in development mode
 */
export async function POST(request: NextRequest) {
    // Only allow in development
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json(
            { success: false, error: 'Test endpoint only available in development' },
            { status: 403 }
        );
    }

    try {
        const { phoneNumber, testCode } = await request.json();

        if (!phoneNumber) {
            return NextResponse.json(
                { success: false, error: 'Phone number is required' },
                { status: 400 }
            );
        }

        const formattedPhone = formatPhoneNumber(phoneNumber);
        const code = testCode || '123456';

        // Get service status
        const serviceStatus = getSMSServiceStatus();

        // Test SMS sending
        const smsResult = await sendSMSVerificationCode({
            phoneNumber: formattedPhone,
            code,
        });

        return NextResponse.json({
            success: true,
            test: {
                phoneNumber: formattedPhone,
                code,
                smsResult,
                serviceStatus,
                environment: process.env.NODE_ENV,
                timestamp: new Date().toISOString(),
            },
        });

    } catch (error) {
        console.error('SMS test error:', error);
        return NextResponse.json(
            { success: false, error: 'SMS test failed' },
            { status: 500 }
        );
    }
}

/**
 * Get SMS service configuration status
 */
export async function GET() {
    try {
        const serviceStatus = getSMSServiceStatus();

        return NextResponse.json({
            success: true,
            serviceStatus,
            environment: process.env.NODE_ENV,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('SMS status check error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to check SMS service' },
            { status: 500 }
        );
    }
}
