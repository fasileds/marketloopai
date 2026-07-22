"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2, Save, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { PostTemplate } from "@/components/blog/post-template";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { slugify } from "@/lib/slug";
import { BLOG_TEMPLATES, blogPostSchema, type BlogTemplate, type BlogPostInput } from "@/lib/validations/blog";

const TEMPLATE_INFO: Record<BlogTemplate, { label: string; description: string; sample: string; font: string }> = {
  editorial: {
    label: "Editorial",
    description: "Classic blog read — serif type, narrow column, drop cap.",
    sample: "Aa",
    font: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
  },
  magazine: {
    label: "Magazine",
    description: "Bold full-bleed cover, pull quote, featured stats.",
    sample: "Aa",
    font: "inherit",
  },
  minimal: {
    label: "Minimal",
    description: "Quiet and understated — small type, lots of whitespace.",
    sample: "Aa",
    font: "inherit",
  },
  "cover-gallery": {
    label: "Cover + Gallery",
    description: "Visual story — big cover, gallery, then the article.",
    sample: "🖼",
    font: "inherit",
  },
  "split-screen": {
    label: "Split-Screen",
    description: "Text one side, sticky image the other.",
    sample: "◧",
    font: "inherit",
  },
  "visual-story": {
    label: "Visual Story",
    description: "Full-width image sections woven through the text.",
    sample: "▤",
    font: "inherit",
  },
  "data-insights": {
    label: "Data & Insights",
    description: "Stat cards and callouts for research and reports.",
    sample: "📊",
    font: "inherit",
  },
  "case-study": {
    label: "Case Study",
    description: "Challenge, strategy, results, testimonial.",
    sample: "✓",
    font: "inherit",
  },
  modular: {
    label: "Modular",
    description: "A flexible grid of mixed content blocks.",
    sample: "▦",
    font: "inherit",
  },
};

function readingStats(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return { words, minutes: Math.max(1, Math.round(words / 200)) };
}

export function BlogPostForm({
  postId,
  defaultValues,
}: {
  postId?: string;
  defaultValues?: Partial<BlogPostInput>;
}) {
  const router = useRouter();
  const [slugTouched, setSlugTouched] = useState(!!postId);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BlogPostInput>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "",
      authorName: "MarketLoopAI Team",
      coverImageUrl: "",
      galleryImageUrls: [],
      stats: [],
      caseStudy: {},
      template: "editorial",
      published: false,
      ...defaultValues,
    },
  });

  const title = watch("title");
  const content = watch("content");
  const excerpt = watch("excerpt");
  const category = watch("category");
  const authorName = watch("authorName");
  const published = watch("published");
  const coverImageUrl = watch("coverImageUrl");
  const galleryImageUrls = watch("galleryImageUrls") ?? [];
  const stats = watch("stats") ?? [];
  const caseStudy = watch("caseStudy") ?? {};
  const template = watch("template");
  const { words, minutes } = readingStats(content ?? "");
  const paragraphs = (content ?? "").split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  async function uploadImage(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/blog/upload-image", { method: "POST", body: formData });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Failed to upload image.");
      return null;
    }
    const { url } = await res.json();
    return url as string;
  }

  async function uploadCoverImage(file: File) {
    setUploadingCover(true);
    const url = await uploadImage(file);
    setUploadingCover(false);
    if (url) setValue("coverImageUrl", url, { shouldValidate: true });
  }

  async function uploadGalleryImages(files: File[]) {
    setUploadingGallery(true);
    const urls: string[] = [];
    for (const file of files) {
      const url = await uploadImage(file);
      if (url) urls.push(url);
    }
    setUploadingGallery(false);
    if (urls.length > 0) {
      setValue("galleryImageUrls", [...galleryImageUrls, ...urls], { shouldValidate: true });
    }
  }

  function removeGalleryImage(url: string) {
    setValue(
      "galleryImageUrls",
      galleryImageUrls.filter((existing) => existing !== url),
      { shouldValidate: true },
    );
  }

  function addStat() {
    setValue("stats", [...stats, { label: "", value: "", description: "" }], { shouldValidate: true });
  }

  function updateStat(index: number, patch: Partial<(typeof stats)[number]>) {
    setValue(
      "stats",
      stats.map((stat, i) => (i === index ? { ...stat, ...patch } : stat)),
      { shouldValidate: true },
    );
  }

  function removeStat(index: number) {
    setValue(
      "stats",
      stats.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  }

  function updateCaseStudy(patch: Partial<typeof caseStudy>) {
    setValue("caseStudy", { ...caseStudy, ...patch }, { shouldValidate: true });
  }

  async function onSubmit(values: BlogPostInput) {
    const res = await fetch(postId ? `/api/admin/blog/${postId}` : "/api/admin/blog", {
      method: postId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Failed to save post.");
      return;
    }

    toast.success(postId ? "Post updated." : "Post created.");
    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start" noValidate>
      <div className="flex min-w-0 flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Input
            id="post-title"
            placeholder="Post title"
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
          <span className="shrink-0">/blog/</span>
          <input
            id="post-slug"
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
              id="post-content"
              rows={18}
              {...register("content")}
              aria-invalid={!!errors.content}
              className="w-full rounded-lg border border-input bg-transparent px-3 py-3 text-sm leading-relaxed outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              placeholder="Just write — separate paragraphs with a blank line. The template you pick on the right handles all the styling."
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {words} word{words === 1 ? "" : "s"} · ~{minutes} min read
              </span>
              {errors.content && <span className="text-destructive">{errors.content.message}</span>}
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <div className="max-h-[720px] overflow-y-auto rounded-lg border border-border">
              <div className="origin-top scale-[0.92]">
                <PostTemplate
                  template={template}
                  title={title || "Untitled post"}
                  category={category || null}
                  authorName={authorName || "—"}
                  dateLabel="Today"
                  coverImageUrl={coverImageUrl || null}
                  excerpt={excerpt || null}
                  paragraphs={paragraphs.length > 0 ? paragraphs : ["Nothing to preview yet."]}
                  galleryImageUrls={galleryImageUrls}
                  stats={stats}
                  caseStudy={caseStudy}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="post-excerpt">Excerpt (optional)</Label>
          <textarea
            id="post-excerpt"
            rows={2}
            {...register("excerpt")}
            className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            placeholder="Shown on the blog listing, in search results, and as the pull quote in the Magazine template."
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:sticky lg:top-24">
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={published ? "default" : "secondary"}>
                    {published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {published ? "Live on the public blog." : "Hidden from visitors."}
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
              {postId ? "Save changes" : "Create post"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Template</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {BLOG_TEMPLATES.map((key) => {
              const info = TEMPLATE_INFO[key];
              const active = template === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setValue("template", key, { shouldValidate: true })}
                  className={cn(
                    "flex flex-col items-start gap-1.5 rounded-lg border px-2.5 py-2.5 text-left transition-colors",
                    active
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40 hover:bg-secondary/40",
                  )}
                >
                  <span
                    className="flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary text-sm font-semibold"
                    style={{ fontFamily: info.font }}
                  >
                    {info.sample}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-medium">{info.label}</span>
                    <span className="block text-[11px] leading-snug text-muted-foreground">{info.description}</span>
                  </span>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cover image</CardTitle>
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
                <button
                  type="button"
                  onClick={() => setValue("coverImageUrl", "")}
                  className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-opacity hover:bg-background"
                  aria-label="Remove cover image"
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={uploadingCover}
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
            <p className="text-xs text-muted-foreground">
              Shown on the blog listing and at the top of the post. PNG, JPEG, WebP, or GIF, up to
              5&nbsp;MB.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {galleryImageUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {galleryImageUrls.map((url) => (
                  <div key={url} className="group relative overflow-hidden rounded-lg border border-border">
                    <Image
                      src={url}
                      alt="Gallery image preview"
                      width={160}
                      height={160}
                      className="aspect-square w-full object-cover"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(url)}
                      className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm"
                      aria-label="Remove image"
                    >
                      <X className="size-3" aria-hidden />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              disabled={uploadingGallery}
              className="flex h-16 w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-50"
            >
              {uploadingGallery ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <ImageIcon className="size-4" aria-hidden />
              )}
              <span className="text-xs">Add gallery images</span>
            </button>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                if (files.length > 0) void uploadGalleryImages(files);
                e.target.value = "";
              }}
            />
            <p className="text-xs text-muted-foreground">
              Shown as a gallery at the end of the post.
            </p>
          </CardContent>
        </Card>

        {(template === "data-insights" || template === "magazine") && (
          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col gap-1.5 rounded-lg border border-border p-2.5">
                  <div className="flex items-center gap-2">
                    <Input
                      value={stat.value}
                      onChange={(e) => updateStat(i, { value: e.target.value })}
                      placeholder="Value (e.g. 40%)"
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeStat(i)}
                      className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
                      aria-label="Remove stat"
                    >
                      <X className="size-3.5" aria-hidden />
                    </button>
                  </div>
                  <Input
                    value={stat.label}
                    onChange={(e) => updateStat(i, { label: e.target.value })}
                    placeholder="Label (e.g. Faster publishing)"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addStat}
                className="rounded-lg border border-dashed border-border py-2 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                + Add stat
              </button>
            </CardContent>
          </Card>
        )}

        {template === "case-study" && (
          <Card>
            <CardHeader>
              <CardTitle>Case study</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label>Client / company</Label>
                <Input
                  value={caseStudy.client ?? ""}
                  onChange={(e) => updateCaseStudy({ client: e.target.value })}
                />
              </div>
              {(
                [
                  ["challenge", "Challenge"],
                  ["goals", "Goals"],
                  ["strategy", "Strategy"],
                  ["implementation", "Implementation"],
                  ["results", "Results"],
                  ["conclusion", "Conclusion"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <Label>{label}</Label>
                  <textarea
                    rows={2}
                    value={caseStudy[key] ?? ""}
                    onChange={(e) => updateCaseStudy({ [key]: e.target.value })}
                    className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                  />
                </div>
              ))}
              <div className="flex flex-col gap-1.5">
                <Label>Testimonial quote</Label>
                <textarea
                  rows={2}
                  value={caseStudy.testimonialQuote ?? ""}
                  onChange={(e) => updateCaseStudy({ testimonialQuote: e.target.value })}
                  className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Testimonial author</Label>
                <Input
                  value={caseStudy.testimonialAuthor ?? ""}
                  onChange={(e) => updateCaseStudy({ testimonialAuthor: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="post-category">Category (optional)</Label>
              <Input id="post-category" {...register("category")} placeholder="AI Content Strategy" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="post-author">Author</Label>
              <Input id="post-author" {...register("authorName")} aria-invalid={!!errors.authorName} />
              {errors.authorName && (
                <p className="text-xs text-destructive">{errors.authorName.message}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
