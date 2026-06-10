import { SignJWT, jwtVerify } from "jose";

export const ADMIN_COOKIE = "scs3d_admin_token";
export const SESSION_HOURS = 1;

function getSecret() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return new TextEncoder().encode(password);
}

export async function createAdminToken(): Promise<string | null> {
  const secret = getSecret();
  if (!secret) return null;

  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(secret);
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  const secret = getSecret();
  if (!secret) return false;

  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  };
}
