import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { productUpdateSchema } from "@/lib/validations/product-update";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const parsed = productUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form for errors." }, { status: 400 });
  }

  const { title, content, template, coverImageUrl } = parsed.data;

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("product_updates")
    .insert({ title, content, template, cover_image_url: coverImageUrl || null })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to save the update." }, { status: 500 });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
