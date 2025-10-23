'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

interface AuthUser {
    id: string;
    phoneNumber: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    onboardingCompleted: boolean;
}

interface SessionUser {
    id?: string;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    onboardingCompleted?: boolean;
}

export function useAuth() {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const updateAuthState = () => {
            if (status === 'loading') {
                setLoading(true);
                return;
            }

            if (status === 'unauthenticated') {
                setUser(null);
                setLoading(false);
                return;
            }

            if (session?.user) {
                const sessionUser = session.user as SessionUser;
                setUser({
                    id: sessionUser.id || '',
                    phoneNumber: sessionUser.phoneNumber || '',
                    firstName: sessionUser.firstName,
                    lastName: sessionUser.lastName,
                    displayName: sessionUser.displayName,
                    onboardingCompleted: sessionUser.onboardingCompleted || false,
                });
                setLoading(false);
            }
        };

        updateAuthState();
    }, [session, status]);

    const logout = async () => {
        await signOut({ callbackUrl: '/auth/signin' });
    };

    return { user, loading, logout };
}

export function useRequireAuth() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/signin');
        }
    }, [user, loading, router]);

    return { user, loading };
}

export function useRequireOnboarding() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user && user.onboardingCompleted) {
            router.push('/');
        }
    }, [user, loading, router]);

    return { user, loading };
}
