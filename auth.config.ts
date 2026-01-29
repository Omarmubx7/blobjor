
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    providers: [], // Configured in auth.ts
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/profile') || nextUrl.pathname.startsWith('/my-orders');
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');

            if (isOnAdmin) {
                // Admin protection logic would go here if we were using NextAuth for admins
                // Currently admin has separate session logic, but we can unify later
                return true;
            }

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                // Redirect logged-in users away from auth pages
                if (nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/signup')) {
                    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blobjor.me';
                    return Response.redirect(new URL(`${siteUrl}/profile`));
                }
            }
            return true;
        },
    },
} satisfies NextAuthConfig;
