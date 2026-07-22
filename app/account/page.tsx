import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";

import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { getSiteContent, getText } from "@/lib/content/get-site-content";
import { createServiceRoleClient, createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

async function getWaitlistEntry(email: string) {
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("waitlist")
      .select("referral_code")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (!data) return null;

    const { count } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true })
      .eq("referred_by", data.referral_code);

    return { referralCode: data.referral_code as string, referralCount: count ?? 0 };
  } catch {
    return null;
  }
}

export default async function AccountPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    redirect("/login");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login");
  }

  const waitlistEntry = await getWaitlistEntry(user.email);
  const content = await getSiteContent();

  return (
    <>
      <PageHero
        eyebrow={getText(content, "account.pagehero.eyebrow", "Account")}
        eyebrowKey="account.pagehero.eyebrow"
        title={
          <>
            Welcome back, <span className="text-gradient">{user.email}</span>
          </>
        }
      />
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md">
          {waitlistEntry ? (
            <div className="glass noise-overlay flex flex-col items-center gap-3 rounded-2xl p-8 text-center">
              <p className="text-sm text-muted-foreground">Your referral code</p>
              <code className="rounded-lg border border-border bg-secondary px-4 py-2 text-base font-semibold tracking-widest">
                {waitlistEntry.referralCode}
              </code>
              <p className="text-sm text-muted-foreground">
                {waitlistEntry.referralCount} referral{waitlistEntry.referralCount === 1 ? "" : "s"} so
                far
              </p>
              <Button variant="outline" size="sm" nativeButton={false} render={<Link href="/referral" />}>
                View leaderboard
              </Button>
            </div>
          ) : (
            <div className="glass noise-overlay flex flex-col items-center gap-3 rounded-2xl p-8 text-center">
              <p className="text-sm text-muted-foreground">
                We couldn&apos;t find a waitlist entry for {user.email}.
              </p>
              <Button size="sm" nativeButton={false} render={<Link href="/#waitlist" />}>
                Join the waitlist
              </Button>
            </div>
          )}

          <form action="/auth/signout" method="post" className="mt-6 text-center">
            <button type="submit" className="text-sm text-muted-foreground hover:text-foreground">
              Sign out
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
