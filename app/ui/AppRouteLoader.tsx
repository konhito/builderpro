"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const MIN_MS = 1500;

export default function AppRouteLoader() {
  const pathname = usePathname();
  const search = useSearchParams();
  const key = `${pathname}?${search.toString()}`;

  const [visible, setVisible] = useState(false); // hidden on initial mount
  const pendingKey = useRef<string | null>(key);
  const minElapsed = useRef(false);
  const minTimer = useRef<number | null>(null);

  // When the URL changes, mark a new pending navigation and enforce min time
  useEffect(() => {
    pendingKey.current = key;
    minElapsed.current = false;
    setVisible(true);
    if (minTimer.current) window.clearTimeout(minTimer.current);
    minTimer.current = window.setTimeout(() => {
      minElapsed.current = true;
      // If the route has already rendered for the same key, we can hide now
      if ((window as Window & { __lastRenderedRouteKey?: string }).__lastRenderedRouteKey === pendingKey.current) {
        setVisible(false);
      }
    }, MIN_MS);

    // announce target for other listeners (optional)
    window.dispatchEvent(new CustomEvent("route:target", { detail: key }));
  }, [key]);

  // Listen for the "rendered" event to know when content for the target key
  // has committed to the DOM. We only hide after both conditions are true:
  // (1) rendered for current key AND (2) minimum time elapsed.
  useEffect(() => {
    function onRendered(e: CustomEvent<string>) {
      const detail = e.detail;
      if (detail === pendingKey.current && minElapsed.current) {
        setVisible(false);
      }
    }
    window.addEventListener("route:rendered", onRendered as EventListener);
    return () => window.removeEventListener("route:rendered", onRendered as EventListener);
  }, []);

  return visible ? <div className="loader-timco" /> : null;
}
