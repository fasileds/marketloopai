import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { productUpdateSchema } from "@/lib/validations/product-update";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const parsed = productUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form for errors." }, { status: 400 });
  }

  const { title, content, template, coverImageUrl } = parsed.data;

  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from("product_updates")
    .update({
      title,
      content,
      template,
      cover_image_url: coverImageUrl || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to update." }, { status: 500 });
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
  const { error } = await supabase.from("product_updates").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
