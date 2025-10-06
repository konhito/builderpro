"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function RouteRenderedAnnouncer() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    const key = `${pathname}?${search.toString()}`;
    (window as Window & { __lastRenderedRouteKey?: string }).__lastRenderedRouteKey = key;
    window.dispatchEvent(new CustomEvent<string>("route:rendered", { detail: key }));
  }, [pathname, search]);

  return null;
}
