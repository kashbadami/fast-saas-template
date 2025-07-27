"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  const verifyMutation = api.auth.verifyEmail.useMutation({
    onSuccess: (data) => {
      setStatus("success");
      setMessage(data.message);
    },
    onError: (error) => {
      setStatus("error");
      setMessage(error.message);
    },
  });

  useEffect(() => {
    if (token) {
      verifyMutation.mutate({ token });
    } else {
      setStatus("error");
      setMessage("No verification token provided");
    }
  }, [token, verifyMutation]);

  return (
    <section className="w-full px-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="w-full">
          <CardHeader className="text-center">
            <h1 className="text-2xl font-bold">Email Verification</h1>
          </CardHeader>
          <CardContent className="text-center">
            {status === "loading" && (
              <p className="text-muted-foreground">Verifying your email...</p>
            )}
            
            {status === "success" && (
              <div className="space-y-4">
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
                <p className="text-lg font-medium">{message}</p>
                <Link href="/auth/login">
                  <Button className="w-full">Go to Login</Button>
                </Link>
              </div>
            )}
            
            {status === "error" && (
              <div className="space-y-4">
                <div className="text-red-600">
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
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-lg font-medium text-red-600">{message}</p>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    The link may have expired or already been used.
                  </p>
                  <Link href="/auth/login">
                    <Button variant="outline" className="w-full">
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <section className="w-full px-4">
        <div className="w-full max-w-md mx-auto">
          <Card className="w-full">
            <CardHeader className="text-center">
              <h1 className="text-2xl font-bold">Email Verification</h1>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        </div>
      </section>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}