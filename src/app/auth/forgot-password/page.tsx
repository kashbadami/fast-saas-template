"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card } from "~/components/ui/card";
import { api } from "~/trpc/react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetPasswordMutation = api.auth.requestPasswordReset.useMutation({
    onSuccess: () => {
      setShowSuccess(true);
      setError(null);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    resetPasswordMutation.mutate({ email });
  };

  return (
    <section className="w-full px-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="w-full">
          <div className="p-8">
            <div className="flex flex-col gap-2 mb-8">
              <h1 className="text-3xl font-medium tracking-tight">
                Reset your <span className="font-playfair italic text-[#f97316]">password</span>
              </h1>
              <p className="text-muted-foreground">
                Enter your email and we'll send you a reset link
              </p>
            </div>
            
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
                        d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold">Check your email!</h2>
                  <p className="text-muted-foreground">
                    If an account exists for {email}, we've sent a password reset link.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Please check your inbox and follow the instructions to reset your password.
                  </p>
                  <Link href="/auth/login">
                    <Button variant="outline" className="w-full">
                      Back to login
                    </Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="text-sm text-red-500 text-center">
                      {error}
                    </div>
                  )}
                  <div className="gap-2 grid">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={resetPasswordMutation.isPending}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-[#f97316] hover:bg-[#f97316]/90" 
                    disabled={resetPasswordMutation.isPending}
                  >
                    {resetPasswordMutation.isPending ? "Sending..." : "Send reset link"}
                  </Button>
                </form>
              )}
              
              {!showSuccess && (
                <div className="mt-8">
                  <p className="text-muted-foreground text-sm text-center">
                    <Link href="/auth/login" className="flex items-center justify-center gap-1 text-[#f97316] hover:underline">
                      <ArrowLeft className="w-3 h-3" />
                      Back to login
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </Card>
      </div>
    </section>
  );
}