import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { getSiteContent, getText } from "@/lib/content/get-site-content";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Admin sign-in for MarketLoopAI.",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const content = await getSiteContent();

  return (
    <>
      <PageHero
        eyebrow={getText(content, "login.pagehero.eyebrow", "Sign in")}
        eyebrowKey="login.pagehero.eyebrow"
        title={
          <>
            Admin <span className="text-gradient">sign in</span>
          </>
        }
        description={getText(
          content,
          "login.pagehero.description",
          "Sign in with Google or a magic link. Access is restricted to authorized admins.",
        )}
        descriptionKey="login.pagehero.description"
      />
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md">
          <LoginForm />
        </div>
      </section>
    </>
  );
}
