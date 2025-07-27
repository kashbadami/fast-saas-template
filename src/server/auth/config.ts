import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "@auth/core/adapters";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { env } from "~/env";
import { db } from "~/server/db";
import { emailService } from "~/server/email";

// Custom adapter that wraps PrismaAdapter to send welcome emails
function createCustomAdapter(prismaDb: typeof db): Adapter {
  const baseAdapter = PrismaAdapter(prismaDb);
  
  return {
    ...baseAdapter,
    createUser: async (user) => {
      console.log("🔵 CREATING NEW USER:", user.email);
      
      // Create the user using the base adapter
      const newUser = await baseAdapter.createUser!(user);
      
      // Send welcome email immediately after user creation
      if (newUser.email) {
        try {
          const baseUrl = env.NEXTAUTH_URL ?? "http://localhost:3000";
          console.log("📧 Sending welcome email to new user:", newUser.email);
          
          await emailService.sendWelcomeEmail({
            name: newUser.name ?? "there",
            email: newUser.email,
            dashboardUrl: baseUrl,
          });
          
          // Mark welcome email as sent
          await prismaDb.user.update({
            where: { id: newUser.id },
            data: { welcomeEmailSent: true }
          });
          
          console.log("✅ Welcome email sent successfully to:", newUser.email);
        } catch (error) {
          console.error("❌ Failed to send welcome email:", error);
        }
      }
      
      return newUser;
    },
  };
}

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    // Only use Discord if credentials are provided
    ...(env.AUTH_DISCORD_ID && env.AUTH_DISCORD_SECRET 
      ? [DiscordProvider({
          clientId: env.AUTH_DISCORD_ID,
          clientSecret: env.AUTH_DISCORD_SECRET,
        })] 
      : []),
    // Only use Google if credentials are provided
    ...(env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET 
      ? [GoogleProvider({
          clientId: env.AUTH_GOOGLE_ID,
          clientSecret: env.AUTH_GOOGLE_SECRET,
        })] 
      : []),
    // Add credentials provider for email/password authentication
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user) {
          // No account exists with this email
          return null;
        }

        if (!user.password) {
          // User exists but signed up with OAuth
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        // Check if email is verified
        if (!user.emailVerified) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  adapter: createCustomAdapter(db),
  session: {
    strategy: "jwt", // Use JWT for better compatibility with credentials provider
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/",
    error: "/auth/login",
  },
  callbacks: {
    jwt: ({ token, user }) => {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session.user && token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
