"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2, Save, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { slugify } from "@/lib/slug";
import { blogPostSchema, type BlogPostInput } from "@/lib/validations/blog";

function readingStats(html: string) {
  const words = html
    .replace(/<[^>]*>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
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
  const coverInputRef = useRef<HTMLInputElement>(null);
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
      published: false,
      ...defaultValues,
    },
  });

  const title = watch("title");
  const content = watch("content");
  const published = watch("published");
  const coverImageUrl = watch("coverImageUrl");
  const { words, minutes } = readingStats(content ?? "");

  async function uploadCoverImage(file: File) {
    setUploadingCover(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/blog/upload-image", { method: "POST", body: formData });
    setUploadingCover(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Failed to upload image.");
      return;
    }
    const { url } = await res.json();
    setValue("coverImageUrl", url, { shouldValidate: true });
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
            <RichTextEditor
              value={content ?? ""}
              onChange={(html) => setValue("content", html, { shouldValidate: true })}
              placeholder="Write your post — select text to format, or use the toolbar to add images and links."
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
              {coverImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverImageUrl}
                  alt=""
                  className="-mx-4 -mt-4 mb-4 aspect-video w-[calc(100%+2rem)] rounded-t-lg object-cover sm:-mx-6 sm:w-[calc(100%+3rem)]"
                />
              )}
              <h2 className="text-balance text-xl font-semibold tracking-tight">
                {title || "Untitled post"}
              </h2>
              {content ? (
                <div
                  className="prose prose-sm dark:prose-invert mt-4 max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <p className="mt-4 text-sm italic text-muted-foreground">Nothing to preview yet.</p>
              )}
            </article>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="post-excerpt">Excerpt (optional)</Label>
          <textarea
            id="post-excerpt"
            rows={2}
            {...register("excerpt")}
            className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            placeholder="Shown on the blog listing and in search results."
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
            <CardTitle>Cover image</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {coverImageUrl ? (
              <div className="group relative overflow-hidden rounded-lg border border-border">
                <Image
                  src={coverImageUrl}
                  alt=""
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
