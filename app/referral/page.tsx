import type { Metadata } from "next";
import { Trophy } from "lucide-react";

import { EditableText } from "@/components/editing/editable-text";
import { PageHero } from "@/components/layout/page-hero";
import { getSiteContent, getText } from "@/lib/content/get-site-content";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Referral Leaderboard",
  description: "See the top referrers moving up the MarketLoopAI waitlist.",
};

export const revalidate = 60;

type LeaderboardEntry = { referralCode: string; count: number };

async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("waitlist")
      .select("referred_by")
      .not("referred_by", "is", null);

    if (error || !data) return [];

    const counts = new Map<string, number>();
    for (const row of data) {
      const code = row.referred_by as string;
      counts.set(code, (counts.get(code) ?? 0) + 1);
    }

    return Array.from(counts.entries())
      .map(([referralCode, count]) => ({ referralCode, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  } catch {
    // No Supabase project configured yet — render an empty leaderboard instead of erroring.
    return [];
  }
}

export default async function ReferralPage() {
  const leaderboard = await getLeaderboard();
  const content = await getSiteContent();

  return (
    <>
      <PageHero
        eyebrow={getText(content, "referral.pagehero.eyebrow", "Referral Leaderboard")}
        eyebrowKey="referral.pagehero.eyebrow"
        title={getText(content, "referral.pagehero.title", "Share your code, climb the list")}
        titleKey="referral.pagehero.title"
        description={getText(
          content,
          "referral.pagehero.description",
          "Every waitlist signup gets a unique referral code. The more people who join through yours, the higher you rank — and the sooner you get early access.",
        )}
        descriptionKey="referral.pagehero.description"
      />

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {leaderboard.length === 0 ? (
            <div className="glass noise-overlay rounded-2xl p-10 text-center">
              <Trophy className="mx-auto size-6 text-primary" aria-hidden />
              <p className="mt-4 text-muted-foreground">
                <EditableText
                  multiline
                  contentKey="referral.empty.description"
                  value={getText(
                    content,
                    "referral.empty.description",
                    "No referrals yet — be the first to share your code and top the leaderboard.",
                  )}
                />
              </p>
            </div>
          ) : (
            <ol className="glass noise-overlay divide-y divide-border overflow-hidden rounded-2xl">
              {leaderboard.map((entry, index) => (
                <li key={entry.referralCode} className="flex items-center gap-4 px-6 py-4">
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                      index < 3 ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <code className="flex-1 font-medium tracking-widest">{entry.referralCode}</code>
                  <span className="text-sm text-muted-foreground">
                    {entry.count} referral{entry.count === 1 ? "" : "s"}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </>
  );
}
