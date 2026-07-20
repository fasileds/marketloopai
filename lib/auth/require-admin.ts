import { isAdminEmail } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";

/** For use in Route Handlers — API routes aren't covered by app/admin/layout.tsx's guard. */
export async function requireAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!isAdminEmail(user?.email)) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}
