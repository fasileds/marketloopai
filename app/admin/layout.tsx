import { BarChart3, FileText, MessagesSquare, PenSquare, Scale, ShieldAlert, Users, Video } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { isAdminEmail } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: { template: "%s | Admin", default: "Admin" },
  robots: { index: false, follow: false },
};

const NAV = [
  { label: "Overview", href: "/admin", icon: BarChart3 },
  { label: "Content", href: "/admin/content", icon: PenSquare },
  { label: "Waitlist", href: "/admin/waitlist", icon: Users },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "Legal pages", href: "/admin/legal", icon: Scale },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessagesSquare },
  { label: "TikTok Videos", href: "/admin/tiktok", icon: Video },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    redirect("/login");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/admin");
  }

  if (!isAdminEmail(user.email)) {
    return (
      <section className="flex min-h-[70svh] flex-col items-center justify-center gap-3 px-4 pt-32 text-center">
        <ShieldAlert className="size-8 text-destructive" aria-hidden />
        <h1 className="text-2xl font-semibold">Access denied</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          {user.email} isn&apos;t authorized for the admin dashboard. Ask an existing admin to add
          your email to <code className="text-xs">ADMIN_EMAILS</code>.
        </p>
      </section>
    );
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-[100rem] gap-8 px-4 pt-24 pb-16 sm:px-6 lg:px-10">
      <aside className="hidden w-56 shrink-0 md:block">
        <nav className="sticky top-24 flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <item.icon className="size-4" aria-hidden />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
