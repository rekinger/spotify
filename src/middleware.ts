import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = req.nextUrl.pathname;
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if(session && path === "/signin") {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // If it's the root path, just render it
  if (path === "/favicon.ico" || path === '/signin' || req.nextUrl.pathname.startsWith("/_next") || req.nextUrl.pathname.startsWith("/api/auth") || req.nextUrl.pathname.startsWith("/signin/signin")) {
    return NextResponse.next()
  }

  if (!session) {
    return NextResponse.redirect(new URL('/signin?referer=' + path, req.url));
  } 

  //console.log(session.accessToken, "expires at", new Date(session.accessTokenExpires * 1000), "so refresh with", session.refreshToken)
  //console.log("time left:", session.accessTokenExpires - (Date.now() / 1000)) 

  const response = NextResponse.next()

  return response
}