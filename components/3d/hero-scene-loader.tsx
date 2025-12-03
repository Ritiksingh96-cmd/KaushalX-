"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import HeroScene with SSR disabled
const HeroScene = dynamic(() => import("./hero-scene"), {
  ssr: false,
  loading: () => null,
});

export default function HeroSceneLoader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;
  return <HeroScene />;
}
