import { emailShell, escapeHtml } from "./layout";

/**
 * Deliberately plain/transactional styling (no colored CTA button, no
 * unsubscribe footer) — this is a one-to-one signup confirmation triggered
 * by the user's own action, not a bulk marketing send, and email clients'
 * spam/promotions classifiers weigh "looks like a newsletter" heavily.
 */
export function waitlistWelcomeEmail({
  siteName,
  name,
  referralCode,
}: {
  siteName: string;
  name: string;
  referralCode: string;
}) {
  const subject = `You're on the ${siteName} waitlist`;

  const bodyHtml = `
    <tr>
      <td style="padding:32px;">
        <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#18181b;">
          Hi ${escapeHtml(name)},
        </p>
        <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#18181b;">
          You're on the ${escapeHtml(siteName)} waitlist. We'll email you as soon as it's your turn
          to get access.
        </p>
        <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#18181b;">
          Want to move up faster? Share your referral code — every signup through it bumps you up
          the list.
        </p>
        <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#18181b;">
          Referral code: <code style="font-size:14px;font-weight:600;letter-spacing:0.05em;">${escapeHtml(referralCode)}</code>
        </p>
        <p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:#71717a;">
          — ${escapeHtml(siteName)}
        </p>
      </td>
    </tr>`;

  const html = emailShell({ siteName, bodyHtml });

  return { subject, html };
}
