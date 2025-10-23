import { eq } from 'drizzle-orm';
import { db, users, userPreferences } from '@/lib/db';
import { setAuthCookie, removeAuthCookie, getCurrentUser } from '@/lib/auth/jwt';
import type { APIResponse } from '@/lib/db/types';

export interface PhoneAuthRequest {
  phoneNumber: string;
  code: string;
}

export interface AuthUser {
  id: string;
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  onboardingCompleted: boolean;
}

// Format phone number to E.164 format
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

export async function verifyPhoneCode(request: PhoneAuthRequest): Promise<APIResponse<AuthUser>> {
  try {
    const formattedPhone = formatPhoneNumber(request.phoneNumber);

    // Find user by phone number
    const [user] = await db
      .select({
        id: users.id,
        phoneNumber: users.phoneNumber,
        firstName: users.firstName,
        lastName: users.lastName,
        displayName: users.displayName,
        onboardingCompleted: users.onboardingCompleted,
      })
      .from(users)
      .where(eq(users.phoneNumber, formattedPhone))
      .limit(1);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Set auth cookie
    await setAuthCookie({
      userId: user.id,
      phoneNumber: user.phoneNumber || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
    });

    return {
      success: true,
      data: {
        id: user.id,
        phoneNumber: user.phoneNumber || '',
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        displayName: user.displayName || undefined,
        onboardingCompleted: user.onboardingCompleted || false,
      }
    };
  } catch (error) {
    console.error('Phone verification error:', error);
    return { success: false, error: 'Failed to verify phone number' };
  }
}

export async function createUserFromPhone(phoneNumber: string): Promise<APIResponse<AuthUser>> {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);

    // Check if user already exists
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.phoneNumber, formattedPhone))
      .limit(1);

    if (existingUser.length > 0) {
      return { success: false, error: 'User already exists' };
    }

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

    // Create default user preferences
    await db.insert(userPreferences).values({
      userId: newUser.id,
    });

    return {
      success: true,
      data: {
        id: newUser.id,
        phoneNumber: newUser.phoneNumber || '',
        firstName: newUser.firstName || undefined,
        lastName: newUser.lastName || undefined,
        displayName: newUser.displayName || undefined,
        onboardingCompleted: newUser.onboardingCompleted || false,
      }
    };
  } catch (error) {
    console.error('Create user error:', error);
    return { success: false, error: 'Failed to create user' };
  }
}

export async function signOut(): Promise<APIResponse<null>> {
  try {
    await removeAuthCookie();
    return { success: true, data: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: 'Failed to sign out' };
  }
}

export async function getUser(): Promise<AuthUser | null> {
  try {
    const tokenPayload = await getCurrentUser();
    if (!tokenPayload) return null;

    // Verify user still exists in database
    const [user] = await db
      .select({
        id: users.id,
        phoneNumber: users.phoneNumber,
        firstName: users.firstName,
        lastName: users.lastName,
        displayName: users.displayName,
        onboardingCompleted: users.onboardingCompleted,
      })
      .from(users)
      .where(eq(users.id, tokenPayload.userId))
      .limit(1);

    if (!user) return null;

    return {
      id: user.id,
      phoneNumber: user.phoneNumber || '',
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      displayName: user.displayName || undefined,
      onboardingCompleted: user.onboardingCompleted || false,
    };
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}