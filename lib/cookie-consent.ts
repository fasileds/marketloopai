export type CookieConsent = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  updatedAt: string;
};

export const COOKIE_CONSENT_KEY = "marketloopai-cookie-consent";

export function readCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CookieConsent;
  } catch {
    return null;
  }
}

export function writeCookieConsent(consent: Omit<CookieConsent, "essential" | "updatedAt">) {
  const value: CookieConsent = {
    essential: true,
    ...consent,
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(value));
  return value;
}
