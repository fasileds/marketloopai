import { BlogPostForm } from "@/components/admin/blog-post-form";

export const metadata = { title: "New post" };

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">New post</h1>
      <div className="mt-6">
        <BlogPostForm />
      </div>
    </div>
  );
}
