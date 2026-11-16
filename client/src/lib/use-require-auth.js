"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-context";

/**
 * Sends a visitor to the login page only when the server confirms they are really logged out,
 * and remembers `returnPath` so that logging in brings them back to this page.
 *
 * Why not just `if (!isAuthenticated) router.push("/auth")`?
 *  - while the session is still loading `isAuthenticated` is false, so every refresh bounced logged-in users, and
 *  - right after a login the page can render a moment before the auth state has caught up.
 * Asking the server first removes both cases.
 */
export function useRequireAuth(returnPath) {
  const { isAuthenticated, loading, refreshUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || isAuthenticated) return;
    let cancelled = false;
    (async () => {
      const fresh = await refreshUser();
      if (!cancelled && !fresh) {
        const path = returnPath || (typeof window !== "undefined" ? window.location.pathname : "/");
        router.push("/auth?redirect=" + encodeURIComponent(path));
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, loading, returnPath]);

  return { isAuthenticated, loading };
}

/** Accepts only same-site paths ("/checkout", "checkout", "/wishlist?x=1"); anything else becomes "/". */
export function safeReturnPath(raw) {
  if (!raw) return "/";
  let value = raw;
  try {
    value = decodeURIComponent(raw);
  } catch {
    return "/";
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith("//")) return "/";
  return value.startsWith("/") ? value : "/" + value;
}
