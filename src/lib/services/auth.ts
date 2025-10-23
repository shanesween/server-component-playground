import { eq } from 'drizzle-orm';
import { db, users, userPreferences } from '@/lib/db';
import { hashPassword, verifyPassword, validatePassword, validateEmail } from '@/lib/auth/password';
import { setAuthCookie, removeAuthCookie, getCurrentUser } from '@/lib/auth/jwt';
import type { APIResponse, CreateUserRequest } from '@/lib/db/types';

export interface SignUpRequest extends CreateUserRequest {
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export async function signUp(request: SignUpRequest): Promise<APIResponse<AuthUser>> {
  try {
    // Validate input
    if (!validateEmail(request.email)) {
      return { success: false, error: 'Invalid email format' };
    }

    const passwordValidation = validatePassword(request.password);
    if (!passwordValidation.isValid) {
      return { success: false, error: passwordValidation.errors.join(', ') };
    }

    if (!request.firstName.trim() || !request.lastName.trim()) {
      return { success: false, error: 'First name and last name are required' };
    }

    // Check if user already exists
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, request.email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      return { success: false, error: 'An account with this email already exists' };
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(request.password);
    
    const [newUser] = await db
      .insert(users)
      .values({
        email: request.email.toLowerCase(),
        password: hashedPassword,
        firstName: request.firstName.trim(),
        lastName: request.lastName.trim(),
      })
      .returning({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
      });

    // Create default user preferences
    await db.insert(userPreferences).values({
      userId: newUser.id,
    });

    // Set auth cookie
    await setAuthCookie({
      userId: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    });

    return { success: true, data: newUser };
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, error: 'Failed to create account' };
  }
}

export async function signIn(request: SignInRequest): Promise<APIResponse<AuthUser>> {
  try {
    // Validate input
    if (!validateEmail(request.email)) {
      return { success: false, error: 'Invalid email format' };
    }

    if (!request.password) {
      return { success: false, error: 'Password is required' };
    }

    // Find user
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        password: users.password,
        firstName: users.firstName,
        lastName: users.lastName,
      })
      .from(users)
      .where(eq(users.email, request.email.toLowerCase()))
      .limit(1);

    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Verify password
    const isPasswordValid = await verifyPassword(request.password, user.password);
    if (!isPasswordValid) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Set auth cookie
    await setAuthCookie({
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: 'Failed to sign in' };
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
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
      })
      .from(users)
      .where(eq(users.id, tokenPayload.userId))
      .limit(1);

    return user || null;
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