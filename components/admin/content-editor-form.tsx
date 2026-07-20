"use client";

import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ContentField } from "@/lib/content/registry";

export function ContentEditorForm({
  fields,
  values,
}: {
  fields: ContentField[];
  values: Record<string, string>;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState(values);
  const [saving, setSaving] = useState(false);

  const groups = Array.from(new Set(fields.map((f) => f.group)));

  async function onSave() {
    setSaving(true);
    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values: draft }),
    });
    setSaving(false);

    if (!res.ok) {
      toast.error("Failed to save. Check the JSON fields for syntax errors.");
      return;
    }

    toast.success("Content saved.");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-10">
      {groups.map((group) => (
        <section key={group}>
          <h2 className="mb-4 text-base font-semibold">{group}</h2>
          <div className="flex flex-col gap-4">
            {fields
              .filter((f) => f.group === group)
              .map((f) => (
                <div key={f.key} className="flex flex-col gap-1.5">
                  <Label htmlFor={f.key}>{f.label}</Label>
                  {f.type === "text" ? (
                    <Input
                      id={f.key}
                      value={draft[f.key] ?? ""}
                      onChange={(e) => setDraft((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    />
                  ) : (
                    <textarea
                      id={f.key}
                      value={draft[f.key] ?? ""}
                      onChange={(e) => setDraft((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      rows={f.type === "json" ? 8 : 3}
                      className={`w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 ${
                        f.type === "json" ? "font-mono text-xs" : ""
                      }`}
                    />
                  )}
                  <p className="text-xs text-muted-foreground">
                    <code>{f.key}</code>
                  </p>
                </div>
              ))}
          </div>
        </section>
      ))}

      <Button size="lg" className="sticky bottom-4 w-fit self-start px-6" disabled={saving} onClick={onSave}>
        {saving ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Save className="size-4" aria-hidden />}
        Save all changes
      </Button>
    </div>
  );
}
