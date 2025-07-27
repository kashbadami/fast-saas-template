"use client";

import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { api } from "~/trpc/react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const utils = api.useUtils();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // First check the account status for better error messages
      const statusCheck = await utils.auth.checkLoginStatus.fetch({ email });
      
      if (statusCheck.status !== "ok") {
        setError(statusCheck.message);
        setIsLoading(false);
        return;
      }

      // If account is OK, proceed with login
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // If we get here, it's a wrong password
        setError("Incorrect password. Please try again.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      console.error("Login error:");
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch {
      setError("Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full px-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="w-full">
          <div className="p-8">
            <div className="flex flex-col gap-2 mb-8">
              <h1 className="text-3xl font-medium tracking-tight">
                Welcome <span className="font-playfair italic text-[#f97316]">back</span>
              </h1>
              <p className="text-muted-foreground">
                Sign in to your account to continue
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <FcGoogle className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>
              <div className="flex items-center gap-4">
                <span className="bg-input w-full h-px"></span>
                <span className="text-muted-foreground text-xs">OR</span>
                <span className="bg-input w-full h-px"></span>
              </div>
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
                  disabled={isLoading}
                />
              </div>
              <div className="gap-2 grid">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link 
                    href="/auth/forgot-password" 
                    className="text-sm text-muted-foreground hover:text-[#f97316]"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#f97316] hover:bg-[#f97316]/90" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            
            <div className="mt-8">
              <p className="text-muted-foreground text-sm text-center">
                Don&apos;t have an account?{" "}
                <Link href="/auth/signup" className="text-[#f97316] hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}