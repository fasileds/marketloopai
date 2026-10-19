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

const SITE_NAME = "MarketLoopAI";
const SITE_DESCRIPTION =
  "One idea in, complete content and advertising creative out. MarketLoopAI generates multiple content variations, humanizes and ranks them, adapts the best one for LinkedIn, TikTok, Snapchat, X, Facebook, and Instagram, and helps you create and manage ad campaigns across TikTok Ads, Snapchat Ads, X Ads, Google Ads, and Facebook/Meta Ads.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} — AI Content Repurposing, Humanization & Multi-Platform Ad Management`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} — One Idea In, Content and Ad Creative Out`,
    description: SITE_DESCRIPTION,
    url: siteUrl,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — One Idea In, Content and Ad Creative Out`,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}#organization`,
      name: SITE_NAME,
      url: siteUrl,
      description: SITE_DESCRIPTION,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/apple-icon`,
        width: 180,
        height: 180,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}#website`,
      url: siteUrl,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${siteUrl}#organization` },
    },
  ],
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
    media: getText(content, "nav.media.label", "Media"),
    about: getText(content, "nav.about.label", "About"),
    "resources-integrations": getText(content, "nav.resources-integrations.label", "Integrations"),
    "resources-roadmap": getText(content, "nav.resources-roadmap.label", "Roadmap"),
    "resources-referral": getText(content, "nav.resources-referral.label", "Referral Leaderboard"),
    "resources-trust": getText(content, "nav.resources-trust.label", "Trust Center"),
  };
  const navResourcesLabel = getText(content, "nav.resources.label", "Resources");
  const navCtaLabel = getText(content, "nav.cta.label", "Join Waitlist");
  const cookieBannerCopy = {
    messagePrefix: getText(
      content,
      "cookiebanner.message.prefix",
      "We use cookies to run MarketLoopAI (website and app), keep you signed in, understand usage, and improve the product. See our",
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Skip to main content
        </a>
        {/* eslint-disable-next-line @next/next/no-script-in-head-component -- structured data, not a runtime script */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
              <main id="main-content" className="flex-1">{children}</main>
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
