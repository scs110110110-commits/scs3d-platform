export async function parseApiJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  const trimmed = text.trim();

  if (trimmed.startsWith("<")) {
    if (res.status === 401 || res.status === 403) {
      throw new Error("Session expired — please log in again at /admin/login");
    }
    if (res.status === 413) {
      throw new Error("Upload too large — use smaller photos or image URLs instead.");
    }
    throw new Error(
      `Server error (${res.status}). Try smaller photos or log in again.`
    );
  }

  try {
    return JSON.parse(trimmed) as T;
  } catch {
    throw new Error("Invalid server response — try again or use image URLs.");
  }
}
