import { SignJWT, jwtVerify } from "jose";
import type { AccountRole } from "@satellite-control/entity-account";

export interface JwtPayload {
  sub: string;
  username: string;
  role: AccountRole;
}

function getSecret(): Uint8Array {
  const secret =
    process.env.JWT_SECRET ?? "dev-secret-do-not-use-in-production";
  return new TextEncoder().encode(secret);
}

export async function signToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as unknown as JwtPayload;
}
