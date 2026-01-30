import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === 'admin';
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
    const isProfileRoute = req.nextUrl.pathname.startsWith('/profile');

    // Protect admin routes
    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Protect profile routes
    if (isProfileRoute && !token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const publicRoutes = ['/', '/login', '/shop', '/help', '/terms', '/privacy'];
        const isPublicRoute = publicRoutes.some(route =>
          req.nextUrl.pathname === route ||
          req.nextUrl.pathname.startsWith('/shop/')
        );

        // Allow access to public routes
        if (isPublicRoute) return true;

        // Require authentication for all other routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icons/ (icon files)
     * - images/ (image files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icons|images).*)',
  ],
};