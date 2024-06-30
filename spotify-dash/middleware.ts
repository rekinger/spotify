import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = req.nextUrl.pathname;

  const requestHeaders = new Headers(req.headers)

  requestHeaders.set('path', path)

  // If it's the root path, just render it
  if (path === '/signin' || req.nextUrl.pathname.startsWith("/_next") || req.nextUrl.pathname.startsWith("/api/auth") || req.nextUrl.pathname.startsWith("/signin/signin")) {
    return NextResponse.next({
      request: {
        // New request headers
        headers: requestHeaders,
      },
    })
  }

  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!session) {
    return NextResponse.redirect(new URL('/signin?referer=' + path, req.url));
  } 

  return NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  })
}