import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { smsVerificationCodes, users } from '@/lib/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { verifyPhoneCode, createUserFromPhone } from '@/lib/services/auth';

// Format phone number to E.164 format (same as send-code)
function formatPhoneNumber(phone: string): string {
    const digits = phone.replace(/\D/g, '');

    if (digits.length === 10) {
        return `+1${digits}`;
    }

    if (digits.startsWith('1') && digits.length === 11) {
        return `+${digits}`;
    }

    if (phone.startsWith('+')) {
        return phone;
    }

    return `+1${digits}`;
}

export async function POST(request: NextRequest) {
    try {
        const { phoneNumber, code } = await request.json();

        if (!phoneNumber || !code) {
            return NextResponse.json(
                { success: false, error: 'Phone number and code are required' },
                { status: 400 }
            );
        }

        const formattedPhone = formatPhoneNumber(phoneNumber);

        // Find the verification code
        const verificationRecord = await db
            .select()
            .from(smsVerificationCodes)
            .where(
                and(
                    eq(smsVerificationCodes.phoneNumber, formattedPhone),
                    eq(smsVerificationCodes.code, code),
                    gt(smsVerificationCodes.expiresAt, new Date())
                )
            )
            .orderBy(smsVerificationCodes.createdAt)
            .limit(1);

        if (verificationRecord.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Invalid or expired code' },
                { status: 400 }
            );
        }

        const record = verificationRecord[0];

        // Check if code has been used
        if (record.verifiedAt) {
            return NextResponse.json(
                { success: false, error: 'Code has already been used' },
                { status: 400 }
            );
        }

        // Check attempt limit
        if (record.attempts >= (record.maxAttempts || 3)) {
            return NextResponse.json(
                { success: false, error: 'Too many attempts. Please request a new code' },
                { status: 400 }
            );
        }

        // Mark code as verified
        await db
            .update(smsVerificationCodes)
            .set({
                verifiedAt: new Date(),
                attempts: record.attempts + 1
            })
            .where(eq(smsVerificationCodes.id, record.id));

        // Check if user exists
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.phoneNumber, formattedPhone))
            .limit(1);

        let user;
        if (existingUser.length === 0) {
            // Create new user
            const createResult = await createUserFromPhone(formattedPhone);
            if (!createResult.success) {
                return NextResponse.json(
                    { success: false, error: createResult.error },
                    { status: 500 }
                );
            }
            user = createResult.data;
        } else {
            // Update existing user and verify
            await db
                .update(users)
                .set({
                    phoneVerified: true,
                    lastSignIn: new Date()
                })
                .where(eq(users.id, existingUser[0].id));

            // Get updated user data
            const verifyResult = await verifyPhoneCode({ phoneNumber: formattedPhone, code });
            if (!verifyResult.success) {
                return NextResponse.json(
                    { success: false, error: verifyResult.error },
                    { status: 500 }
                );
            }
            user = verifyResult.data;
        }

        return NextResponse.json({
            success: true,
            message: 'Phone number verified successfully',
            user: {
                id: user.id,
                phoneNumber: user.phoneNumber,
                onboardingCompleted: user.onboardingCompleted,
            },
        });

    } catch (error) {
        console.error('Error verifying code:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to verify code' },
            { status: 500 }
        );
    }
}
