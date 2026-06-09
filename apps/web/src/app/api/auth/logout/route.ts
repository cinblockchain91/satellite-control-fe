import { NextResponse } from "next/server";
import { TOKEN_COOKIE } from "../_mock-data";

export async function POST() {
  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(TOKEN_COOKIE.name, "", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
  return response;
}
