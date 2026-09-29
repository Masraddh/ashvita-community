import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || "super-secret-ashvita-key-change-me-in-production";
const key = new TextEncoder().encode(secretKey);

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Public paths
  if (path === '/login' || path === '/' || path.startsWith('/api/') || path.startsWith('/_next') || path.includes('.')) {
    return NextResponse.next();
  }

  // Get token
  const token = request.cookies.get('session')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });

    const role = payload.role as string;

    // Role-based protection
    if (path.startsWith('/resident') && role !== 'RESIDENT') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (path.startsWith('/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (path.startsWith('/security') && role !== 'SECURITY') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
