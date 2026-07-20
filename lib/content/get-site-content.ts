import { cache } from "react";

import { createServiceRoleClient } from "@/lib/supabase/server";

import { CONTENT_DEFAULTS } from "./registry";

export type SiteContentMap = Record<string, string>;

/**
 * Fetches every site_content override and merges it over the registry
 * defaults, so callers always get a fully-resolved map and never need their
 * own fallback logic. Memoized per request with React's `cache()` since many
 * server components on the same page (navbar, footer, page body) all call
 * this independently.
 */
export const getSiteContent = cache(async (): Promise<SiteContentMap> => {
  const resolved: SiteContentMap = { ...CONTENT_DEFAULTS };

  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase.from("site_content").select("key, value");
    for (const row of data ?? []) {
      resolved[row.key] = row.value;
    }
  } catch {
    // No Supabase project configured yet — fall back to registry defaults.
  }

  return resolved;
});

/**
 * `fallback` covers ad-hoc keys that aren't pre-registered in the CMS
 * dashboard's field list (lib/content/registry.ts) — most inline-editable
 * text on the site falls in that category. Registered keys ignore it since
 * CONTENT_DEFAULTS already has them.
 */
export function getText(content: SiteContentMap, key: string, fallback = ""): string {
  return content[key] ?? CONTENT_DEFAULTS[key] ?? fallback;
}

export function getJson<T>(content: SiteContentMap, key: string, fallback?: T): T {
  const raw = content[key] ?? CONTENT_DEFAULTS[key];
  if (raw === undefined) {
    if (fallback !== undefined) return fallback;
    throw new Error(`getJson: no value, default, or fallback for key "${key}"`);
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    if (fallback !== undefined) return fallback;
    return JSON.parse(CONTENT_DEFAULTS[key]) as T;
  }
}
