import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { smsVerificationCodes } from '@/lib/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { sendSMSVerificationCode, formatPhoneNumber, isSMSServiceAvailable } from '@/lib/services/sms';

// Generate a 6-digit verification code
function generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}


export async function POST(request: NextRequest) {
    try {
        const { phoneNumber } = await request.json();

        if (!phoneNumber) {
            return NextResponse.json(
                { success: false, error: 'Phone number is required' },
                { status: 400 }
            );
        }

        const formattedPhone = formatPhoneNumber(phoneNumber);
        console.log('📱 Send - Formatted phone:', formattedPhone);
        const code = generateCode();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

        // Store the verification code
        await db.insert(smsVerificationCodes).values({
            phoneNumber: formattedPhone,
            code,
            expiresAt,
            ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        });

        // In development, log the code instead of sending SMS
        if (process.env.NODE_ENV === 'development') {
            console.log(`📱 SMS Code for ${formattedPhone}: ${code}`);
        }

        return NextResponse.json({
            success: true,
            message: 'Verification code sent',
            // In development, include the code for testing
            ...(process.env.NODE_ENV === 'development' && { code }),
        });

    } catch (error) {
        console.error('Error sending verification code:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to send verification code' },
            { status: 500 }
        );
    }
}
