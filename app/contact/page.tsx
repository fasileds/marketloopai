import type { Metadata } from "next";
import { AtSign, Briefcase, Mail, MapPin } from "lucide-react";

import { ContactForm } from "@/components/contact/contact-form";
import { EditableText } from "@/components/editing/editable-text";
import { PageHero } from "@/components/layout/page-hero";
import { getSiteContent, getText } from "@/lib/content/get-site-content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the MarketLoopAI team about AI content, ranking, humanization, and ad management.",
};

export default async function ContactPage() {
  const content = await getSiteContent();

  return (
    <>
      <PageHero
        eyebrow={getText(content, "pagehero.contact.eyebrow")}
        eyebrowKey="pagehero.contact.eyebrow"
        title={getText(content, "pagehero.contact.title")}
        titleKey="pagehero.contact.title"
        description={getText(content, "pagehero.contact.description")}
        descriptionKey="pagehero.contact.description"
      />

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col gap-4">
            <div className="glass rounded-2xl p-6">
              <div className="mb-3 inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="size-5" aria-hidden />
              </div>
              <h3 className="text-sm font-medium">
                <EditableText
                  contentKey="contact.support.label"
                  value={getText(content, "contact.support.label", "Support")}
                />
              </h3>
              <a href="mailto:support@marketloopai.com" className="mt-1 block text-sm text-muted-foreground hover:text-foreground">
                support@marketloopai.com
              </a>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="mb-3 inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Briefcase className="size-5" aria-hidden />
              </div>
              <h3 className="text-sm font-medium">
                <EditableText
                  contentKey="contact.partnerships.label"
                  value={getText(content, "contact.partnerships.label", "Partnerships")}
                />
              </h3>
              <a href="mailto:partners@marketloopai.com" className="mt-1 block text-sm text-muted-foreground hover:text-foreground">
                partners@marketloopai.com
              </a>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="mb-3 inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <AtSign className="size-5" aria-hidden />
              </div>
              <h3 className="text-sm font-medium">
                <EditableText
                  contentKey="contact.social.label"
                  value={getText(content, "contact.social.label", "Social")}
                />
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                <EditableText
                  contentKey="contact.social.handle"
                  value={getText(content, "contact.social.handle", "@marketloopai on X & LinkedIn")}
                />
              </p>
            </div>
            <div className="glass noise-overlay relative flex min-h-40 flex-1 items-center justify-center overflow-hidden rounded-2xl">
              <div className="text-center text-muted-foreground">
                <MapPin className="mx-auto size-5" aria-hidden />
                <p className="mt-2 text-xs">
                  <EditableText
                    contentKey="contact.remote.label"
                    value={getText(content, "contact.remote.label", "Remote-first team")}
                  />
                </p>
              </div>
            </div>
          </div>

          <ContactForm
            copy={{
              nameLabel: getText(content, "contactform.label.name", "Full name"),
              emailLabel: getText(content, "contactform.label.email", "Email"),
              subjectLabel: getText(content, "contactform.label.subject", "Subject"),
              messageLabel: getText(content, "contactform.label.message", "Message"),
              submitLabel: getText(content, "contactform.submit.label", "Send Message"),
              successHeading: getText(content, "contactform.success.heading", "Message sent"),
              successMessage: getText(
                content,
                "contactform.success.message",
                "Thanks for reaching out — we'll get back to you soon.",
              ),
            }}
          />
        </div>
      </section>
    </>
  );
}
