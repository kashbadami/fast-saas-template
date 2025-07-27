"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { api } from "~/trpc/react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const resetPasswordMutation = api.auth.resetPassword.useMutation({
    onSuccess: () => {
      setShowSuccess(true);
      setError(null);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Invalid reset link");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    resetPasswordMutation.mutate({ token, password });
  };

  if (!token) {
    return (
      <section className="w-full px-4">
        <div className="w-full max-w-md mx-auto">
          <Card className="w-full">
            <CardHeader className="text-center">
              <h1 className="text-2xl font-bold">Invalid Reset Link</h1>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                This password reset link is invalid or has expired.
              </p>
              <Link href="/auth/forgot-password">
                <Button variant="outline">Request New Link</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="w-full">
          <CardHeader className="items-center justify-center">
            <h1 className="text-2xl font-bold">Create new password</h1>
            <p className="text-sm text-muted-foreground">
              Enter your new password below
            </p>
          </CardHeader>
          <CardContent>
            {showSuccess ? (
              <div className="space-y-4 text-center">
                <div className="text-green-600">
                  <svg
                    className="w-16 h-16 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold">Password reset successfully!</h2>
                <p className="text-muted-foreground">
                  Your password has been updated. Redirecting to login...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4">
                {error && (
                  <div className="text-sm text-red-500 text-center">
                    {error}
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter new password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={resetPasswordMutation.isPending}
                    minLength={8}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={resetPasswordMutation.isPending}
                    minLength={8}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={resetPasswordMutation.isPending}
                >
                  {resetPasswordMutation.isPending ? "Resetting..." : "Reset password"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
        {!showSuccess && (
          <div className="mx-auto flex gap-1 text-sm mt-4">
            <p>Remember your password?</p>
            <Link href="/auth/login" className="underline">
              Back to login
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}