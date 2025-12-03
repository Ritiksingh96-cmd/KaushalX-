import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and internal Next.js routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/_") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Initialize response
  const response = NextResponse.next();

  // Add security headers for all routes
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // API routes middleware
  if (pathname.startsWith("/api")) {
    // Add CORS headers (restrict origin in production)
    response.headers.set("Access-Control-Allow-Origin", process.env.NODE_ENV === "production" ? "https://kaushalx-skillswap.vercel.app" : "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 200, headers: response.headers });
    }

    // API versioning
    response.headers.set("X-API-Version", "1.0.0");
    response.headers.set("X-Powered-By", "KAUSHALX");

    return response;
  }

  // Page routes middleware
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};