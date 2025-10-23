import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { smsVerificationCodes, users } from '@/lib/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { verifyPhoneCode, createUserFromPhone } from '@/lib/services/auth';
import { formatPhoneNumber } from '@/lib/services/sms';


export async function POST(request: NextRequest) {
    try {
        console.log('📱 Verify request received');
        const { phoneNumber, code } = await request.json();
        console.log('📱 Verify - Phone:', phoneNumber, 'Code:', code);

        if (!phoneNumber || !code) {
            return NextResponse.json(
                { success: false, error: 'Phone number and code are required' },
                { status: 400 }
            );
        }

        const formattedPhone = formatPhoneNumber(phoneNumber);
        console.log('📱 Verify - Formatted phone:', formattedPhone);

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
            // Update existing user
            await db
                .update(users)
                .set({
                    phoneVerified: true,
                    lastSignIn: new Date()
                })
                .where(eq(users.id, existingUser[0].id));

            // Return the updated user data
            user = {
                id: existingUser[0].id,
                phoneNumber: existingUser[0].phoneNumber,
                firstName: existingUser[0].firstName,
                lastName: existingUser[0].lastName,
                displayName: existingUser[0].displayName,
                onboardingCompleted: existingUser[0].onboardingCompleted,
            };
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
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            name: error instanceof Error ? error.name : undefined
        });
        return NextResponse.json(
            { success: false, error: 'Failed to verify code' },
            { status: 500 }
        );
    }
}
