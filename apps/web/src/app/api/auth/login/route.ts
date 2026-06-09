import { NextRequest, NextResponse } from "next/server";
import { MOCK_ACCOUNT, MOCK_CREDENTIALS, TOKEN_COOKIE } from "../_mock-data";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    username: string;
    password: string;
  };

  if (
    body.username !== MOCK_CREDENTIALS.username ||
    body.password !== MOCK_CREDENTIALS.password
  ) {
    return NextResponse.json(
      { message: "Invalid username or password" },
      { status: 401 },
    );
  }

  const response = NextResponse.json(MOCK_ACCOUNT);
  response.cookies.set(
    TOKEN_COOKIE.name,
    TOKEN_COOKIE.value,
    TOKEN_COOKIE.options,
  );
  return response;
}
