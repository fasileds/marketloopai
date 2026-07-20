import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { legalPageSchema } from "@/lib/validations/legal-page";

const POSTGRES_UNIQUE_VIOLATION = "23505";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const parsed = legalPageSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form for errors." }, { status: 400 });
  }

  const { title, slug, content, published } = parsed.data;

  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from("legal_pages")
    .update({ title, slug, content, published, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    if (error.code === POSTGRES_UNIQUE_VIOLATION) {
      return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update page." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("legal_pages").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete page." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
