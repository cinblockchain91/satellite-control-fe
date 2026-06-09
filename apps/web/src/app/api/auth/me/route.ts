import { NextRequest, NextResponse } from "next/server";
import { TOKEN_COOKIE, findUserById } from "../_mock-data";
import { verifyToken } from "@/shared/lib/jwt";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE.name)?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await verifyToken(token);
    const user = findUserById(payload.sub);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(user.account);
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
