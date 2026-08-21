import { type NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Exclure les routes publiques admin
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // 2. Ne protéger que les routes admin (sauf login)
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // 3. Vérifier les variables d'environnement
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  // 4. Créer le client Supabase
  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // 5. Vérifier l'authentification
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 6. Si non authentifié → rediriger vers login avec redirectedFrom
  if (!user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    // ✅ Conserver le paramètre redirectedFrom s'il existe
    const originalRedirect = request.nextUrl.searchParams.get("redirectedFrom");
    if (originalRedirect) {
      redirectUrl.search = `?redirectedFrom=${encodeURIComponent(originalRedirect)}`;
    } else {
      // Si on est sur une page admin et qu'il n'y a pas de redirectedFrom,
      // on sauvegarde la page actuelle comme redirectedFrom
      redirectUrl.search = `?redirectedFrom=${encodeURIComponent(pathname + request.nextUrl.search)}`;
    }
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
