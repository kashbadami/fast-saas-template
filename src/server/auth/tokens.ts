import crypto from "crypto";
import { db } from "~/server/db";

export async function generateVerificationToken(email: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Delete any existing tokens for this email
  await db.verificationToken.deleteMany({
    where: { identifier: email },
  });

  // Create new token
  const verificationToken = await db.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return verificationToken;
}

export async function verifyToken(token: string) {
  const verificationToken = await db.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    return { success: false, error: "Invalid token" };
  }

  if (verificationToken.expires < new Date()) {
    await db.verificationToken.delete({
      where: { token },
    });
    return { success: false, error: "Token expired" };
  }

  // Update user's email verification status
  const user = await db.user.update({
    where: { email: verificationToken.identifier },
    data: { emailVerified: new Date() },
  });

  // Delete the token after use
  await db.verificationToken.delete({
    where: { token },
  });

  return { success: true, user };
}

export async function generatePasswordResetToken(email: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Delete any existing password reset tokens for this email
  await db.passwordResetToken.deleteMany({
    where: { identifier: email },
  });

  // Create new token
  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return passwordResetToken;
}

export async function verifyPasswordResetToken(token: string) {
  const passwordResetToken = await db.passwordResetToken.findUnique({
    where: { token },
  });

  if (!passwordResetToken) {
    return { success: false, error: "Invalid token" };
  }

  if (passwordResetToken.expires < new Date()) {
    await db.passwordResetToken.delete({
      where: { token },
    });
    return { success: false, error: "Token expired" };
  }

  return { success: true, email: passwordResetToken.identifier };
}