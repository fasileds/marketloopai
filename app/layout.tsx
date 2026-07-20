import type { Metadata } from "next";

import { AdminEditBar } from "@/components/editing/admin-edit-bar";
import { EditModeProvider } from "@/components/editing/edit-mode-context";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getSiteContent, getText } from "@/lib/content/get-site-content";
import { geistMono, geistSans } from "@/lib/fonts";
import { LenisProvider } from "@/lib/motion/lenis-provider";

import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://marketloopai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MarketLoopAI — AI Content, Video & Ad Campaigns From One Platform",
    template: "%s | MarketLoopAI",
  },
  description:
    "Generate AI content, create product videos, publish everywhere, and launch ad campaigns from one intelligent platform. Join the waitlist for early access.",
  openGraph: {
    title: "MarketLoopAI — Turn Your Website Into Content, Videos, and Ad Campaigns",
    description:
      "Generate AI content, create product videos, publish everywhere, and launch ad campaigns from one intelligent platform.",
    url: siteUrl,
    siteName: "MarketLoopAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MarketLoopAI — AI Marketing, One Platform",
    description:
      "Generate AI content, create product videos, publish everywhere, and launch ad campaigns from one intelligent platform.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const admin = await requireAdmin();
  const isAdmin = !!admin;
  const content = await getSiteContent();
  const brandName = getText(content, "brand.name");
  const navLabels: Record<string, string> = {
    home: getText(content, "nav.home.label", "Home"),
    features: getText(content, "nav.features.label", "Features"),
    solutions: getText(content, "nav.solutions.label", "Solutions"),
    pricing: getText(content, "nav.pricing.label", "Pricing"),
    blog: getText(content, "nav.blog.label", "Blog"),
    about: getText(content, "nav.about.label", "About"),
    "resources-integrations": getText(content, "nav.resources-integrations.label", "Integrations"),
    "resources-roadmap": getText(content, "nav.resources-roadmap.label", "Roadmap"),
    "resources-media": getText(content, "nav.resources-media.label", "Media Center"),
    "resources-referral": getText(content, "nav.resources-referral.label", "Referral Leaderboard"),
    "resources-trust": getText(content, "nav.resources-trust.label", "Trust Center"),
  };
  const navResourcesLabel = getText(content, "nav.resources.label", "Resources");
  const navCtaLabel = getText(content, "nav.cta.label", "Join Waitlist");
  const cookieBannerCopy = {
    messagePrefix: getText(
      content,
      "cookiebanner.message.prefix",
      "We use cookies to run our site, understand usage, and improve MarketLoopAI. See our",
    ),
    messageSuffix: getText(content, "cookiebanner.message.suffix", "for details."),
    cookiePolicyLinkLabel: getText(
      content,
      "cookiebanner.cookie_policy_link.label",
      "Cookie Policy",
    ),
    toggleEssential: getText(content, "cookiebanner.toggle.essential.label", "Essential"),
    toggleAnalytics: getText(content, "cookiebanner.toggle.analytics.label", "Analytics"),
    toggleMarketing: getText(content, "cookiebanner.toggle.marketing.label", "Marketing"),
    togglePreferences: getText(content, "cookiebanner.toggle.preferences.label", "Preferences"),
    lockedSuffix: getText(content, "cookiebanner.locked_suffix", "(always on)"),
    acceptAllLabel: getText(content, "cookiebanner.accept_all.label", "Accept All"),
    rejectLabel: getText(content, "cookiebanner.reject.label", "Reject Non-Essential"),
    savePreferencesLabel: getText(
      content,
      "cookiebanner.save_preferences.label",
      "Save preferences",
    ),
    customizeLabel: getText(content, "cookiebanner.customize.label", "Customize"),
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <EditModeProvider isAdmin={isAdmin}>
            <LenisProvider>
              <AdminEditBar />
              <Navbar
                brandName={brandName}
                navLabels={navLabels}
                ctaLabel={navCtaLabel}
                resourcesLabel={navResourcesLabel}
              />
              <main className="flex-1">{children}</main>
              <Footer />
            </LenisProvider>
            <Toaster />
            <CookieConsentBanner copy={cookieBannerCopy} />
          </EditModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
