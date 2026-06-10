import { Redis } from "@upstash/redis";
import { getRuntimeEnv } from "@/lib/env";

export function getRedis(): Redis | null {
  const url = getRuntimeEnv("KV_REST_API_URL", "UPSTASH_REDIS_REST_URL");
  const token = getRuntimeEnv("KV_REST_API_TOKEN", "UPSTASH_REDIS_REST_TOKEN");
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export function isKvConfigured(): boolean {
  return getRedis() !== null;
}
