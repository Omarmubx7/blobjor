
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config';
import prisma from '@/lib/prisma'; // Make sure this path is correct

async function getUser(email: string) {
    try {
        const user = await prisma.customer.findUnique({ where: { email } });
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

async function getUserByPhone(phone: string) {
    try {
        const user = await prisma.customer.findUnique({ where: { phone } });
        return user;
    } catch (error) {
        console.error('Failed to fetch user by phone:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().optional(), phone: z.string().optional(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, phone, password } = parsedCredentials.data;

                    let user = null;
                    if (email) {
                        user = await getUser(email);
                    } else if (phone) {
                        user = await getUserByPhone(phone);
                    }

                    if (!user) return null;

                    // If user has no password (e.g. old simplified signup), we might need logic to handle that
                    // For now, assuming password exists
                    if (!user.passwordHash) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
                    if (passwordsMatch) return user;
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.phone = user.phone;
                token.address = user.address;
                token.city = user.city;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.phone = token.phone as string;
                session.user.address = token.address as string;
                session.user.city = token.city as string;
            }
            return session;
        },
    },
});
