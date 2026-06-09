import { NextRequest, NextResponse } from "next/server";
import { TOKEN_COOKIE, findUserByCredentials } from "../_mock-data";
import { signToken } from "@/shared/lib/jwt";

// In-memory rate limiter — development only.
// Production (serverless): replace with Upstash Redis + @upstash/ratelimit.
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = attempts.get(ip);

  if (!record || record.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (record.count >= MAX_ATTEMPTS) return true;
  record.count++;
  return false;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { message: "Too many login attempts. Try again in 15 minutes." },
      { status: 429 },
    );
  }

  const body = (await request.json()) as {
    username: string;
    password: string;
  };

  const user = findUserByCredentials(body.username, body.password);

  if (!user) {
    return NextResponse.json(
      { message: "Invalid username or password" },
      { status: 401 },
    );
  }

  const token = await signToken({
    sub: user.account.id,
    username: user.account.username,
    role: user.account.role,
  });

  const response = NextResponse.json(user.account);
  response.cookies.set(TOKEN_COOKIE.name, token, TOKEN_COOKIE.options);
  return response;
}
