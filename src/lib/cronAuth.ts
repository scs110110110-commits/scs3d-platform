import { getRuntimeEnv } from "@/lib/env";

export function verifyCronRequest(request: Request): boolean {
  const secret = getRuntimeEnv("CRON_SECRET");
  if (!secret) return false;

  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}
