import { NextAuthOptions } from "next-auth";
import { db } from "@/lib/db";
import { users, smsVerificationCodes } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";

export const phoneProvider: NextAuthOptions["providers"][0] = {
    id: "phone",
    name: "Phone",
    type: "credentials",
    credentials: {
        phoneNumber: { label: "Phone Number", type: "text" },
        code: { label: "Verification Code", type: "text" },
    },
    async authorize(credentials) {
        if (!credentials?.phoneNumber || !credentials?.code) {
            return null;
        }

        try {
            const formattedPhone = formatPhoneNumber(credentials.phoneNumber);

            // Find the verification code
            const verificationRecord = await db
                .select()
                .from(smsVerificationCodes)
                .where(
                    and(
                        eq(smsVerificationCodes.phoneNumber, formattedPhone),
                        eq(smsVerificationCodes.code, credentials.code),
                        gt(smsVerificationCodes.expiresAt, new Date())
                    )
                )
                .orderBy(smsVerificationCodes.createdAt)
                .limit(1);

            if (verificationRecord.length === 0) {
                return null;
            }

            const record = verificationRecord[0];

            // Check if code has been used
            if (record.verifiedAt) {
                return null;
            }

            // Check attempt limit
            if ((record.attempts ?? 0) >= (record.maxAttempts || 3)) {
                return null;
            }

            // Mark code as verified
            await db
                .update(smsVerificationCodes)
                .set({
                    verifiedAt: new Date(),
                    attempts: (record.attempts ?? 0) + 1,
                })
                .where(eq(smsVerificationCodes.id, record.id));

            // Find or create user
            const existingUser = await db
                .select()
                .from(users)
                .where(eq(users.phoneNumber, formattedPhone))
                .limit(1);

            let user;
            if (existingUser.length === 0) {
                // Create new user
                const [newUser] = await db
                    .insert(users)
                    .values({
                        phoneNumber: formattedPhone,
                        phoneVerified: true,
                        onboardingCompleted: false,
                    })
                    .returning({
                        id: users.id,
                        phoneNumber: users.phoneNumber,
                        firstName: users.firstName,
                        lastName: users.lastName,
                        displayName: users.displayName,
                        onboardingCompleted: users.onboardingCompleted,
                    });

                user = newUser;
            } else {
                // Update existing user
                await db
                    .update(users)
                    .set({
                        phoneVerified: true,
                        lastSignIn: new Date(),
                    })
                    .where(eq(users.id, existingUser[0].id));

                user = existingUser[0];
            }

            return {
                id: user.id,
                phoneNumber: user.phoneNumber,
                firstName: user.firstName,
                lastName: user.lastName,
                displayName: user.displayName,
                onboardingCompleted: user.onboardingCompleted,
            };
        } catch (error) {
            console.error("Phone provider authorization error:", error);
            return null;
        }
    },
};

// Format phone number to E.164 format
function formatPhoneNumber(phone: string): string {
    const digits = phone.replace(/\D/g, "");

    if (digits.length === 10) {
        return `+1${digits}`;
    }

    if (digits.startsWith("1") && digits.length === 11) {
        return `+${digits}`;
    }

    if (phone.startsWith("+")) {
        return phone;
    }

    return `+1${digits}`;
}
