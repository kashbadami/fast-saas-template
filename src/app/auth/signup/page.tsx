"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Shield, Zap, Code2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card } from "~/components/ui/card";
import { LoginDialog } from "~/components/login-dialog";
import { api } from "~/trpc/react";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  const signupMutation = api.auth.signup.useMutation({
    onSuccess: async () => {
      setShowSuccess(true);
      setError(null);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const resendVerificationMutation = api.auth.resendVerification.useMutation({
    onSuccess: () => {
      setError(null);
      // Show success message temporarily
      const successMsg = "Verification email sent! Please check your inbox.";
      setError(successMsg);
      setTimeout(() => {
        if (error === successMsg) setError(null);
      }, 5000);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      setError("Failed to sign up with Google");
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setUserEmail(email);
    signupMutation.mutate({ name, email, password });
  };

  return (
    <>
      <section className="w-full px-4">
        <div className="w-full max-w-3xl mx-auto">
          <Card className="p-0 overflow-hidden">
            <div className="grid lg:grid-cols-2 min-h-full">
              <div className="p-8 lg:p-12">
                <div className="flex flex-col gap-2 mb-8">
                  <h1 className="text-3xl font-medium tracking-tight">
                    Create your <span className="font-playfair italic text-[#f97316]">account</span>
                  </h1>
                  <p className="text-muted-foreground">
                    Start building your SaaS in minutes with our complete starter template
                  </p>
                </div>
                
                {showSuccess ? (
                  <div className="space-y-4 text-center">
                    <div className="text-green-600">
                      <svg
                        className="mx-auto mb-4 w-16 h-16"
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
                    <h2 className="font-semibold text-xl">Check your email!</h2>
                    <p className="text-muted-foreground">
                      We've sent a verification link to your email address. 
                      Please check your inbox and click the link to verify your account.
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Didn't receive the email? Check your spam folder or{" "}
                      <button
                        onClick={() => {
                          resendVerificationMutation.mutate({ email: userEmail });
                        }}
                        disabled={resendVerificationMutation.isPending}
                        className="text-[#f97316] underline hover:no-underline disabled:opacity-50"
                      >
                        {resendVerificationMutation.isPending ? "sending..." : "resend email"}
                      </button>
                    </p>
                    {error && error.includes("Verification email sent") && (
                      <p className="text-sm text-green-600 mt-2">{error}</p>
                    )}
                  </div>
                ) : !showEmailForm ? (
                  <div className="flex flex-col gap-4">
                    <Button 
                      onClick={handleGoogleSignup} 
                      disabled={isLoading}
                      variant="outline"
                      className="w-full"
                    >
                      <FcGoogle className="mr-2 h-4 w-4" />
                      Continue with Google
                    </Button>
                    <div className="flex items-center gap-4">
                      <span className="bg-input w-full h-px"></span>
                      <span className="text-muted-foreground text-xs">OR</span>
                      <span className="bg-input w-full h-px"></span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button 
                        variant="default" 
                        onClick={() => setShowEmailForm(true)}
                        disabled={signupMutation.isPending}
                        className="bg-[#f97316] hover:bg-[#f97316]/90"
                      >
                        Continue with Email
                      </Button>
                    </div>
                    {error && (
                      <div className="text-red-500 text-sm text-center">
                        {error}
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    {error && (
                      <div className="text-red-500 text-sm text-center">
                        {error}
                      </div>
                    )}
                    <div className="gap-2 grid">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        required
                        disabled={signupMutation.isPending}
                      />
                    </div>
                    <div className="gap-2 grid">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        disabled={signupMutation.isPending}
                      />
                    </div>
                    <div className="gap-2 grid">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        required
                        disabled={signupMutation.isPending}
                        minLength={8}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-[#f97316] hover:bg-[#f97316]/90" 
                      disabled={isLoading || signupMutation.isPending}
                    >
                      {signupMutation.isPending ? "Creating account..." : "Create account"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => setShowEmailForm(false)}
                      disabled={isLoading}
                    >
                      Back to options
                    </Button>
                  </form>
                )}

                <div className="mt-8">
                  <p className="text-muted-foreground text-sm text-center">
                    Already a user?{" "}
                    <button
                      onClick={() => setShowLoginDialog(true)}
                      className="text-[#f97316] hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                  <p className="mt-2 text-muted-foreground text-sm text-center">
                    By continuing, you agree to our{" "}
                    <a href="#" className="text-[#f97316] hover:underline">
                      Terms{" "}
                    </a>
                    and{" "}
                    <a href="#" className="text-[#f97316] hover:underline">
                      Privacy Policy.
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-slate-100/50 via-slate-50/30 to-transparent dark:from-slate-800/50 dark:via-slate-900/30 dark:to-transparent p-8 lg:p-12 lg:min-h-full">
                <div className="flex items-center gap-4 mb-8">
                  <div className="inline-flex items-center gap-2 bg-[#f97316]/10 border border-[#f97316]/30 text-[#f97316] rounded-full px-4 py-1.5 text-sm font-medium">
                    Built for Developers
                  </div>
                </div>
                
                <div className="mb-8 rounded-xl overflow-hidden border border-border/50 shadow-lg">
                  <img
                    src="/signup-image.png"
                    alt="Fast SaaS Dashboard Preview"
                    className="w-full h-64 object-cover"
                  />
                </div>
                
                <div className="gap-6 grid">
                  <div className="flex gap-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-[#f97316] text-[#f97316] flex-shrink-0">
                      <Shield className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-medium text-sm mb-1">Complete Authentication</p>
                      <p className="text-muted-foreground text-sm">
                        OAuth, email verification, password reset - everything you need to secure your app.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-[#1e40af] text-[#1e40af] flex-shrink-0">
                      <Zap className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-medium text-sm mb-1">Production Ready</p>
                      <p className="text-muted-foreground text-sm">
                        Type-safe APIs, database migrations, and deployment configs ready to ship.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-emerald-500 text-emerald-500 flex-shrink-0">
                      <Code2 className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-medium text-sm mb-1">Modern Stack</p>
                      <p className="text-muted-foreground text-sm">
                        Next.js 15, TypeScript, tRPC, Prisma, and Tailwind CSS for rapid development.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </>
  );
}