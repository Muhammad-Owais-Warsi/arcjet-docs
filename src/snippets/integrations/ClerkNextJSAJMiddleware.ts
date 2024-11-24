import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import arcjet, { createMiddleware, shield } from "@arcjet/next";
import { NextResponse } from "next/server";

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/clerk-middleware
  // for more information about configuring your Middleware
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

const isProtectedRoute = createRouteMatcher(["/api/private"]);

const clerk = clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    auth.protect();
  }

  return NextResponse.next();
});

const aj = arcjet({
  key: process.env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
  rules: [
    // Protect against common attacks with Arcjet Shield
    shield({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
    }),
  ],
});

// Clerk middleware will run after the Arcjet middleware. You could also use
// Clerk's beforeAuth options to run Arcjet first. See
// https://clerk.com/docs/references/nextjs/auth-middleware#use-before-auth-to-execute-middleware-before-authentication
export default createMiddleware(aj, clerk);
