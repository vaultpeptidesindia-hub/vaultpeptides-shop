"use client";

import dynamic from "next/dynamic";

const SpineBackground = dynamic(
  () => import("@/components/spine-background").then((m) => m.SpineBackground),
  { ssr: false }
);

export function SpineLoader() {
  return <SpineBackground />;
}
