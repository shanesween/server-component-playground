import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { smsVerificationCodes } from '@/lib/db/schema';
import { eq, and, gt } from 'drizzle-orm';

// Generate a 6-digit verification code
function generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Format phone number to E.164 format
function formatPhoneNumber(phone: string): string {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');

    // Add +1 if it's a 10-digit US number
    if (digits.length === 10) {
        return `+1${digits}`;
    }

    // If it already starts with +1, return as is
    if (digits.startsWith('1') && digits.length === 11) {
        return `+${digits}`;
    }

    // If it already has +, return as is
    if (phone.startsWith('+')) {
        return phone;
    }

    // Default: add +1
    return `+1${digits}`;
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
        const code = generateCode();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

        // Check for recent codes to prevent spam
        const recentCodes = await db
            .select()
            .from(smsVerificationCodes)
            .where(
                and(
                    eq(smsVerificationCodes.phoneNumber, formattedPhone),
                    gt(smsVerificationCodes.createdAt, new Date(Date.now() - 60 * 1000)) // Last minute
                )
            );

        if (recentCodes.length > 0) {
            return NextResponse.json(
                { success: false, error: 'Please wait before requesting another code' },
                { status: 429 }
            );
        }

        // Store the verification code
        await db.insert(smsVerificationCodes).values({
            phoneNumber: formattedPhone,
            code,
            expiresAt,
            ipAddress: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
        });

        // In development, log the code instead of sending SMS
        if (process.env.NODE_ENV === 'development') {
            console.log(`📱 SMS Code for ${formattedPhone}: ${code}`);
        }

        // TODO: Integrate with Twilio or AWS SNS for production SMS sending
        // For now, we'll just return success in development

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
