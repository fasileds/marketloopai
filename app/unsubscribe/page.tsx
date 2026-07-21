import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";

import { UnsubscribeCard } from "./unsubscribe-card";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <>
      <PageHero eyebrow="Email preferences" eyebrowKey="unsubscribe.pagehero.eyebrow" title="Unsubscribe" titleKey="unsubscribe.pagehero.title" />
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md">
          {email ? (
            <UnsubscribeCard email={email} />
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              Missing email address — use the unsubscribe link from an email you received.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
