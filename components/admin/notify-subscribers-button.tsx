"use client";

import { Loader2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function NotifySubscribersButton({
  postId,
  subscriberCount,
  notifiedAt,
  notifiedCount,
}: {
  postId: string;
  subscriberCount: number;
  notifiedAt: string | null;
  notifiedCount: number | null;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onNotify() {
    const confirmed = window.confirm(
      notifiedAt
        ? `This post was already emailed on ${new Date(notifiedAt).toLocaleDateString()}. Send it again to all ${subscriberCount} subscriber${subscriberCount === 1 ? "" : "s"}?`
        : `Email this post to all ${subscriberCount} waitlist subscriber${subscriberCount === 1 ? "" : "s"}?`,
    );
    if (!confirmed) return;

    setPending(true);
    const res = await fetch(`/api/admin/blog/${postId}/notify`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setPending(false);

    if (!res.ok) {
      toast.error(data.error ?? "Failed to send notification emails.");
      return;
    }

    toast.success(`Emailed ${data.sent} subscriber${data.sent === 1 ? "" : "s"}.`);
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onNotify}
      disabled={pending || subscriberCount === 0}
    >
      {pending ? (
        <Loader2 className="size-3.5 animate-spin" aria-hidden />
      ) : (
        <Mail className="size-3.5" aria-hidden />
      )}
      {notifiedAt ? `Sent to ${notifiedCount ?? "?"}` : "Notify subscribers"}
    </Button>
  );
}
