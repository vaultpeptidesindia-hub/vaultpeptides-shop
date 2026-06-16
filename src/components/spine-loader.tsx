"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const SpineBackground = dynamic(
  () => import("@/components/spine-background").then((m) => m.SpineBackground),
  { ssr: false }
);

export function SpineLoader() {
  const pathname = usePathname();
  // The 3D spine only shows through the homepage hero (every other page has a
  // solid background covering it). Mounting the WebGL render loop on those pages
  // just burns GPU/main-thread and makes navigation feel laggy — so gate it to "/".
  if (pathname !== "/") return null;
  return <SpineBackground />;
}
