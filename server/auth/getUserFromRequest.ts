import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "./auth";

export async function getUserFromRequest() {
  // Get the headers from the incoming request
  const requestHeaders = await headers();

  // Use auth.api.getSession to parse and validate the session cookie
  const session = await auth.api.getSession({ headers: requestHeaders });

  // Check if a session was found
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Access the user data from the session object
  // console.log("User ID:", session.user.id);

  return NextResponse.json({
    message: "Success",
    user: session.user,
  });
}
