import { AtSign, Briefcase, Code2 } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { EditableText } from "@/components/editing/editable-text";
import { getSiteContent, getText } from "@/lib/content/get-site-content";
import { createServiceRoleClient } from "@/lib/supabase/server";

const FOOTER_COLUMNS: {
  key: string;
  title: string;
  links: { key: string; label: string; href: string }[];
}[] = [
  {
    key: "product",
    title: "Product",
    links: [
      { key: "product-features", label: "Features", href: "/features" },
      { key: "product-solutions", label: "Solutions", href: "/solutions" },
      { key: "product-pricing", label: "Pricing", href: "/pricing" },
      { key: "product-integrations", label: "Integrations", href: "/integrations" },
      { key: "product-roadmap", label: "Roadmap", href: "/roadmap" },
    ],
  },
  {
    key: "resources",
    title: "Resources",
    links: [
      { key: "resources-blog", label: "Blog", href: "/blog" },
      { key: "resources-media", label: "Media", href: "/media" },
      { key: "resources-referral", label: "Referral Program", href: "/referral" },
      { key: "resources-support", label: "Support", href: "/contact" },
    ],
  },
  {
    key: "company",
    title: "Company",
    links: [
      { key: "company-about", label: "About", href: "/about" },
      { key: "company-contact", label: "Contact", href: "/contact" },
      { key: "company-security", label: "Security", href: "/security" },
      { key: "company-trust", label: "Trust Center", href: "/trust" },
    ],
  },
  {
    key: "legal",
    title: "Legal",
    links: [
      { key: "legal-privacy", label: "Privacy Policy", href: "/privacy" },
      { key: "legal-terms", label: "Terms of Service", href: "/terms" },
      { key: "legal-cookies", label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

async function getExtraLegalPages(): Promise<{ title: string; slug: string }[]> {
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("legal_pages")
      .select("title, slug")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function Footer() {
  const content = await getSiteContent();
  const brandName = getText(content, "brand.name");
  const tagline = getText(content, "footer.tagline");
  const copyright = getText(content, "footer.copyright");
  const taglineSecondary = getText(
    content,
    "footer.tagline_secondary",
    "Made for marketers who ship.",
  );
  const extraLegalPages = await getExtraLegalPages();

  return (
    <footer className="border-t border-border/60 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[100rem]">
        <div className="grid gap-10 md:grid-cols-[1.3fr_repeat(4,1fr)]">
          <div className="flex flex-col gap-4">
            <Link href="/">
              <Logo name={brandName} />
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              <EditableText contentKey="footer.tagline" value={tagline} multiline />
            </p>
            <div className="flex items-center gap-3 text-muted-foreground">
              <a href="https://x.com" aria-label="X (Twitter)" className="hover:text-foreground">
                <AtSign className="size-4" />
              </a>
              <a
                href="https://linkedin.com"
                aria-label="LinkedIn"
                className="hover:text-foreground"
              >
                <Briefcase className="size-4" />
              </a>
              <a href="https://github.com" aria-label="GitHub" className="hover:text-foreground">
                <Code2 className="size-4" />
              </a>
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.key} className="flex flex-col gap-3">
              <h3 className="text-sm font-medium">
                <EditableText
                  contentKey={`footer.column.${column.key}.title`}
                  value={getText(content, `footer.column.${column.key}.title`, column.title)}
                />
              </h3>
              <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground">
                {column.links.map((link) => (
                  <li key={link.key}>
                    <Link href={link.href} className="transition-colors hover:text-foreground">
                      <EditableText
                        contentKey={`footer.link.${link.key}.label`}
                        value={getText(content, `footer.link.${link.key}.label`, link.label)}
                      />
                    </Link>
                  </li>
                ))}
                {column.key === "legal" &&
                  extraLegalPages.map((page) => (
                    <li key={page.slug}>
                      <Link
                        href={`/legal/${page.slug}`}
                        className="transition-colors hover:text-foreground"
                      >
                        {page.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <EditableText contentKey="footer.copyright" value={copyright} />
          </p>
          <p>
            <EditableText contentKey="footer.tagline_secondary" value={taglineSecondary} />
          </p>
        </div>
      </div>
    </footer>
  );
}
