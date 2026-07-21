export const EMAIL_BRAND = "#d40606";
export const EMAIL_INK = "#18181b";
export const EMAIL_MUTED = "#52525b";
export const EMAIL_FAINT = "#a1a1aa";
export const EMAIL_BORDER = "#ececee";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://marketloopai.com";

export function unsubscribeUrl(email: string) {
  return `${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}`;
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function escapeAttr(value: string) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

/**
 * Hidden preview text — the snippet inbox lists show next to the subject.
 * Padded with invisible characters so email clients don't fall back to
 * pulling in visible body text after it runs out.
 */
export function preheader(text: string) {
  const padding = "&#8202;&zwnj;&nbsp;".repeat(40);
  return `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;opacity:0;">${escapeHtml(text)}${padding}</div>`;
}

/** Shared card/header/footer chrome every transactional email renders inside. */
export function emailShell({
  siteName,
  preheaderText,
  bodyHtml,
  footerHtml,
}: {
  siteName: string;
  preheaderText?: string;
  bodyHtml: string;
  footerHtml?: string;
}) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#f0f0f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    ${preheaderText ? preheader(preheaderText) : ""}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f0f2;padding:40px 16px;">
      <tr>
        <td align="center">
          <table
            role="presentation"
            width="100%"
            style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid ${EMAIL_BORDER};box-shadow:0 24px 48px -24px rgba(24,24,27,0.18);"
          >
            <tr>
              <td style="padding:22px 32px;border-bottom:1px solid ${EMAIL_BORDER};">
                <span style="display:inline-block;width:8px;height:8px;border-radius:9999px;background:${EMAIL_BRAND};margin-right:9px;vertical-align:middle;"></span>
                <span style="font-size:15px;font-weight:700;letter-spacing:-0.01em;color:${EMAIL_INK};vertical-align:middle;">${escapeHtml(siteName)}</span>
              </td>
            </tr>
            ${bodyHtml}
            ${
              footerHtml
                ? `<tr><td style="padding:22px 32px;border-top:1px solid ${EMAIL_BORDER};background:#fafafa;">${footerHtml}</td></tr>`
                : ""
            }
          </table>
          <p style="margin:20px 0 0;font-size:11px;color:${EMAIL_FAINT};">
            ${escapeHtml(siteName)} · ${new Date().getFullYear()}
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function unsubscribeFooter({ siteName, unsubscribeUrl }: { siteName: string; unsubscribeUrl: string }) {
  return `<p style="margin:0;font-size:12px;line-height:1.6;color:${EMAIL_FAINT};">
    You're getting this because you joined the ${escapeHtml(siteName)} waitlist.
    <a href="${escapeAttr(unsubscribeUrl)}" style="color:${EMAIL_FAINT};text-decoration:underline;">Unsubscribe</a>
  </p>`;
}
