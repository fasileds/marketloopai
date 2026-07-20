import { NextResponse } from "next/server";

import { contactSchema } from "@/lib/validations/contact";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form for errors.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // TODO(resend): once RESEND_API_KEY is configured, forward this message to
  // the support inbox and send the sender a confirmation email.
  console.info("Contact form submission:", parsed.data);

  return NextResponse.json({ ok: true }, { status: 200 });
}
