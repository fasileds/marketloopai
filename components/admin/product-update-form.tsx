"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2, Mail, Save, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { productUpdateEmail } from "@/lib/email/product-update-templates";
import { cn } from "@/lib/utils";
import {
  PRODUCT_UPDATE_TEMPLATES,
  productUpdateSchema,
  type ProductUpdateInput,
  type ProductUpdateTemplate,
} from "@/lib/validations/product-update";

const TEMPLATE_INFO: Record<ProductUpdateTemplate, { label: string; description: string }> = {
  announcement: { label: "Announcement", description: "Bold hero-style — the default." },
  changelog: { label: "Changelog", description: "\"What's new\" checklist of changes." },
  minimal: { label: "Minimal", description: "Plain, quiet, transactional-style." },
  milestone: { label: "Milestone", description: "Celebratory, centered, for big moments." },
  "feature-spotlight": { label: "Feature Spotlight", description: "Image-forward, for one new feature." },
  newsletter: { label: "Newsletter", description: "Digest-style, sectioned paragraphs." },
  "roadmap-update": { label: "Roadmap Update", description: "Numbered, timeline-style steps." },
  "big-reveal": { label: "Big Reveal", description: "Oversized, dramatic, minimal chrome." },
};

export function ProductUpdateForm({
  updateId,
  defaultValues,
  sent,
  sentAt,
  recipientCount,
  subscriberCount,
}: {
  updateId?: string;
  defaultValues?: Partial<ProductUpdateInput>;
  sent?: boolean;
  sentAt?: string | null;
  recipientCount?: number | null;
  subscriberCount: number;
}) {
  const router = useRouter();
  const [uploadingCover, setUploadingCover] = useState(false);
  const [sending, setSending] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductUpdateInput>({
    resolver: zodResolver(productUpdateSchema),
    defaultValues: {
      title: "",
      content: "",
      template: "announcement",
      coverImageUrl: "",
      ...defaultValues,
    },
  });

  const title = watch("title");
  const content = watch("content");
  const template = watch("template");
  const coverImageUrl = watch("coverImageUrl");
  const paragraphs = (content ?? "").split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  const previewHtml = productUpdateEmail(template, {
    siteName: "MarketLoopAI",
    title: title || "Untitled update",
    paragraphs: paragraphs.length > 0 ? paragraphs : ["Nothing to preview yet."],
    coverImageUrl: coverImageUrl || null,
    unsubscribeUrl: "#",
  }).html;

  async function uploadCoverImage(file: File) {
    setUploadingCover(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/blog/upload-image", { method: "POST", body: formData });
    const data = await res.json().catch(() => ({}));
    setUploadingCover(false);
    if (!res.ok) {
      toast.error(data.error ?? "Failed to upload image.");
      return;
    }
    setValue("coverImageUrl", data.url, { shouldValidate: true });
  }

  async function saveDraft(values: ProductUpdateInput): Promise<string | null> {
    const res = await fetch(updateId ? `/api/admin/product-updates/${updateId}` : "/api/admin/product-updates", {
      method: updateId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(data.error ?? "Failed to save.");
      return null;
    }
    return updateId ?? data.id;
  }

  const onSaveDraft = handleSubmit(async (values) => {
    const id = await saveDraft(values);
    if (!id) return;
    toast.success("Draft saved.");
    router.push("/admin/product-updates");
    router.refresh();
  });

  const onSend = handleSubmit(async (values) => {
    const confirmed = window.confirm(
      `Send this update to all ${subscriberCount} waitlist subscriber${subscriberCount === 1 ? "" : "s"}? This can't be undone.`,
    );
    if (!confirmed) return;

    setSending(true);
    const id = await saveDraft(values);
    if (!id) {
      setSending(false);
      return;
    }

    const res = await fetch(`/api/admin/product-updates/${id}/send`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setSending(false);

    if (!res.ok) {
      toast.error(data.error ?? "Failed to send.");
      return;
    }

    toast.success(`Sent to ${data.sent} subscriber${data.sent === 1 ? "" : "s"}.`);
    router.push("/admin/product-updates");
    router.refresh();
  });

  return (
    <form className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start" noValidate>
      <div className="flex min-w-0 flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="update-title">Title</Label>
          <Input
            id="update-title"
            placeholder="e.g. Ranked variations are here"
            {...register("title")}
            disabled={sent}
            aria-invalid={!!errors.title}
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>

        <Tabs defaultValue="write">
          <TabsList>
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview email</TabsTrigger>
          </TabsList>

          <TabsContent value="write" className="flex flex-col gap-2">
            <textarea
              id="update-content"
              rows={14}
              {...register("content")}
              disabled={sent}
              aria-invalid={!!errors.content}
              className="w-full rounded-lg border border-input bg-transparent px-3 py-3 text-sm leading-relaxed outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 disabled:opacity-60"
              placeholder="Write in plain paragraphs, separated by a blank line."
            />
            {errors.content && <span className="text-xs text-destructive">{errors.content.message}</span>}
          </TabsContent>

          <TabsContent value="preview">
            <div className="overflow-hidden rounded-lg border border-border">
              <iframe title="Email preview" srcDoc={previewHtml} className="h-[600px] w-full bg-secondary/30" />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex flex-col gap-4 lg:sticky lg:top-24">
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Badge>Sent</Badge>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Sent to {recipientCount ?? "?"} subscriber{recipientCount === 1 ? "" : "s"}
                    {sentAt && ` on ${new Date(sentAt).toLocaleDateString()}`}.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Badge variant="secondary">Draft</Badge>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Not sent yet. {subscriberCount} subscriber{subscriberCount === 1 ? "" : "s"} on the waitlist.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          {!sent && (
            <CardFooter className="flex flex-col gap-2">
              <Button
                type="button"
                onClick={onSend}
                disabled={isSubmitting || sending || subscriberCount === 0}
                className="w-full"
              >
                {sending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Mail className="size-4" aria-hidden />}
                Send to waitlist
              </Button>
              <Button type="button" variant="outline" onClick={onSaveDraft} disabled={isSubmitting || sending} className="w-full">
                <Save className="size-4" aria-hidden />
                Save draft
              </Button>
            </CardFooter>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Template</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {PRODUCT_UPDATE_TEMPLATES.map((key) => {
              const info = TEMPLATE_INFO[key];
              const active = template === key;
              return (
                <button
                  key={key}
                  type="button"
                  disabled={sent}
                  onClick={() => setValue("template", key, { shouldValidate: true })}
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-lg border px-2.5 py-2.5 text-left transition-colors disabled:opacity-60",
                    active
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40 hover:bg-secondary/40",
                  )}
                >
                  <span className="text-xs font-medium">{info.label}</span>
                  <span className="text-[11px] leading-snug text-muted-foreground">{info.description}</span>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cover image (optional)</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {coverImageUrl ? (
              <div className="group relative overflow-hidden rounded-lg border border-border">
                <Image
                  src={coverImageUrl}
                  alt="Cover image preview"
                  width={640}
                  height={360}
                  className="aspect-video w-full object-cover"
                  unoptimized
                />
                {!sent && (
                  <button
                    type="button"
                    onClick={() => setValue("coverImageUrl", "")}
                    className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-opacity hover:bg-background"
                    aria-label="Remove cover image"
                  >
                    <X className="size-3.5" aria-hidden />
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={uploadingCover || sent}
                className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-50"
              >
                {uploadingCover ? (
                  <Loader2 className="size-5 animate-spin" aria-hidden />
                ) : (
                  <ImageIcon className="size-5" aria-hidden />
                )}
                <span className="text-xs">Upload cover image</span>
              </button>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void uploadCoverImage(file);
                e.target.value = "";
              }}
            />
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
