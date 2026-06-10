import { NextResponse } from "next/server";

export async function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // مسیرهایی که نیاز به لاگین دارن
  const protectedRoutes = ["/profile"];

  // اگه مسیر فعلی یکی از protected ها باشه
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const user = request.cookies.get("user")?.value;

    // اگه کوکی‌ها نبودن → بفرستش صفحه اصلی
    if (!accessToken || !user) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
