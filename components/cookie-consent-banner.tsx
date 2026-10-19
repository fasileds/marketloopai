"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/editing/editable-text";
import { readCookieConsent, writeCookieConsent } from "@/lib/cookie-consent";

type Preferences = { analytics: boolean; marketing: boolean; functional: boolean };

const DEFAULT_PREFERENCES: Preferences = { analytics: false, marketing: false, functional: true };

type CookieBannerCopy = {
  messagePrefix: string;
  messageSuffix: string;
  cookiePolicyLinkLabel: string;
  toggleEssential: string;
  toggleAnalytics: string;
  toggleMarketing: string;
  togglePreferences: string;
  lockedSuffix: string;
  acceptAllLabel: string;
  rejectLabel: string;
  savePreferencesLabel: string;
  customizeLabel: string;
};

const DEFAULT_COPY: CookieBannerCopy = {
  messagePrefix:
    "We use cookies to run MarketLoopAI (website and app), keep you signed in, understand usage, and improve the product. See our",
  messageSuffix: "for details.",
  cookiePolicyLinkLabel: "Cookie Policy",
  toggleEssential: "Essential",
  toggleAnalytics: "Analytics",
  toggleMarketing: "Marketing",
  togglePreferences: "Preferences",
  lockedSuffix: "(always on)",
  acceptAllLabel: "Accept All",
  rejectLabel: "Reject Non-Essential",
  savePreferencesLabel: "Save preferences",
  customizeLabel: "Customize",
};

export function CookieConsentBanner({
  copy = DEFAULT_COPY,
}: {
  copy?: CookieBannerCopy;
}) {
  const [visible, setVisible] = useState(() => !readCookieConsent());
  const [customizing, setCustomizing] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);

  function accept(prefs: Preferences) {
    writeCookieConsent(prefs);
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3 }}
          className="cookie-consent fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6"
          role="dialog"
          aria-label="Cookie preferences"
        >
          <div className="glass noise-overlay mx-auto max-w-3xl rounded-2xl p-5 sm:p-6">
            <p className="text-sm text-muted-foreground">
              <EditableText contentKey="cookiebanner.message.prefix" value={copy.messagePrefix} />{" "}
              <Link href="/cookies" className="text-foreground underline underline-offset-2">
                <EditableText
                  contentKey="cookiebanner.cookie_policy_link.label"
                  value={copy.cookiePolicyLinkLabel}
                />
              </Link>{" "}
              <EditableText contentKey="cookiebanner.message.suffix" value={copy.messageSuffix} />
            </p>

            {customizing && (
              <div className="mt-4 space-y-3 border-t border-border pt-4">
                {[
                  {
                    key: "essential" as const,
                    label: copy.toggleEssential,
                    contentKey: "cookiebanner.toggle.essential.label",
                    locked: true,
                  },
                  {
                    key: "analytics" as const,
                    label: copy.toggleAnalytics,
                    contentKey: "cookiebanner.toggle.analytics.label",
                    locked: false,
                  },
                  {
                    key: "marketing" as const,
                    label: copy.toggleMarketing,
                    contentKey: "cookiebanner.toggle.marketing.label",
                    locked: false,
                  },
                  {
                    key: "functional" as const,
                    label: copy.togglePreferences,
                    contentKey: "cookiebanner.toggle.preferences.label",
                    locked: false,
                  },
                ].map((item) => (
                  <label key={item.key} className="flex items-center justify-between text-sm">
                    <span className={item.locked ? "text-muted-foreground" : ""}>
                      <EditableText contentKey={item.contentKey} value={item.label} />
                      {item.locked && (
                        <>
                          {" "}
                          <EditableText
                            contentKey="cookiebanner.locked_suffix"
                            value={copy.lockedSuffix}
                          />
                        </>
                      )}
                    </span>
                    <input
                      type="checkbox"
                      className="size-4 accent-primary"
                      disabled={item.locked}
                      checked={item.locked ? true : preferences[item.key as keyof Preferences]}
                      onChange={(e) =>
                        setPreferences((prev) => ({ ...prev, [item.key]: e.target.checked }))
                      }
                    />
                  </label>
                ))}
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => accept({ analytics: true, marketing: true, functional: true })}>
                <EditableText contentKey="cookiebanner.accept_all.label" value={copy.acceptAllLabel} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => accept({ analytics: false, marketing: false, functional: false })}
              >
                <EditableText contentKey="cookiebanner.reject.label" value={copy.rejectLabel} />
              </Button>
              {customizing ? (
                <Button variant="ghost" size="sm" onClick={() => accept(preferences)}>
                  <EditableText
                    contentKey="cookiebanner.save_preferences.label"
                    value={copy.savePreferencesLabel}
                  />
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setCustomizing(true)}>
                  <EditableText contentKey="cookiebanner.customize.label" value={copy.customizeLabel} />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
