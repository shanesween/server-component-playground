import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { users, accounts, sessions, verificationTokens } from "@/lib/db/schema";
import type { NextAuthOptions } from "next-auth";

export const authConfig: NextAuthOptions = {
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
    }),
    providers: [
        // Phone number authentication will be handled via custom API routes
    ],
    callbacks: {
        async session({ session, user }) {
            if (session.user && user) {
                // Add user ID to session
                (session.user as any).id = user.id;

                // Add phone-specific fields to session
                if ('phoneNumber' in user) {
                    (session.user as any).phoneNumber = user.phoneNumber;
                }
                if ('onboardingCompleted' in user) {
                    (session.user as any).onboardingCompleted = user.onboardingCompleted;
                }
            }
            return session;
        },
        async signIn({ user, account, profile }) {
            console.log('NextAuth signIn callback:', { user, account, profile });
            // Phone authentication will be handled via custom API routes
            return true;
        },
        async redirect({ url, baseUrl }) {
            console.log('NextAuth redirect callback:', { url, baseUrl });
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },
    },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/signin", // Redirect OAuth errors to the signin page
    },
    session: {
        strategy: "database",
    },
    debug: process.env.NODE_ENV === "development",
};