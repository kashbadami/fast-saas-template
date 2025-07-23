"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function AuthLoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn("credentials", {
        email,
        callbackUrl,
      });
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: string) => {
    setLoadingProvider(provider);
    try {
      await signIn(provider, { callbackUrl });
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
      setLoadingProvider(null);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-white">Welcome</h1>
                <p className="text-gray-300 text-balance">
                  Sign in to your account
                </p>
              </div>
              
              {/* OAuth Providers */}
              <div className="grid gap-3">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  onClick={() => handleOAuthSignIn("google")}
                  disabled={loadingProvider !== null}
                >
                  {loadingProvider === "google" ? (
                    "Signing in..."
                  ) : (
                    <>
                      <svg
                        className="mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      Continue with Google
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  onClick={() => handleOAuthSignIn("discord")}
                  disabled={loadingProvider !== null}
                >
                  {loadingProvider === "discord" ? (
                    "Signing in..."
                  ) : (
                    <>
                      <svg
                        className="mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
                          fill="currentColor"
                        />
                      </svg>
                      Continue with Discord
                    </>
                  )}
                </Button>
              </div>

              {/* Development Mode Credentials */}
              {process.env.NODE_ENV === "development" && (
                <>
                  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-gray-600">
                    <span className="relative z-10 bg-card px-2 text-gray-400">
                      Or use development login
                    </span>
                  </div>
                  
                  <form onSubmit={handleCredentialsSubmit}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="test@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading || loadingProvider !== null}
                      >
                        {isLoading ? "Signing in..." : "Sign in with Email"}
                      </Button>
                    </div>
                  </form>
                </>
              )}

              <div className="text-center text-sm text-gray-400">
                Don&apos;t have an account?{" "}
                <span className="text-gray-300">
                  Sign in to create one
                </span>
              </div>
            </div>
          </div>
          
          <div className="relative hidden bg-gray-900 md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20" />
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="text-center">
                <h2 className="mb-4 text-3xl font-bold text-white">
                  Fast SaaS Template
                </h2>
                <p className="text-gray-300">
                  Build your next SaaS application with confidence using the T3 Stack
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center text-xs text-gray-400">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline underline-offset-4 hover:text-gray-300">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4 hover:text-gray-300">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}