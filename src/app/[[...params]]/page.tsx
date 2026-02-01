"use client";

import dynamic from "next/dynamic";

const ClientApp = dynamic(() => import("@/frontend/app"), {
  ssr: false,
});
export default function Root() {
  return <ClientApp />;
}
