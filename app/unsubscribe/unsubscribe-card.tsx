"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function UnsubscribeCard({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "pending" | "done" | "error">("idle");

  async function onUnsubscribe() {
    setState("pending");
    const res = await fetch("/api/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setState(res.ok ? "done" : "error");
  }

  if (state === "done") {
    return (
      <div className="glass noise-overlay flex flex-col items-center gap-3 rounded-2xl p-8 text-center">
        <CheckCircle2 className="size-8 text-primary" aria-hidden />
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{email}</span> won&apos;t receive blog
          update emails anymore.
        </p>
      </div>
    );
  }

  return (
    <div className="glass noise-overlay flex flex-col items-center gap-3 rounded-2xl p-8 text-center">
      <p className="text-sm text-muted-foreground">
        Stop sending blog update emails to <span className="font-medium text-foreground">{email}</span>?
      </p>
      <Button onClick={onUnsubscribe} disabled={state === "pending"} variant="outline">
        {state === "pending" && <Loader2 className="size-4 animate-spin" aria-hidden />}
        Unsubscribe
      </Button>
      {state === "error" && (
        <p className="text-xs text-destructive">Something went wrong — please try again.</p>
      )}
    </div>
  );
}
