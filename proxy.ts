// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Match all AI endpoint routes (e.g., /api/chat)
const isAiRoute = createRouteMatcher(['/api/quiz(.*)','/(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // If it's an AI route, enforce authentication
  if (isAiRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
