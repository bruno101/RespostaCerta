import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const path = req.nextUrl.pathname;
  if (!token || !token.role) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }
  if (token.role !== "admin" && path.startsWith("admin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (
    token.role !== "admin" &&
    token.role !== "corretor" &&
    path.startsWith("corrigir-questoes")
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/painel/:path*", "/questoes/:path+"],
};
