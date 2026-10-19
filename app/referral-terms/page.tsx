import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { buildLegalSections, type RawLegalSection } from "@/lib/legal/build-sections";
import { LEGAL_INDEX_SENTENCE, LEGAL_LAST_UPDATED } from "@/lib/legal/constants";
import { getSiteContent, getText } from "@/lib/content/get-site-content";

const DESCRIPTION =
  "Terms of the MarketLoopAI waitlist referral program: ranking, eligibility, and prohibited abuse.";

export const metadata: Metadata = {
  title: "Referral Program Terms",
  description: DESCRIPTION,
  alternates: { canonical: "/referral-terms" },
  openGraph: {
    title: "Referral Program Terms",
    description: DESCRIPTION,
    url: "/referral-terms",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Referral Program Terms",
    description: DESCRIPTION,
  },
};

const RAW_SECTIONS: RawLegalSection[] = [
  {
    id: "scope",
    heading: "1. Scope",
    content: [
      "These Referral Program Terms are part of the MarketLoopAI Terms of Service and Acceptable Use Policy. They apply to waitlist referral codes, the public leaderboard, and any early-access ranking we attach to referrals.",
    ],
  },
  {
    id: "how-it-works",
    heading: "2. How it works",
    content: [
      "Eligible waitlist signups may receive a unique referral code. When another person joins through that code, we may count a referral toward the referrer's rank as shown on the Referral Leaderboard.",
      "Joining the waitlist or referring others does not guarantee access, a launch date, pricing, credits, or any reward. Ranking and any benefits are discretionary and may change or end at any time.",
    ],
  },
  {
    id: "eligibility",
    heading: "3. Eligibility",
    content: [
      "You must be 18 or older (or the age of majority if higher) and otherwise eligible under the Terms. We may disqualify codes associated with fake, duplicate, or automated signups, or with employees or contractors acting in a way that distorts the board.",
    ],
  },
  {
    id: "prohibited",
    heading: "4. Prohibited conduct",
    content: [
      "You must not:",
      {
        list: [
          "Create fake emails, self-refer, or use disposable inboxes to inflate counts",
          "Pay, coerce, or mislead people to join solely to farm rank",
          "Scrape or spam the waitlist, leaderboard, or referral links",
          "Present referral benefits as cash, equity, or a guaranteed prize unless we say so in writing",
        ],
      },
      "We may zero counts, hide a code, or ban accounts that violate these rules.",
    ],
  },
  {
    id: "no-value",
    heading: "5. No cash value",
    content: [
      "Referral rank and codes have no cash value, are not transferable except as we allow, and are not a security, lottery, or gambling product. Taxes, if any, are your responsibility if a reward is later granted.",
    ],
  },
  {
    id: "privacy",
    heading: "6. Privacy",
    content: [
      "Referral codes and counts shown on the leaderboard are public. How we process waitlist data is described in the Privacy Policy.",
    ],
  },
  {
    id: "changes",
    heading: "7. Changes and termination",
    content: [
      "We may modify or end the program, including wiping or resetting ranks, with notice on this page or the leaderboard. Continued participation after a change is acceptance.",
    ],
  },
  {
    id: "contact",
    heading: "8. Contact",
    content: [
      "Questions: legal@marketloopai.com. " + LEGAL_INDEX_SENTENCE,
    ],
  },
];

export default async function ReferralTermsPage() {
  const content = await getSiteContent();

  return (
    <LegalPage
      eyebrow={getText(content, "referralterms.pagehero.eyebrow", "Legal")}
      eyebrowKey="referralterms.pagehero.eyebrow"
      title={getText(content, "referralterms.pagehero.title", "Referral Program Terms")}
      titleKey="referralterms.pagehero.title"
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={buildLegalSections(content, "referralterms", RAW_SECTIONS)}
    />
  );
}
