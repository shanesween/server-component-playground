import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
);

const TOKEN_NAME = 'sports-auth-token';
const TOKEN_EXPIRY = '7d'; // 7 days

export interface AuthTokenPayload {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  iat?: number;
  exp?: number;
}

export async function createToken(payload: Omit<AuthTokenPayload, 'iat' | 'exp'>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<AuthTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Type guard to ensure the payload has our expected structure
    if (payload && typeof payload === 'object' &&
      'userId' in payload &&
      'email' in payload &&
      'firstName' in payload &&
      'lastName' in payload) {
      return {
        userId: payload.userId as string,
        email: payload.email as string,
        firstName: payload.firstName as string,
        lastName: payload.lastName as string,
        iat: payload.iat as number,
        exp: payload.exp as number,
      };
    }

    return null;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function setAuthCookie(payload: Omit<AuthTokenPayload, 'iat' | 'exp'>) {
  const token = await createToken(payload);
  const cookieStore = await cookies();

  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function getAuthCookie(): Promise<AuthTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME);

  if (!token) return null;

  return verifyToken(token.value);
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
}

export async function getCurrentUser(): Promise<AuthTokenPayload | null> {
  return getAuthCookie();
}