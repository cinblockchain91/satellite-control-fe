import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login"];
const LOCALE_REGEX = /^\/(en|vi)(\/|$)/;
const DEFAULT_LOCALE = "en";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;
  console.log("[MW]", pathname);

  // Không có locale prefix → redirect thêm /en vào đầu
  // Ngoại trừ: API routes và Sentry tunnel (/monitoring)
  if (!LOCALE_REGEX.test(pathname)) {
    if (pathname.startsWith("/api") || pathname.startsWith("/monitoring")) {
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

  if (isPublic && token) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
