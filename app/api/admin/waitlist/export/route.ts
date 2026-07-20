import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { createServiceRoleClient } from "@/lib/supabase/server";

function toCsvValue(value: unknown) {
  const str = value === null || value === undefined ? "" : String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("waitlist")
    .select(
      "name, email, company, website, business_type, company_size, monthly_ad_spend, country, referral_code, referred_by, created_at",
    )
    .order("created_at", { ascending: false });

  if (error || !data) {
    return NextResponse.json({ error: "Failed to export waitlist" }, { status: 500 });
  }

  const columns = [
    "name",
    "email",
    "company",
    "website",
    "business_type",
    "company_size",
    "monthly_ad_spend",
    "country",
    "referral_code",
    "referred_by",
    "created_at",
  ] as const;

  const rows = [
    columns.join(","),
    ...data.map((row) => columns.map((col) => toCsvValue(row[col])).join(",")),
  ];

  return new NextResponse(rows.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="waitlist-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
