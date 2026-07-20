import { Compass } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 flex justify-center">
        <div
          className="h-[50vh] w-[50vh] rounded-full opacity-25 blur-[120px]"
          style={{
            background: "radial-gradient(circle at center, var(--glow-primary), transparent 65%)",
          }}
        />
      </div>

      <div className="glass noise-overlay flex flex-col items-center gap-4 rounded-2xl px-8 py-12 sm:px-16">
        <Compass className="size-8 text-primary" aria-hidden />
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          404
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          This page took a wrong <span className="text-gradient">turn</span>
        </h1>
        <p className="max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get
          you back on track.
        </p>
        <Button className="mt-4 h-11 px-6 text-sm" nativeButton={false} render={<Link href="/" />}>
          Back to home
        </Button>
      </div>
    </section>
  );
}
