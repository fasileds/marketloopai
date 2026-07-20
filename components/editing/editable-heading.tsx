"use client";

import { highlightLastWord } from "@/lib/content/highlight";

import { EditableText } from "./editable-text";
import { useEditMode } from "./edit-mode-context";

/**
 * Headings render with a gradient highlight on their last word
 * (see highlightLastWord). That gradient markup isn't something a plain
 * contentEditable span can round-trip, so while editing we drop to plain
 * text and let the gradient re-apply once the admin blurs/saves.
 */
export function EditableHeading({ contentKey, value }: { contentKey: string; value: string }) {
  const { isAdmin, editMode } = useEditMode();

  if (isAdmin && editMode) {
    return <EditableText contentKey={contentKey} value={value} />;
  }

  return <>{highlightLastWord(value)}</>;
}
