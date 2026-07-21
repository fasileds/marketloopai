"use client";

import { useEffect, useState } from "react";

/** Thin progress bar pinned under the navbar, tracking scroll through the article. */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-16 z-40 h-0.5 bg-transparent print:hidden">
      <div className="h-full bg-primary transition-[width]" style={{ width: `${progress * 100}%` }} />
    </div>
  );
}
