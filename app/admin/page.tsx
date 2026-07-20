import { FileText, MessagesSquare, Users } from "lucide-react";
import Link from "next/link";

import { createServiceRoleClient } from "@/lib/supabase/server";

async function getCounts() {
  try {
    const supabase = createServiceRoleClient();
    const [waitlist, posts, testimonials] = await Promise.all([
      supabase.from("waitlist").select("*", { count: "exact", head: true }),
      supabase.from("blog_posts").select("*", { count: "exact", head: true }),
      supabase.from("testimonials").select("*", { count: "exact", head: true }),
    ]);
    return {
      waitlist: waitlist.count ?? 0,
      posts: posts.count ?? 0,
      testimonials: testimonials.count ?? 0,
    };
  } catch {
    return { waitlist: 0, posts: 0, testimonials: 0 };
  }
}

export default async function AdminOverviewPage() {
  const counts = await getCounts();

  const cards = [
    { label: "Waitlist signups", value: counts.waitlist, href: "/admin/waitlist", icon: Users },
    { label: "Blog posts", value: counts.posts, href: "/admin/blog", icon: FileText },
    { label: "Testimonials", value: counts.testimonials, href: "/admin/testimonials", icon: MessagesSquare },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your waitlist, blog, and testimonials from one place.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="glass flex flex-col gap-3 rounded-2xl p-6 transition-colors hover:border-primary/40"
          >
            <card.icon className="size-5 text-primary" aria-hidden />
            <div>
              <p className="text-2xl font-semibold">{card.value}</p>
              <p className="text-sm text-muted-foreground">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
