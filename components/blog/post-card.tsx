import Link from "next/link";

export type PostCardData = {
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  author_name: string;
  published_at: string | null;
  cover_image_url: string | null;
};

export function readMinutes(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Avatar({ name }: { name: string }) {
  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
      {initials(name)}
    </span>
  );
}

export function CoverImage({
  post,
  alt,
  className,
  imageClassName,
}: {
  post: Pick<PostCardData, "cover_image_url">;
  alt?: string;
  className?: string;
  imageClassName?: string;
}) {
  if (!post.cover_image_url) {
    return (
      <div className={className}>
        <div
          className="h-full w-full"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, var(--glow-primary), transparent 60%), radial-gradient(circle at 80% 80%, var(--glow-accent), transparent 55%)",
          }}
        />
      </div>
    );
  }
  return (
    <div className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={post.cover_image_url}
        alt={alt ?? ""}
        loading="lazy"
        className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${imageClassName ?? ""}`}
      />
    </div>
  );
}

/** The card used on the blog listing grid and for "related posts" on an article page. */
export function PostCard({ post }: { post: PostCardData }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="glass group flex flex-col overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1"
    >
      <CoverImage post={post} alt={post.title} className="relative aspect-video w-full overflow-hidden" />
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        {post.category && (
          <span className="w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-primary">
            {post.category}
          </span>
        )}
        <h3 className="line-clamp-2 text-base font-semibold tracking-tight">{post.title}</h3>
        {post.excerpt && <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>}
        <div className="mt-auto flex items-center gap-2 pt-3 text-xs text-muted-foreground">
          <Avatar name={post.author_name} />
          <span>
            {post.author_name} · {readMinutes(post.content)} min read
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Larger hero-style card for the most recent post at the top of the listing. */
export function FeaturedPostCard({ post }: { post: PostCardData }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="glass glow-border group relative flex flex-col overflow-hidden rounded-3xl transition-transform duration-300 hover:-translate-y-1 lg:h-[320px] lg:flex-row"
    >
      <CoverImage
        post={post}
        alt={post.title}
        className="relative aspect-video w-full overflow-hidden lg:aspect-auto lg:h-full lg:w-1/2"
      />
      <div className="flex flex-1 flex-col justify-center gap-3 p-6 sm:p-8 lg:p-8">
        {post.category && (
          <span className="w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-primary">
            {post.category}
          </span>
        )}
        <h2 className="line-clamp-2 text-balance text-xl font-semibold tracking-tight sm:text-2xl">{post.title}</h2>
        {post.excerpt && <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>}
        <div className="mt-1 flex items-center gap-2.5 text-xs text-muted-foreground">
          <Avatar name={post.author_name} />
          <span>
            {post.author_name}
            {post.published_at && ` · ${new Date(post.published_at).toLocaleDateString()}`}
            {` · ${readMinutes(post.content)} min read`}
          </span>
        </div>
      </div>
    </Link>
  );
}
