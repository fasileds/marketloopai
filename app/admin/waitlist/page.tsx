import { Download } from "lucide-react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { createServiceRoleClient } from "@/lib/supabase/server";

import { DeleteWaitlistRowButton } from "./row-actions";

export const metadata = { title: "Waitlist" };

type WaitlistRow = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  referral_code: string;
  referred_by: string | null;
  created_at: string;
};

async function getRows(query: string): Promise<{ rows: WaitlistRow[]; total: number }> {
  try {
    const supabase = createServiceRoleClient();
    let request = supabase
      .from("waitlist")
      .select("id, name, email, company, referral_code, referred_by, created_at", {
        count: "exact",
      })
      .order("created_at", { ascending: false })
      .limit(200);

    if (query) {
      request = request.or(`email.ilike.%${query}%,name.ilike.%${query}%`);
    }

    const { data, count } = await request;
    return { rows: (data as WaitlistRow[]) ?? [], total: count ?? 0 };
  } catch {
    return { rows: [], total: 0 };
  }
}

export default async function AdminWaitlistPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const { rows, total } = await getRows(q);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Waitlist</h1>
          <p className="mt-1 text-sm text-muted-foreground">{total} total signups</p>
        </div>
        <Link
          href="/api/admin/waitlist/export"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Download className="size-4" aria-hidden />
          Export CSV
        </Link>
      </div>

      <form className="mt-6" method="get">
        <Input name="q" defaultValue={q} placeholder="Search by name or email…" className="max-w-sm" />
      </form>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Company</th>
              <th className="p-3 font-medium">Referral code</th>
              <th className="p-3 font-medium">Referred by</th>
              <th className="p-3 font-medium">Joined</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0">
                <td className="p-3">{row.name}</td>
                <td className="p-3 text-muted-foreground">{row.email}</td>
                <td className="p-3 text-muted-foreground">{row.company ?? "—"}</td>
                <td className="p-3">
                  <code className="text-xs">{row.referral_code}</code>
                </td>
                <td className="p-3 text-muted-foreground">{row.referred_by ?? "—"}</td>
                <td className="p-3 text-muted-foreground">
                  {new Date(row.created_at).toLocaleDateString()}
                </td>
                <td className="p-3 text-right">
                  <DeleteWaitlistRowButton id={row.id} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-muted-foreground">
                  No waitlist signups yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
