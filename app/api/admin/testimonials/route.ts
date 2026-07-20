import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { testimonialSchema } from "@/lib/validations/testimonial";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const parsed = testimonialSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form for errors." }, { status: 400 });
  }

  const { quote, authorName, authorRole, published, sortOrder } = parsed.data;

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("testimonials").insert({
    quote,
    author_name: authorName,
    author_role: authorRole || null,
    published,
    sort_order: sortOrder,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to create testimonial." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
