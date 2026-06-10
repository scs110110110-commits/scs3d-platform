/**
 * Read env vars at runtime (avoids Next.js build-time inlining of undefined).
 */
export function getRuntimeEnv(...names: string[]): string {
  for (const name of names) {
    const value = process.env[name];
    if (value) return value;
  }
  return "";
}
