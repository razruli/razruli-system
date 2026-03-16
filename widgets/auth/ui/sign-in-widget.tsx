"use client";

import { ArrowRight } from "lucide-react";

import { useGetCurrentUser } from "@/entities/user";
import { SignInForm, SSOButtons } from "@/features/auth/sign-in/ui";

export function SignInWidget() {
  const { isLoading } = useGetCurrentUser();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* LEFT SIDE: Sign-In Form */}
      <div className="flex items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center">
            <div className="flex justify-center">
              <div className="inline-flex items-center justify-center rounded-lg bg-primary/10 p-3">
                <ArrowRight className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          {/* Sign-In Form */}
          <SignInForm />

          {/* SSO Divider & Buttons */}
          <SSOButtons />

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
            <a href="#" className="underline hover:text-foreground">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-foreground">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Animation Placeholder */}
      <div className="hidden bg-linear-to-br from-primary/10 via-background to-primary/5 lg:flex items-center justify-center p-8">
        <div className="space-y-4 text-center">
          <div className="h-40 w-40 rounded-full bg-primary/20 mx-auto animate-pulse" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Organize Your Workforce</h2>
            <p className="text-muted-foreground">
              Manage employees, departments, and capacity with ease
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
