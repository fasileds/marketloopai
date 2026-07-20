"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { slugify } from "@/lib/slug";
import { legalPageSchema, type LegalPageInput } from "@/lib/validations/legal-page";

function readingStats(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return { words, minutes: Math.max(1, Math.round(words / 200)) };
}

export function LegalPageForm({
  pageId,
  defaultValues,
}: {
  pageId?: string;
  defaultValues?: Partial<LegalPageInput>;
}) {
  const router = useRouter();
  const [slugTouched, setSlugTouched] = useState(!!pageId);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LegalPageInput>({
    resolver: zodResolver(legalPageSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      published: true,
      ...defaultValues,
    },
  });

  const title = watch("title");
  const content = watch("content");
  const published = watch("published");
  const { words, minutes } = readingStats(content ?? "");
  const paragraphs = (content ?? "").split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  async function onSubmit(values: LegalPageInput) {
    const res = await fetch(pageId ? `/api/admin/legal/${pageId}` : "/api/admin/legal", {
      method: pageId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Failed to save page.");
      return;
    }

    toast.success(pageId ? "Page updated." : "Page created.");
    router.push("/admin/legal");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start" noValidate>
      <div className="flex min-w-0 flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Input
            id="legal-title"
            placeholder="Page title"
            {...register("title", {
              onChange: (e) => {
                if (!slugTouched) setValue("slug", slugify(e.target.value));
              },
            })}
            aria-invalid={!!errors.title}
            className="h-auto border-none bg-transparent px-0 text-2xl font-semibold tracking-tight shadow-none outline-none focus-visible:border-none focus-visible:ring-0"
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm text-muted-foreground">
          <span className="shrink-0">/legal/</span>
          <input
            id="legal-slug"
            {...register("slug", { onChange: () => setSlugTouched(true) })}
            aria-invalid={!!errors.slug}
            className="min-w-0 flex-1 bg-transparent text-foreground outline-none"
          />
        </div>
        {errors.slug && <p className="-mt-3 text-xs text-destructive">{errors.slug.message}</p>}

        <Tabs defaultValue="write">
          <TabsList>
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="write" className="flex flex-col gap-2">
            <textarea
              id="legal-content"
              rows={20}
              {...register("content")}
              aria-invalid={!!errors.content}
              className="w-full rounded-lg border border-input bg-transparent px-3 py-3 text-sm leading-relaxed outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              placeholder="Write in plain paragraphs, separated by a blank line."
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {words} word{words === 1 ? "" : "s"} · ~{minutes} min read
              </span>
              {errors.content && <span className="text-destructive">{errors.content.message}</span>}
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <article className="rounded-lg border border-border px-4 py-4 sm:px-6">
              <h2 className="text-balance text-xl font-semibold tracking-tight">
                {title || "Untitled page"}
              </h2>
              <div className="mt-4 space-y-4 text-sm text-muted-foreground">
                {paragraphs.length > 0 ? (
                  paragraphs.map((p, i) => <p key={i}>{p}</p>)
                ) : (
                  <p className="italic">Nothing to preview yet.</p>
                )}
              </div>
            </article>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex flex-col gap-4 lg:sticky lg:top-24">
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <div>
                <Badge variant={published ? "default" : "secondary"}>
                  {published ? "Published" : "Draft"}
                </Badge>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {published ? "Live at /legal/…" : "Hidden from visitors."}
                </p>
              </div>
              <Switch
                checked={published}
                onCheckedChange={(checked) => setValue("published", checked)}
                aria-label="Published"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Save className="size-4" aria-hidden />
              )}
              {pageId ? "Save changes" : "Create page"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
}
