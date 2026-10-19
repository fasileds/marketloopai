import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const metadata = { title: "Legal pages" };

type LegalPageRow = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  updated_at: string;
};

async function getPages(): Promise<LegalPageRow[]> {
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("legal_pages")
      .select("id, title, slug, published, updated_at")
      .order("updated_at", { ascending: false });
    return (data as LegalPageRow[]) ?? [];
  } catch {
    return [];
  }
}

export default async function AdminLegalPage() {
  const pages = await getPages();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Legal pages</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {pages.length} page{pages.length === 1 ? "" : "s"} — Terms, Privacy Policy, and anything
            else you need beyond the built-in pages.
          </p>
        </div>
        <Button size="sm" nativeButton={false} render={<Link href="/admin/legal/new" />}>
          <Plus className="size-4" aria-hidden />
          New page
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-3 font-medium">Title</th>
              <th className="p-3 font-medium">URL</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Updated</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id} className="border-b border-border last:border-0">
                <td className="p-3">{page.title}</td>
                <td className="p-3 text-muted-foreground">/legal/{page.slug}</td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      page.published
                        ? "bg-primary/15 text-primary"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {page.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="p-3 text-muted-foreground">
                  {new Date(page.updated_at).toLocaleDateString()}
                </td>
                <td className="p-3 text-right">
                  <Link
                    href={`/admin/legal/${page.id}/edit`}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {pages.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  No pages yet — create your first one. Built-in pages (Terms, Privacy, Acceptable
                  Use, Cookies, DPA, AI Policy, and the rest of the legal center) don&apos;t need to
                  be recreated here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
