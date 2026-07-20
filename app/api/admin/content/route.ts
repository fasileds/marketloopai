import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/require-admin";
import { CONTENT_FIELDS } from "@/lib/content/registry";
import { createServiceRoleClient } from "@/lib/supabase/server";

/**
 * Inline editing (EditableText across the site) writes keys that were never
 * pre-registered in the CMS dashboard's field list, so this route accepts
 * any well-formed key rather than restricting to CONTENT_FIELDS. The
 * key-shape check is what keeps writes bounded — auth is what keeps them
 * admin-only.
 */
const KEY_PATTERN = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/i;
const MAX_KEY_LENGTH = 200;
const MAX_VALUE_LENGTH = 20000;

const bodySchema = z.object({
  values: z.record(z.string().max(MAX_KEY_LENGTH), z.string().max(MAX_VALUE_LENGTH)),
});

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const jsonFields = new Set(CONTENT_FIELDS.filter((f) => f.type === "json").map((f) => f.key));

  const rows = Object.entries(parsed.data.values)
    .filter(([key]) => KEY_PATTERN.test(key))
    .map(([key, value]) => ({ key, value }));

  if (rows.length === 0) {
    return NextResponse.json({ error: "No valid keys in request." }, { status: 400 });
  }

  for (const row of rows) {
    if (jsonFields.has(row.key)) {
      try {
        JSON.parse(row.value);
      } catch {
        return NextResponse.json({ error: `"${row.key}" is not valid JSON.` }, { status: 400 });
      }
    }
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from("site_content")
    .upsert(rows.map((row) => ({ ...row, updated_at: new Date().toISOString() })));

  if (error) {
    return NextResponse.json({ error: "Failed to save content." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
