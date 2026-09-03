import { API_BASE_URL } from "./constants";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Access tokens expire after 15 minutes (see apps/api ACCESS_TOKEN_TTL) while
// the refresh token cookie lasts 30 days — without this, every request would
// start failing 15 minutes into a session even though the refresh token is
// still valid. Concurrent 401s share one in-flight refresh call instead of
// each firing their own.
let refreshPromise: Promise<boolean> | null = null;

function refreshAccessToken(): Promise<boolean> {
  refreshPromise ??= fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

async function toResult<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => undefined);
    throw new ApiError(res.status, body?.error ?? res.statusText, body?.details);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const doFetch = () =>
    fetch(`${API_BASE_URL}${path}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", ...init?.headers },
      ...init,
    });

  const res = await doFetch();

  if (res.status === 401 && path !== "/auth/refresh" && (await refreshAccessToken())) {
    return toResult<T>(await doFetch());
  }

  return toResult<T>(res);
}
