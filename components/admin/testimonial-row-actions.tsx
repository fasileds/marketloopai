"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function TestimonialRowActions({ id, published }: { id: string; published: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function togglePublished() {
    setPending(true);
    const res = await fetch(`/api/admin/testimonials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    setPending(false);
    if (!res.ok) {
      toast.error("Failed to update.");
      return;
    }
    router.refresh();
  }

  async function onDelete() {
    if (!window.confirm("Delete this testimonial?")) return;
    setPending(true);
    const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    setPending(false);
    if (!res.ok) {
      toast.error("Failed to delete.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={togglePublished}
        disabled={pending}
        className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
      >
        {published ? "Unpublish" : "Publish"}
      </button>
      <button
        type="button"
        onClick={onDelete}
        disabled={pending}
        aria-label="Delete testimonial"
        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
      >
        <Trash2 className="size-4" aria-hidden />
      </button>
    </div>
  );
}
