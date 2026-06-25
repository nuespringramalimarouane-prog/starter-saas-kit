import NextAuth from "next-auth"
import authConfig from "./auth.config"

import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"

import bcrypt from "bcryptjs"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"

export const { handlers, auth, signIn, signOut } = NextAuth({
     ...authConfig,
  adapter: PrismaAdapter(db),

  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({                              // ← add this
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  }),

    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const email = credentials.email as string
        const password = credentials.password as string

        const user = await db.user.findUnique({
          where: { email },
        })

        if (!user?.password) return null

        const valid = await bcrypt.compare(
          password,
          user.password
        )

        if (!valid) return null

        return user
      },
    }),
  ],
  events: {
    async createUser({ user }) {
      if(!user) return;
      const name = user.name ?? "User"
      const email = user.email ?? "username@gmail.com"
      const userId = user.id

      if(!userId || !email || !name) return

      const slugBase = (email.split("@")[0] ?? user.id)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")

      await db.organization.create({
        data: {
          name: `first workspace`,
          slug: `${slugBase}-${userId.slice(0, 6)}`,

          memberships: {
            create: {
              userId,
              role: "ADMIN",
            },
          },
        },
      })
    },
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }

      return session
    },
     authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
  },

  pages: {
    signIn: "/login",
    error:"/login"
  },
})