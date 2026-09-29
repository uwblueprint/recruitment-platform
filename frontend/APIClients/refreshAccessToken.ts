import jwt_decode from "jwt-decode";

type RefreshToken = (token: string) => Promise<string | null | undefined>;
let pendingRefresh: Promise<void> | undefined;

// Deduplicates concurrent refreshes for operations that opt into auth refresh.
export async function refreshAccessToken(refresh: RefreshToken): Promise<void> {
  if (pendingRefresh) return pendingRefresh;

  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  if (!accessToken || !refreshToken) {
    throw new Error("No access or refresh token provided");
  }

  const { exp } = jwt_decode<{ exp: number }>(accessToken);
  if (exp > Math.round(Date.now() / 1000)) return;

  pendingRefresh = (async () => {
    try {
      const token = await refresh(refreshToken);
      if (typeof token !== "string" || !token) {
        throw new Error("No access token returned");
      }
      localStorage.setItem("accessToken", token);
    } catch (error) {
      localStorage.clear();
      window.location.reload();
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to refresh accessToken token. Cause: ${message}`);
    }
  })();

  try {
    await pendingRefresh;
  } finally {
    pendingRefresh = undefined;
  }
}
