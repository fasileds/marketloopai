import { notFound } from "next/navigation";

import { BlogPostForm } from "@/components/admin/blog-post-form";
import { createServiceRoleClient } from "@/lib/supabase/server";

import { DeletePostButton } from "./delete-post-button";

export const metadata = { title: "Edit post" };

async function getPost(id: string) {
  const supabase = createServiceRoleClient();
  const { data } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();
  return data;
}

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Edit post</h1>
        <DeletePostButton id={post.id} />
      </div>
      <div className="mt-6">
        <BlogPostForm
          postId={post.id}
          defaultValues={{
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt ?? "",
            content: post.content,
            category: post.category ?? "",
            authorName: post.author_name,
            coverImageUrl: post.cover_image_url ?? "",
            galleryImageUrls: post.gallery_image_urls ?? [],
            stats: post.stats ?? [],
            caseStudy: post.case_study ?? {},
            template: post.template ?? "editorial",
            published: post.published,
          }}
        />
      </div>
    </div>
  );
}
