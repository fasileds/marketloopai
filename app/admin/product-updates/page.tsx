import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const metadata = { title: "Product Updates" };

type ProductUpdateRow = {
  id: string;
  title: string;
  template: string;
  sent: boolean;
  sent_at: string | null;
  recipient_count: number | null;
  created_at: string;
};

async function getUpdates(): Promise<ProductUpdateRow[]> {
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("product_updates")
      .select("id, title, template, sent, sent_at, recipient_count, created_at")
      .order("created_at", { ascending: false });
    return (data as ProductUpdateRow[]) ?? [];
  } catch {
    return [];
  }
}

export default async function AdminProductUpdatesPage() {
  const updates = await getUpdates();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Product Updates</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Announcements emailed to the whole waitlist.
          </p>
        </div>
        <Button size="sm" nativeButton={false} render={<Link href="/admin/product-updates/new" />}>
          <Plus className="size-4" aria-hidden />
          New update
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-3 font-medium">Title</th>
              <th className="p-3 font-medium">Template</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {updates.map((update) => (
              <tr key={update.id} className="border-b border-border last:border-0">
                <td className="p-3">{update.title}</td>
                <td className="p-3 text-muted-foreground">{update.template}</td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      update.sent ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {update.sent ? `Sent · ${update.recipient_count ?? 0}` : "Draft"}
                  </span>
                </td>
                <td className="p-3 text-muted-foreground">
                  {new Date(update.sent_at ?? update.created_at).toLocaleDateString()}
                </td>
                <td className="p-3 text-right">
                  <Link
                    href={`/admin/product-updates/${update.id}/edit`}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {update.sent ? "View" : "Edit"}
                  </Link>
                </td>
              </tr>
            ))}
            {updates.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  No product updates yet — create your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
