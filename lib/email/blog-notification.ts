import {
  emailShell,
  EMAIL_BRAND,
  EMAIL_FAINT,
  EMAIL_INK,
  EMAIL_MUTED,
  escapeAttr,
  escapeHtml,
  unsubscribeFooter,
} from "./layout";

export { unsubscribeUrl } from "./layout";

export function blogNotificationEmail({
  siteName,
  postTitle,
  postExcerpt,
  postUrl,
  coverImageUrl,
  category,
  authorName,
  readMinutes,
  unsubscribeUrl,
}: {
  siteName: string;
  postTitle: string;
  postExcerpt: string | null;
  postUrl: string;
  coverImageUrl: string | null;
  category: string | null;
  authorName: string | null;
  readMinutes: number;
  unsubscribeUrl: string;
}) {
  const subject = `New post: ${postTitle}`;

  const byline = [authorName, `${readMinutes} min read`].filter(Boolean).join(" · ");

  const bodyHtml = `
    ${
      coverImageUrl
        ? `<tr><td style="padding:0;">
            <img
              src="${escapeAttr(coverImageUrl)}"
              alt=""
              width="560"
              style="width:100%;height:auto;max-height:280px;object-fit:cover;display:block;"
            />
          </td></tr>`
        : ""
    }
    <tr>
      <td style="padding:36px 32px 32px;">
        <span style="display:inline-block;padding:5px 12px;border-radius:9999px;background:rgba(212,6,6,0.08);color:${EMAIL_BRAND};font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">
          ${escapeHtml(category ? category : "New on the blog")}
        </span>
        <h1 style="margin:16px 0 10px;font-size:26px;line-height:1.28;letter-spacing:-0.02em;font-weight:800;color:${EMAIL_INK};">
          ${escapeHtml(postTitle)}
        </h1>
        ${
          byline
            ? `<p style="margin:0 0 18px;font-size:13px;color:${EMAIL_FAINT};">${escapeHtml(byline)}</p>`
            : ""
        }
        ${
          postExcerpt
            ? `<p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:${EMAIL_MUTED};">${escapeHtml(postExcerpt)}</p>`
            : ""
        }
        <a
          href="${escapeAttr(postUrl)}"
          style="display:inline-block;background:${EMAIL_BRAND};color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:13px 26px;border-radius:9999px;box-shadow:0 10px 24px -8px rgba(212,6,6,0.5);"
        >
          Read the full post &rarr;
        </a>
      </td>
    </tr>`;

  const html = emailShell({
    siteName,
    preheaderText: postExcerpt ?? postTitle,
    bodyHtml,
    footerHtml: unsubscribeFooter({ siteName, unsubscribeUrl }),
  });

  return { subject, html };
}
