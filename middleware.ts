import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const match = pathname.match(/^\/([a-zA-Z0-9_-]+)$/);

  if (match) {
    const id = match[1];
    const cachedLink = request.cookies.get(`link_${id}`)?.value;
    
    if (cachedLink) {
      const response = NextResponse.redirect(cachedLink);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:id',
};
