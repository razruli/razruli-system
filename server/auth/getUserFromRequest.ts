"use server";
import { headers } from "next/headers";

import { auth } from "./auth";

export interface Session {
  user: any;
  session?: any;
}

/**
 * Get session from request headers
 * Returns session for authenticated users, null for unauthenticated
 */
export async function getUserFromRequest(): Promise<Session | null> {
  try {
    const nextHeaders = await headers();

    const session = await auth.api.getSession({
      headers: nextHeaders,
      query: { disableCookieCache: true },
    });

    if (!session || !session.user) {
      return null;
    }

    return session;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}
