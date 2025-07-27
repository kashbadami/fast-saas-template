import { z } from "zod";
import bcrypt from "bcryptjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { emailService } from "~/server/email";
import { 
  generateVerificationToken, 
  verifyToken, 
  generatePasswordResetToken, 
  verifyPasswordResetToken 
} from "~/server/auth/tokens";
import { env } from "~/env";

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, email, password } = input;

      // Check if user already exists
      const existingUser = await ctx.db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists with this email",
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user
      const user = await ctx.db.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      // Generate verification token
      const verificationToken = await generateVerificationToken(email);
      
      // Create verification URL
      const baseUrl = env.NEXTAUTH_URL || "http://localhost:3000";
      const verificationUrl = `${baseUrl}/auth/verify?token=${verificationToken.token}`;

      // Send verification email
      await emailService.sendVerificationEmail({
        name: name || "there",
        email,
        verificationUrl,
      });

      // Return user without password
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        message: "Account created! Please check your email to verify your account.",
      };
    }),

  // This is just for checking if email exists (useful for UX)
  checkEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
        select: { id: true },
      });
      
      return { exists: !!user };
    }),

  // Verify email with token
  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await verifyToken(input.token);
      
      if (!result.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: result.error || "Invalid or expired token",
        });
      }

      // Send welcome email after successful verification
      if (result.user) {
        const baseUrl = env.NEXTAUTH_URL || "http://localhost:3000";
        await emailService.sendWelcomeEmail({
          name: result.user.name || "there",
          email: result.user.email!,
          dashboardUrl: baseUrl,
        });
        
        // Mark welcome email as sent
        await ctx.db.user.update({
          where: { id: result.user.id },
          data: { welcomeEmailSent: true }
        });
      }

      return {
        success: true,
        message: "Email verified successfully! You can now sign in.",
      };
    }),

  // Resend verification email
  resendVerification: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No account found with this email",
        });
      }

      if (user.emailVerified) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email is already verified",
        });
      }

      // Generate new verification token
      const verificationToken = await generateVerificationToken(input.email);
      
      // Create verification URL
      const baseUrl = env.NEXTAUTH_URL || "http://localhost:3000";
      const verificationUrl = `${baseUrl}/auth/verify?token=${verificationToken.token}`;

      // Send verification email
      await emailService.sendVerificationEmail({
        name: user.name || "there",
        email: input.email,
        verificationUrl,
      });

      return {
        success: true,
        message: "Verification email sent! Please check your inbox.",
      };
    }),

  // Request password reset
  requestPasswordReset: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      // Always return success to prevent email enumeration
      if (!user) {
        return {
          success: true,
          message: "If an account exists, a password reset link has been sent.",
        };
      }

      // Generate reset token
      const resetToken = await generatePasswordResetToken(input.email);
      
      // Create reset URL
      const baseUrl = env.NEXTAUTH_URL || "http://localhost:3000";
      const resetUrl = `${baseUrl}/auth/reset-password?token=${resetToken.token}`;

      // Send reset email
      await emailService.sendPasswordResetEmail({
        name: user.name || "there",
        email: input.email,
        resetUrl,
      });

      return {
        success: true,
        message: "If an account exists, a password reset link has been sent.",
      };
    }),

  // Reset password with token
  resetPassword: publicProcedure
    .input(z.object({ 
      token: z.string(),
      password: z.string().min(8),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await verifyPasswordResetToken(input.token);
      
      if (!result.success || !result.email) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: result.error || "Invalid or expired reset token",
        });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(input.password, 10);

      // Update user's password
      await ctx.db.user.update({
        where: { email: result.email },
        data: { password: hashedPassword },
      });

      // Delete the token after use
      await ctx.db.passwordResetToken.delete({
        where: { token: input.token },
      });

      return {
        success: true,
        message: "Password reset successfully! You can now sign in with your new password.",
      };
    }),

  // Check login status for better error messages
  checkLoginStatus: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
        select: {
          id: true,
          password: true,
          emailVerified: true,
        },
      });

      if (!user) {
        return {
          status: "no_account",
          message: "No account found with this email. Please sign up first.",
        };
      }

      if (!user.password) {
        return {
          status: "oauth_only",
          message: "This account uses Google sign-in. Please use the Google button to sign in.",
        };
      }

      if (!user.emailVerified) {
        return {
          status: "unverified",
          message: "Please verify your email before signing in. Check your inbox for the verification link.",
        };
      }

      return {
        status: "ok",
        message: "Account ready for login",
      };
    }),
});