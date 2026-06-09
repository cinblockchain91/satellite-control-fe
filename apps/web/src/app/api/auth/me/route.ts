import { NextRequest, NextResponse } from "next/server";
import { MOCK_ACCOUNT, TOKEN_COOKIE } from "../_mock-data";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE.name)?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(MOCK_ACCOUNT);
}
