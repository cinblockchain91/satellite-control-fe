import { NextRequest, NextResponse } from "next/server";
import { TOKEN_COOKIE } from "../_mock-data";
import { verifyToken, signToken } from "@/shared/lib/jwt";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE.name)?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await verifyToken(token);
    const newToken = await signToken({
      sub: payload.sub,
      username: payload.username,
      role: payload.role,
    });

    const response = new NextResponse(null, { status: 200 });
    response.cookies.set(TOKEN_COOKIE.name, newToken, TOKEN_COOKIE.options);
    return response;
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
