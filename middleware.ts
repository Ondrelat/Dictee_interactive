import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // 1. Autorise toujours les routes d'authentification
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // 2. Pour toutes les autres routes API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    try {
      const token = await getToken({ 
        req: request,
        secret: process.env.NEXTAUTH_SECRET 
      });

      if (!token) {
        return new NextResponse(
          JSON.stringify({ error: 'Non authentifié' }),
          {
            status: 401,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }

      // 3. Ajoute le token aux headers pour l'API
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('user', JSON.stringify(token));

      // 4. Continue avec les headers modifiés
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        }
      });
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ error: 'Erreur d authentification' }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  }

  // 5. Laisse passer les autres requêtes
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*'  // Applique le middleware à toutes les routes API
  ]
};