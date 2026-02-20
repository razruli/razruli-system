import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "@/shared/i18n/routing";

import { auth } from "./server/auth/auth";

// next-intl middleware
const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  /**
   * 1. i18n
   */
  const intlResponse = intlMiddleware(request);

  if (intlResponse) {
    return intlResponse;
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
