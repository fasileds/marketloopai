import { NextResponse } from "next/server";
import { z } from "zod";

import { createServiceRoleClient } from "@/lib/supabase/server";

const bodySchema = z.object({ email: z.string().trim().email() });

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from("waitlist")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("email", parsed.data.email.toLowerCase());

  if (error) {
    return NextResponse.json({ error: "Failed to unsubscribe." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
