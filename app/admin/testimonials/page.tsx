import { TestimonialForm } from "@/components/admin/testimonial-form";
import { TestimonialRowActions } from "@/components/admin/testimonial-row-actions";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const metadata = { title: "Testimonials" };

type Testimonial = {
  id: string;
  quote: string;
  author_name: string;
  author_role: string | null;
  published: boolean;
};

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("testimonials")
      .select("id, quote, author_name, author_role, published")
      .order("sort_order", { ascending: true });
    return (data as Testimonial[]) ?? [];
  } catch {
    return [];
  }
}

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Testimonials</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Shown on the homepage once published. Falls back to placeholder quotes if none are
        published.
      </p>

      <div className="mt-6 max-w-xl">
        <TestimonialForm />
      </div>

      <div className="mt-8 space-y-3">
        {testimonials.map((t) => (
          <div key={t.id} className="glass flex items-start justify-between gap-4 rounded-2xl p-5">
            <div>
              <p className="text-sm">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {t.author_name}
                {t.author_role && ` · ${t.author_role}`}
                {" · "}
                {t.published ? "Published" : "Draft"}
              </p>
            </div>
            <TestimonialRowActions id={t.id} published={t.published} />
          </div>
        ))}
        {testimonials.length === 0 && (
          <p className="text-sm text-muted-foreground">No testimonials yet.</p>
        )}
      </div>
    </div>
  );
}
