import { NextResponse, type NextRequest } from "next/server";
import { verifyToken } from "@/shared/lib/jwt";

const PUBLIC_PATHS = ["/login"];
const LOCALE_REGEX = /^\/(en|vi)(\/|$)/;
const DEFAULT_LOCALE = "en";

function clearTokenAndRedirect(url: URL): NextResponse {
  const response = NextResponse.redirect(url);
  response.cookies.set("access_token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!LOCALE_REGEX.test(pathname)) {
    if (pathname.startsWith("/api")) {
      return NextResponse.next();
    }
    const target = pathname === "/" ? "/login" : pathname;
    return NextResponse.redirect(
      new URL(`/${DEFAULT_LOCALE}${target}`, request.url),
    );
  }

  const locale = LOCALE_REGEX.exec(pathname)?.[1] ?? DEFAULT_LOCALE;
  const pathnameWithoutLocale = pathname.replace(LOCALE_REGEX, "/");

  const isPublic = PUBLIC_PATHS.some(
    (p) =>
      pathnameWithoutLocale === p || pathnameWithoutLocale.startsWith(p + "/"),
  );

  const rawToken = request.cookies.get("access_token")?.value;

  if (!rawToken) {
    if (isPublic) return NextResponse.next();
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // Verify JWT signature — expired or tampered tokens are rejected
  let isValidToken = false;
  try {
    await verifyToken(rawToken);
    isValidToken = true;
  } catch {
    isValidToken = false;
  }

  if (!isValidToken) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    return clearTokenAndRedirect(loginUrl);
  }

  if (isPublic) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
  runtime: "nodejs",
};
