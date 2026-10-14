"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// html has `scroll-behavior: smooth`, which turns the router's scroll-to-top into an animation that gets
// interrupted while the new page loads (mobile ends up mid-page). Jump instantly on every page change.
// Back/forward navigation keeps the browser's own scroll restoration.
export function ScrollToTop() {
  const pathname = usePathname();
  const isPopRef = useRef(false);

  useEffect(() => {
    const onPop = () => {
      isPopRef.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useLayoutEffect(() => {
    if (isPopRef.current) {
      isPopRef.current = false;
      return;
    }
    const root = document.documentElement;
    const jump = () => {
      const previous = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      root.style.scrollBehavior = previous;
    };
    jump();
    // Content (images, data) can still shift the page right after mount; settle at the top once more
    const t = setTimeout(jump, 120);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
