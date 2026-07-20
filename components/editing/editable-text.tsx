"use client";

import { useRef, useState, type FocusEvent, type KeyboardEvent, type MouseEvent } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { useEditMode } from "./edit-mode-context";

/**
 * Renders `value` as plain text. When an admin has edit mode on, the same
 * text becomes an inline contentEditable span that PATCHes the change to
 * /api/admin/content on blur — the same endpoint the /admin/content
 * dashboard form already uses, so both stay in sync.
 */
export function EditableText({
  contentKey,
  value,
  className,
  multiline = false,
}: {
  contentKey: string;
  value: string;
  className?: string;
  multiline?: boolean;
}) {
  const { isAdmin, editMode } = useEditMode();
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const ref = useRef<HTMLSpanElement>(null);
  const lastSaved = useRef(value);

  if (!isAdmin || !editMode) {
    return <span className={className}>{value}</span>;
  }

  async function handleBlur(e: FocusEvent<HTMLSpanElement>) {
    const next = e.currentTarget.innerText.trim();
    if (next.length === 0) {
      e.currentTarget.innerText = lastSaved.current;
      return;
    }
    if (next === lastSaved.current) return;

    setStatus("saving");
    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values: { [contentKey]: next } }),
    });

    if (!res.ok) {
      setStatus("error");
      toast.error(`Couldn't save this change`, { description: contentKey });
      e.currentTarget.innerText = lastSaved.current;
      setTimeout(() => setStatus("idle"), 1200);
      return;
    }

    lastSaved.current = next;
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 1100);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLSpanElement>) {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }
    if (e.key === "Escape") {
      e.currentTarget.innerText = lastSaved.current;
      e.currentTarget.blur();
    }
  }

  function handleClick(e: MouseEvent<HTMLSpanElement>) {
    // Editable spans often sit inside <a> / <button> — stop the parent's
    // default action (navigation, submit) from firing while editing.
    e.preventDefault();
  }

  return (
    <span
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      className={cn(
        className,
        "editable-field rounded-[0.3em] px-[0.15em] py-px outline-none",
        "cursor-text decoration-primary/40 decoration-2 underline-offset-4 transition-[background-color,box-shadow] duration-150",
        "hover:bg-primary/[0.07] hover:shadow-[0_0_0_1px_var(--primary)] hover:shadow-primary/25",
        "focus:bg-primary/[0.08] focus:shadow-[0_0_0_2px_var(--primary)]",
        status === "saving" && "animate-pulse bg-primary/10 opacity-70",
        status === "saved" && "bg-emerald-500/15 shadow-[0_0_0_2px_rgb(16_185_129/0.6)]",
        status === "error" && "bg-destructive/15 shadow-[0_0_0_2px_var(--destructive)]",
      )}
    >
      {value}
    </span>
  );
}
