"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { EditableText } from "@/components/editing/editable-text";
import { useEditMode } from "@/components/editing/edit-mode-context";

const PRIMARY_LINKS = [
  { key: "home", label: "Home", href: "/" },
  { key: "features", label: "Features", href: "/features" },
  { key: "solutions", label: "Solutions", href: "/solutions" },
  { key: "pricing", label: "Pricing", href: "/pricing" },
  { key: "blog", label: "Blog", href: "/blog" },
  { key: "media", label: "Media", href: "/media" },
  { key: "about", label: "About", href: "/about" },
];

const RESOURCE_LINKS = [
  { key: "resources-integrations", label: "Integrations", href: "/integrations" },
  { key: "resources-roadmap", label: "Roadmap", href: "/roadmap" },
  { key: "resources-referral", label: "Referral Leaderboard", href: "/referral" },
  { key: "resources-trust", label: "Trust Center", href: "/trust" },
];

const ALL_LINKS = [...PRIMARY_LINKS, ...RESOURCE_LINKS];

export function Navbar({
  brandName,
  navLabels,
  ctaLabel,
  resourcesLabel,
}: {
  brandName: string;
  navLabels: Record<string, string>;
  ctaLabel: string;
  resourcesLabel: string;
}) {
  const { isAdmin } = useEditMode();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || (pathname?.startsWith(href + "/") ?? false);
  }

  const resourcesActive = RESOURCE_LINKS.some((link) => isActive(link.href));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 z-50 border-b transition-colors duration-300 ${
        isAdmin ? "top-11" : "top-0"
      } ${
        scrolled
          ? "border-border bg-background/80 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex h-16 max-w-[100rem] items-center justify-between px-4 sm:px-6 lg:px-10"
        aria-label="Primary"
      >
        <Link href="/">
          <Logo name={brandName} />
        </Link>

        <NavigationMenu className="hidden max-w-none flex-none xl:flex">
          <NavigationMenuList className="gap-1 text-sm text-muted-foreground">
            {PRIMARY_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink
                    render={<Link href={link.href} aria-current={active ? "page" : undefined} />}
                    className={`relative hover:text-foreground ${active ? "text-foreground font-medium" : ""}`}
                  >
                    <EditableText
                      contentKey={`nav.${link.key}.label`}
                      value={navLabels[link.key] ?? link.label}
                    />
                    {active && (
                      <span className="absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-primary" aria-hidden />
                    )}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={`relative text-muted-foreground hover:text-foreground data-popup-open:text-foreground ${
                  resourcesActive ? "text-foreground font-medium" : ""
                }`}
              >
                <EditableText contentKey="nav.resources.label" value={resourcesLabel} />
                {resourcesActive && (
                  <span className="absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-primary" aria-hidden />
                )}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex w-56 flex-col p-1">
                  {RESOURCE_LINKS.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <li key={link.href}>
                        <NavigationMenuLink
                          render={<Link href={link.href} aria-current={active ? "page" : undefined} />}
                          className={active ? "text-foreground font-medium" : ""}
                        >
                          <EditableText
                            contentKey={`nav.${link.key}.label`}
                            value={navLabels[link.key] ?? link.label}
                          />
                        </NavigationMenuLink>
                      </li>
                    );
                  })}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden items-center gap-2 xl:flex">
          <Button size="sm" nativeButton={false} render={<Link href="/#waitlist" />}>
            <EditableText contentKey="nav.cta.label" value={ctaLabel} />
          </Button>
        </div>

        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-lg text-foreground xl:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-border bg-background/95 backdrop-blur-xl xl:hidden"
          >
            <ul className="flex max-h-[70svh] flex-col gap-1 overflow-y-auto px-4 py-4 text-sm sm:px-6">
              {ALL_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-lg px-2 py-2.5 transition-colors hover:bg-secondary hover:text-foreground ${
                        active ? "bg-secondary text-foreground font-medium" : "text-muted-foreground"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <EditableText
                        contentKey={`nav.${link.key}.label`}
                        value={navLabels[link.key] ?? link.label}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="px-4 pb-4 sm:px-6">
              <Button
                size="sm"
                className="w-full"
                nativeButton={false}
                render={<Link href="/#waitlist" onClick={() => setMobileOpen(false)} />}
              >
                <EditableText contentKey="nav.cta.label" value={ctaLabel} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
