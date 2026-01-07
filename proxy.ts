import createMiddleware from "next-intl/middleware";
import { routing } from "@/shared/i18n/routing";
import { NextRequest, NextResponse } from "next/server";
// import { auth } from "./app/lib/auth/auth";

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

  /**
   * 2. Auth check
   */
  // if (request.nextUrl.pathname.startsWith("/dashboard")) {
  //   const session = await auth.api.getSession({
  //     headers: request.headers,
  //   });

  //   if (!session) {
  //     return NextResponse.redirect(new URL("/sign-in", request.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
