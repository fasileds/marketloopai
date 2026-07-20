"use client";

import { Eye, LayoutDashboard, Pencil, SquarePen } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { useEditMode } from "./edit-mode-context";

export const ADMIN_BAR_HEIGHT_CLASS = "h-11";

export function AdminEditBar() {
  const { isAdmin, editMode, setEditMode } = useEditMode();

  if (!isAdmin) return null;

  return (
    <div
      className={cn(
        ADMIN_BAR_HEIGHT_CLASS,
        "glass-strong fixed inset-x-0 top-0 z-[60] border-b border-border/70",
      )}
    >
      <div className="mx-auto flex h-full max-w-[100rem] items-center justify-between px-4 sm:px-6 lg:px-10">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="relative flex size-2 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          <SquarePen className="size-3.5 shrink-0 text-primary" aria-hidden />
          <span className="text-xs font-semibold tracking-tight">Admin</span>
          <span className="hidden text-xs text-muted-foreground/60 sm:inline">/</span>
          <span className="hidden truncate text-xs text-muted-foreground sm:inline">
            {editMode ? "Click any text on the page to edit it — changes save instantly" : "Previewing exactly what visitors see"}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:px-2.5"
          >
            <LayoutDashboard className="size-3.5" aria-hidden />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <div
            role="tablist"
            aria-label="Edit mode"
            className="flex items-center gap-0.5 rounded-full border border-border/80 bg-secondary/60 p-0.5 text-xs"
          >
            <button
              type="button"
              role="tab"
              aria-selected={editMode}
              onClick={() => setEditMode(true)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition-colors",
                editMode
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Pencil className="size-3.5" aria-hidden />
              Edit
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!editMode}
              onClick={() => setEditMode(false)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition-colors",
                !editMode
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Eye className="size-3.5" aria-hidden />
              Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
