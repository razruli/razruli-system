"use client";

import { useState } from "react";

import { useSignIn, useSignUp } from "@/entities/user";
import { Button } from "@/shared/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/shadcn/card";
import { Input } from "@/shared/ui/shadcn/input";
import { Label } from "@/shared/ui/shadcn/label";

import { useSignInActions, useSignInStore } from "../";

export function SignInForm() {
  const store = useSignInStore();
  const actions = useSignInActions();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!actions.validateForm()) {
      return;
    }

    store.setIsLoading(true);
    setSubmitError(null);

    try {
      if (store.isSignUp) {
        // Sign up flow - requires name, but we'll simplify for now
        // You can enhance this to include a name field
        await signUp({
          email: store.email,
          password: store.password,
          name: store.email.split("@")[0], // Use email prefix as name for now
        });
      } else {
        // Sign in flow
        await signIn({
          email: store.email,
          password: store.password,
        });
      }
      // better-auth handles redirect
      store.resetForm();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Authentication failed";
      setSubmitError(message);
      store.setSubmitError(message);
    } finally {
      store.setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{store.isSignUp ? "Create Account" : "Sign In"}</CardTitle>
        <CardDescription>
          {store.isSignUp
            ? "Create a new account to get started"
            : "Enter your credentials to sign in"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={store.email}
              onChange={(e) => actions.setEmail(e.target.value)}
              disabled={store.isLoading}
              className={store.errors.email ? "border-destructive" : ""}
            />
            {store.errors.email && (
              <p className="text-sm text-destructive">{store.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={store.password}
              onChange={(e) => actions.setPassword(e.target.value)}
              disabled={store.isLoading}
              className={store.errors.password ? "border-destructive" : ""}
            />
            {store.errors.password && (
              <p className="text-sm text-destructive">
                {store.errors.password}
              </p>
            )}
          </div>

          {/* Submit error */}
          {submitError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {submitError}
            </div>
          )}

          {/* Submit button */}
          <Button type="submit" className="w-full" disabled={store.isLoading}>
            {store.isLoading
              ? store.isSignUp
                ? "Creating account..."
                : "Signing in..."
              : store.isSignUp
                ? "Create Account"
                : "Sign In"}
          </Button>

          {/* Toggle form type */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => actions.toggleSignUp()}
              disabled={store.isLoading}
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              {store.isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
