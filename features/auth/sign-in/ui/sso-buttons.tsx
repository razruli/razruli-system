"use client";

import { useState } from "react";

import { Github } from "lucide-react";

import { authClient } from "@/shared/lib/auth/auth-client";
import { Button } from "@/shared/ui/shadcn/button";

export function SSOButtons() {
  const [githubLoading, setGithubLoading] = useState(false);

  const handleGitHubSignIn = async () => {
    setGithubLoading(true);
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/onboarding",
        errorCallbackURL: "/auth/signin",
      });
    } catch (error) {
      console.error("GitHub sign-in failed:", error);
      setGithubLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={handleGitHubSignIn}
        disabled={githubLoading}
      >
        <Github className="mr-2 h-4 w-4" />
        {githubLoading ? "Signing in..." : "GitHub"}
      </Button>
    </div>
  );
}
