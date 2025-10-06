// Ensures the route shows the loader for at least 1.5s before rendering children.
// In combination with app/loading.tsx, this applies to all pages in the root segment.

import RouteRenderedAnnouncer from "./ui/RouteRenderedAnnouncer";
import { Suspense } from "react";

export default async function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const MIN_MS = 1500;
  await new Promise((res) => setTimeout(res, MIN_MS));
  return (
    <>
      <Suspense fallback={null}>
        <RouteRenderedAnnouncer />
      </Suspense>
      {children}
    </>
  );
}
