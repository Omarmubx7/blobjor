import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `auth`, contains information about the active session.
     */
    interface Session {
        user: {
            id: string
            phone?: string | null
            address?: string | null
            city?: string | null
            emailVerified?: Date | null
        } & DefaultSession["user"]
    }

    interface User {
        phone?: string | null
        address?: string | null
        city?: string | null
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        id?: string
        phone?: string | null
        address?: string | null
        city?: string | null
    }
}
