import { NextRequest, NextResponse } from "next/server";
import { TOKEN_COOKIE } from "../_mock-data";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE.name)?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const response = new NextResponse(null, { status: 200 });
  response.cookies.set(
    TOKEN_COOKIE.name,
    TOKEN_COOKIE.value,
    TOKEN_COOKIE.options,
  );
  return response;
}
