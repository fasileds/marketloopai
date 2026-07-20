import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { legalPageSchema } from "@/lib/validations/legal-page";

const POSTGRES_UNIQUE_VIOLATION = "23505";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const parsed = legalPageSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form for errors." }, { status: 400 });
  }

  const { title, slug, content, published } = parsed.data;

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("legal_pages")
    .insert({ title, slug, content, published })
    .select("id")
    .single();

  if (error) {
    if (error.code === POSTGRES_UNIQUE_VIOLATION) {
      return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create page." }, { status: 500 });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
