import type { ProductUpdateTemplate } from "@/lib/validations/product-update";

import { emailShell, EMAIL_BORDER, EMAIL_BRAND, EMAIL_FAINT, EMAIL_INK, EMAIL_MUTED, escapeAttr, escapeHtml, unsubscribeFooter } from "./layout";

export type ProductUpdateEmailProps = {
  siteName: string;
  title: string;
  paragraphs: string[];
  coverImageUrl: string | null;
  unsubscribeUrl: string;
};

type Renderer = (props: ProductUpdateEmailProps) => { subject: string; html: string };

function shell(props: ProductUpdateEmailProps, bodyHtml: string) {
  return emailShell({
    siteName: props.siteName,
    preheaderText: props.paragraphs[0] ?? props.title,
    bodyHtml,
    footerHtml: unsubscribeFooter({ siteName: props.siteName, unsubscribeUrl: props.unsubscribeUrl }),
  });
}

const paras = (list: string[], style: string) => list.map((p) => `<p style="${style}">${escapeHtml(p)}</p>`).join("");

/** Bold hero-style announcement — the default, closest to the blog notification's visual weight. */
const announcement: Renderer = (props) => {
  const [lede, ...rest] = props.paragraphs;
  const bodyHtml = `
    ${
      props.coverImageUrl
        ? `<tr><td style="padding:0;"><img src="${escapeAttr(props.coverImageUrl)}" alt="" width="560" style="width:100%;height:auto;max-height:260px;object-fit:cover;display:block;" /></td></tr>`
        : ""
    }
    <tr>
      <td style="padding:36px 32px 32px;">
        <span style="display:inline-block;padding:5px 12px;border-radius:9999px;background:rgba(212,6,6,0.08);color:${EMAIL_BRAND};font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">
          Product Update
        </span>
        <h1 style="margin:16px 0 12px;font-size:26px;line-height:1.28;letter-spacing:-0.02em;font-weight:800;color:${EMAIL_INK};">
          ${escapeHtml(props.title)}
        </h1>
        ${lede ? `<p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:${EMAIL_INK};">${escapeHtml(lede)}</p>` : ""}
        ${paras(rest, `margin:0 0 14px;font-size:15px;line-height:1.7;color:${EMAIL_MUTED};`)}
      </td>
    </tr>`;
  return { subject: `Product update: ${props.title}`, html: shell(props, bodyHtml) };
};

/** "What's new" list — each paragraph becomes a checked-off changelog line. */
const changelog: Renderer = (props) => {
  const items = props.paragraphs
    .map(
      (p) => `
      <tr>
        <td style="padding:0 0 14px;vertical-align:top;width:22px;">
          <span style="display:inline-flex;width:18px;height:18px;border-radius:9999px;background:${EMAIL_BRAND};color:#fff;font-size:11px;font-weight:700;text-align:center;line-height:18px;">&#10003;</span>
        </td>
        <td style="padding:0 0 14px 10px;font-size:15px;line-height:1.6;color:${EMAIL_MUTED};">${escapeHtml(p)}</td>
      </tr>`,
    )
    .join("");
  const bodyHtml = `
    <tr>
      <td style="padding:36px 32px 32px;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${EMAIL_BRAND};">What's new</p>
        <h1 style="margin:0 0 24px;font-size:24px;line-height:1.3;letter-spacing:-0.02em;font-weight:800;color:${EMAIL_INK};">${escapeHtml(props.title)}</h1>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${items}</table>
      </td>
    </tr>`;
  return { subject: `What's new: ${props.title}`, html: shell(props, bodyHtml) };
};

/** Plain, quiet, transactional-style — mirrors the welcome email's restraint. */
const minimal: Renderer = (props) => {
  const bodyHtml = `
    <tr>
      <td style="padding:32px;">
        <h1 style="margin:0 0 16px;font-size:19px;line-height:1.4;font-weight:700;color:${EMAIL_INK};">${escapeHtml(props.title)}</h1>
        ${paras(props.paragraphs, `margin:0 0 14px;font-size:14px;line-height:1.7;color:${EMAIL_INK};`)}
        <p style="margin:20px 0 0;font-size:14px;color:${EMAIL_FAINT};">— ${escapeHtml(props.siteName)}</p>
      </td>
    </tr>`;
  return { subject: props.title, html: shell(props, bodyHtml) };
};

/** Celebratory milestone — centered, single accent icon, no hero image needed. */
const milestone: Renderer = (props) => {
  const bodyHtml = `
    <tr>
      <td style="padding:44px 32px;text-align:center;">
        <div style="display:inline-flex;width:56px;height:56px;border-radius:9999px;background:rgba(212,6,6,0.1);align-items:center;justify-content:center;font-size:26px;line-height:56px;">🎉</div>
        <h1 style="margin:20px 0 12px;font-size:24px;line-height:1.3;letter-spacing:-0.02em;font-weight:800;color:${EMAIL_INK};">${escapeHtml(props.title)}</h1>
        ${paras(props.paragraphs, `margin:0 auto 12px;max-width:420px;font-size:15px;line-height:1.7;color:${EMAIL_MUTED};`)}
        <p style="margin:20px 0 0;font-size:13px;color:${EMAIL_FAINT};">Thank you for being part of this with us.</p>
      </td>
    </tr>`;
  return { subject: `🎉 ${props.title}`, html: shell(props, bodyHtml) };
};

/** Image-forward "new feature" spotlight. */
const featureSpotlight: Renderer = (props) => {
  const bodyHtml = `
    ${
      props.coverImageUrl
        ? `<tr><td style="padding:0;"><img src="${escapeAttr(props.coverImageUrl)}" alt="" width="560" style="width:100%;height:auto;max-height:300px;object-fit:cover;display:block;" /></td></tr>`
        : `<tr><td style="padding:32px 32px 0;">
             <div style="width:44px;height:44px;border-radius:12px;background:rgba(212,6,6,0.1);text-align:center;line-height:44px;font-size:20px;">✨</div>
           </td></tr>`
    }
    <tr>
      <td style="padding:24px 32px 32px;">
        <span style="display:inline-block;padding:5px 12px;border-radius:9999px;background:${EMAIL_BRAND};color:#fff;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">New feature</span>
        <h1 style="margin:14px 0 12px;font-size:24px;line-height:1.3;letter-spacing:-0.02em;font-weight:800;color:${EMAIL_INK};">${escapeHtml(props.title)}</h1>
        ${paras(props.paragraphs, `margin:0 0 14px;font-size:15px;line-height:1.7;color:${EMAIL_MUTED};`)}
      </td>
    </tr>`;
  return { subject: `New: ${props.title}`, html: shell(props, bodyHtml) };
};

/** Digest-style — each paragraph in its own bordered section, like a mini newsletter. */
const newsletter: Renderer = (props) => {
  const sections = props.paragraphs
    .map(
      (p, i) => `
      <div style="padding:${i === 0 ? "0" : "16px"} 0 16px;${i < props.paragraphs.length - 1 ? `border-bottom:1px solid ${EMAIL_BORDER};` : ""}">
        <p style="margin:0;font-size:14px;line-height:1.7;color:${EMAIL_MUTED};">${escapeHtml(p)}</p>
      </div>`,
    )
    .join("");
  const bodyHtml = `
    <tr>
      <td style="padding:32px;">
        <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${EMAIL_FAINT};">The ${escapeHtml(props.siteName)} Digest</p>
        <h1 style="margin:0 0 20px;font-size:22px;line-height:1.3;letter-spacing:-0.02em;font-weight:800;color:${EMAIL_INK};">${escapeHtml(props.title)}</h1>
        ${sections}
      </td>
    </tr>`;
  return { subject: `The ${props.siteName} Digest: ${props.title}`, html: shell(props, bodyHtml) };
};

/** Timeline-style — paragraphs become numbered, connected steps. */
const roadmapUpdate: Renderer = (props) => {
  const rows = props.paragraphs
    .map(
      (p, i) => `
      <tr>
        <td style="padding:0 0 ${i === props.paragraphs.length - 1 ? "0" : "18px"};vertical-align:top;width:28px;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="width:22px;height:22px;border-radius:9999px;background:${EMAIL_BRAND};color:#fff;font-size:11px;font-weight:700;text-align:center;line-height:22px;">${i + 1}</td></tr></table>
        </td>
        <td style="padding:0 0 ${i === props.paragraphs.length - 1 ? "0" : "18px"} 12px;font-size:15px;line-height:1.6;color:${EMAIL_MUTED};">${escapeHtml(p)}</td>
      </tr>`,
    )
    .join("");
  const bodyHtml = `
    <tr>
      <td style="padding:36px 32px 32px;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${EMAIL_BRAND};">Roadmap update</p>
        <h1 style="margin:0 0 24px;font-size:24px;line-height:1.3;letter-spacing:-0.02em;font-weight:800;color:${EMAIL_INK};">${escapeHtml(props.title)}</h1>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
      </td>
    </tr>`;
  return { subject: `Roadmap update: ${props.title}`, html: shell(props, bodyHtml) };
};

/** Dramatic, oversized, minimal-chrome splash for a big single announcement. */
const bigReveal: Renderer = (props) => {
  const [lede, ...rest] = props.paragraphs;
  const bodyHtml = `
    <tr>
      <td style="padding:56px 32px;text-align:center;">
        <h1 style="margin:0 0 16px;font-size:32px;line-height:1.1;letter-spacing:-0.03em;font-weight:900;color:${EMAIL_INK};">${escapeHtml(props.title)}</h1>
        ${lede ? `<p style="margin:0 auto 12px;max-width:440px;font-size:17px;line-height:1.6;color:${EMAIL_MUTED};">${escapeHtml(lede)}</p>` : ""}
        ${paras(rest, `margin:0 auto 10px;max-width:420px;font-size:14px;line-height:1.7;color:${EMAIL_FAINT};`)}
      </td>
    </tr>`;
  return { subject: props.title, html: shell(props, bodyHtml) };
};

const RENDERERS: Record<ProductUpdateTemplate, Renderer> = {
  announcement,
  changelog,
  minimal,
  milestone,
  "feature-spotlight": featureSpotlight,
  newsletter,
  "roadmap-update": roadmapUpdate,
  "big-reveal": bigReveal,
};

export function productUpdateEmail(template: ProductUpdateTemplate, props: ProductUpdateEmailProps) {
  return (RENDERERS[template] ?? announcement)(props);
}
