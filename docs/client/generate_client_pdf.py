"""Generate a client-facing MarketLoopAI Video Studio overview PDF."""

from __future__ import annotations

from pathlib import Path

from reportlab.lib.colors import HexColor, white
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

RED = HexColor("#d40606")
RED_BRIGHT = HexColor("#fa0707")
BLACK = HexColor("#0a0a0a")
INK = HexColor("#1a1a1c")
MUTED = HexColor("#5c5c60")
SILVER = HexColor("#6e6e73")
LINE = HexColor("#dcdce0")
PAPER = HexColor("#f5f5f7")
CARD = HexColor("#ffffff")
ROW = HexColor("#f0f0f2")

PAGE_W, PAGE_H = A4
MARGIN = 18 * mm
OUT = Path(__file__).resolve().parent / "MarketLoopAI-Video-Generation-Client-Overview.pdf"


def draw_logo(c, x, y, size=22):
    s = size / 72.0
    c.saveState()
    c.translate(x, y)
    c.scale(s, s)
    c.setStrokeColor(RED_BRIGHT)
    c.setFillColor(RED_BRIGHT)
    c.setLineWidth(7)
    c.setLineCap(1)
    p = c.beginPath()
    p.moveTo(40.17, 72 - 59.64)
    p.arcTo(12, 12, 60, 60, -38, 270)
    c.drawPath(p, stroke=1, fill=0)
    c.setFillColor(HexColor("#c7c9cc"))
    c.setStrokeColor(HexColor("#c7c9cc"))
    c.setLineWidth(5.5)
    p2 = c.beginPath()
    p2.moveTo(33.74, 72 - 23.2)
    p2.arcTo(23, 23, 49, 49, 140, -250)
    c.drawPath(p2, stroke=1, fill=0)
    c.setFillColor(white)
    c.circle(36, 36, 3.4, stroke=0, fill=1)
    c.restoreState()


def header_footer(c, doc):
    c.saveState()
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.setStrokeColor(RED)
    c.setLineWidth(3)
    c.line(0, PAGE_H, 8, PAGE_H)
    c.setFillColor(BLACK)
    c.rect(0, PAGE_H - 14 * mm, PAGE_W, 14 * mm, stroke=0, fill=1)
    c.setFillColor(white)
    c.setFont("Times-Bold", 9)
    c.drawString(MARGIN, PAGE_H - 9 * mm, "MarketLoopAI")
    c.setFont("Times-Roman", 8)
    c.setFillColor(HexColor("#c7c9cc"))
    c.drawRightString(PAGE_W - MARGIN, PAGE_H - 9 * mm, "Video Generation  ·  Client Overview")
    c.setFillColor(BLACK)
    c.rect(0, 0, PAGE_W, 12 * mm, stroke=0, fill=1)
    c.setFillColor(HexColor("#c7c9cc"))
    c.setFont("Times-Roman", 7.5)
    c.drawString(MARGIN, 5 * mm, "Confidential  ·  For the intended recipient only  ·  August 2026")
    c.setFillColor(white)
    c.drawRightString(PAGE_W - MARGIN, 5 * mm, f"{doc.page}")
    c.restoreState()


def cover_page(c, doc):
    c.saveState()
    c.setFillColor(BLACK)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.setFillColor(RED)
    c.rect(0, 0, 6 * mm, PAGE_H, stroke=0, fill=1)
    draw_logo(c, 22 * mm, PAGE_H - 42 * mm, 28)
    c.setFillColor(white)
    c.setFont("Times-Bold", 11)
    c.drawString(38 * mm, PAGE_H - 32 * mm, "MarketLoopAI")
    c.setStrokeColor(HexColor("#3a3a3d"))
    c.setLineWidth(0.4)
    c.line(22 * mm, PAGE_H - 48 * mm, PAGE_W - 22 * mm, PAGE_H - 48 * mm)
    c.setFillColor(HexColor("#c7c9cc"))
    c.setFont("Times-Roman", 10)
    c.drawString(22 * mm, PAGE_H - 58 * mm, "CLIENT OVERVIEW")
    c.setFillColor(white)
    c.setFont("Times-Bold", 28)
    y = PAGE_H - 90 * mm
    for line in ("AI Video Generation", "for Marketing Teams"):
        c.drawString(22 * mm, y, line)
        y -= 12 * mm
    c.setFillColor(HexColor("#c7c9cc"))
    c.setFont("Times-Roman", 12)
    c.drawString(22 * mm, PAGE_H - 122 * mm, "A production SaaS product — not a demo or research prototype.")
    c.setFillColor(RED)
    c.rect(22 * mm, PAGE_H - 148 * mm, 18 * mm, 1.2, stroke=0, fill=1)
    bullets = [
        "Self-hosted Wan 2.2 video engine, designed so further models can be added later",
        "Text-to-video and image-to-video for short-form marketing creative",
        "Organizations, credits, billing, history, and a client-ready generation workflow",
        "Built to be reliable, secure, and commercially sustainable",
    ]
    c.setFillColor(HexColor("#e8e8ea"))
    c.setFont("Times-Roman", 10.5)
    by = PAGE_H - 162 * mm
    for b in bullets:
        c.setFillColor(RED)
        c.circle(24 * mm, by + 1.5, 1.3, stroke=0, fill=1)
        c.setFillColor(HexColor("#e8e8ea"))
        c.drawString(28 * mm, by, b)
        by -= 9 * mm
    c.setFillColor(HexColor("#9a9aa0"))
    c.setFont("Times-Roman", 9)
    c.drawString(22 * mm, 28 * mm, "Version 1.0  ·  27 August 2026")
    c.drawString(22 * mm, 22 * mm, "Prepared for client discussion. Not a binding statement of work.")
    c.restoreState()


def styles():
    base = getSampleStyleSheet()
    s = {
        "h1": ParagraphStyle(
            "H1",
            parent=base["Heading1"],
            fontName="Times-Bold",
            fontSize=16,
            textColor=BLACK,
            spaceBefore=2 * mm,
            spaceAfter=4 * mm,
            leading=20,
        ),
        "h2": ParagraphStyle(
            "H2",
            parent=base["Heading2"],
            fontName="Times-Bold",
            fontSize=12,
            textColor=BLACK,
            spaceBefore=5 * mm,
            spaceAfter=2.5 * mm,
            leading=16,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["Normal"],
            fontName="Times-Roman",
            fontSize=10,
            textColor=INK,
            alignment=TA_JUSTIFY,
            leading=14,
            spaceAfter=2.8 * mm,
        ),
        "intro": ParagraphStyle(
            "Intro",
            parent=base["Normal"],
            fontName="Times-Italic",
            fontSize=10.5,
            textColor=MUTED,
            leading=15,
            spaceAfter=4 * mm,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=base["Normal"],
            fontName="Times-Roman",
            fontSize=10,
            textColor=INK,
            leading=13.5,
            leftIndent=2 * mm,
        ),
        "cell": ParagraphStyle(
            "Cell",
            parent=base["Normal"],
            fontName="Times-Roman",
            fontSize=8.5,
            textColor=INK,
            leading=11.5,
        ),
        "cellb": ParagraphStyle(
            "CellB",
            parent=base["Normal"],
            fontName="Times-Bold",
            fontSize=8.5,
            textColor=BLACK,
            leading=11.5,
        ),
        "th": ParagraphStyle(
            "TH",
            parent=base["Normal"],
            fontName="Times-Bold",
            fontSize=8,
            textColor=white,
            leading=11,
        ),
        "cap": ParagraphStyle(
            "Cap",
            parent=base["Normal"],
            fontName="Times-Italic",
            fontSize=8,
            textColor=MUTED,
            spaceBefore=1 * mm,
            spaceAfter=4 * mm,
        ),
        "call": ParagraphStyle(
            "Call",
            parent=base["Normal"],
            fontName="Times-Roman",
            fontSize=9.5,
            textColor=INK,
            leading=13,
        ),
        "footer_note": ParagraphStyle(
            "FN",
            parent=base["Normal"],
            fontName="Times-Italic",
            fontSize=8.5,
            textColor=MUTED,
            alignment=TA_CENTER,
            spaceBefore=6 * mm,
        ),
    }
    return s


def p(text, style):
    return Paragraph(text, style)


def bullets(items, st):
    return ListFlowable(
        [ListItem(Paragraph(i, st["bullet"]), leftIndent=8, bulletColor=RED) for i in items],
        bulletType="bullet",
        start="•",
        leftIndent=12,
        bulletFontName="Times-Bold",
        bulletFontSize=10,
        spaceAfter=3 * mm,
    )


def table(headers, rows, col_widths):
    head = [Paragraph(h, styles()["th"]) for h in headers]
    body = []
    for row in rows:
        body.append([Paragraph(str(c), styles()["cellb" if i == 0 else "cell"]) for i, c in enumerate(row)])
    data = [head] + body
    t = Table(data, colWidths=col_widths, repeatRows=1)
    cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), BLACK),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("GRID", (0, 0), (-1, -1), 0.3, LINE),
        ("BACKGROUND", (0, 1), (-1, 1), CARD),
    ]
    for i in range(1, len(data)):
        if i % 2 == 0:
            cmds.append(("BACKGROUND", (0, i), (-1, i), ROW))
    t.setStyle(TableStyle(cmds))
    return t


def callout(title, body, st):
    inner = [
        [Paragraph(f"<b>{title}</b><br/>{body}", st["call"])],
    ]
    t = Table(inner, colWidths=[PAGE_W - 2 * MARGIN])
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), HexColor("#f8ecec")),
                ("BOX", (0, 0), (-1, -1), 0, CARD),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("LINEBEFORE", (0, 0), (0, -1), 3, RED),
            ]
        )
    )
    return t


def build_story():
    st = styles()
    w = PAGE_W - 2 * MARGIN
    story = []

    # Cover is drawn on page 1; content starts on page 2.
    story.append(PageBreak())

    story += [
        p("1. Purpose of this document", st["h1"]),
        p(
            "This overview is written for a business reader. It describes the MarketLoopAI "
            "video generation product we are building, what the first commercial release "
            "includes, how customers will use it, how it will be delivered, and what is "
            "intentionally left for later. It is suitable to share with a client or partner. "
            "It is not a technical specification and is not a signed statement of work.",
            st["body"],
        ),
        p(
            "A separate internal engineering blueprint exists for the build team. That document "
            "is not required for commercial discussion.",
            st["body"],
        ),
        p("2. Executive summary", st["h1"]),
        p(
            "MarketLoopAI will offer a client-facing SaaS product that turns a written idea "
            "or a still image into a short, downloadable marketing video. Customers will not "
            "operate graphics hardware themselves. They will sign in, choose a project, write "
            "a prompt (or upload a product image), submit a generation, watch clear progress "
            "while the video is created, then preview and download the result.",
            st["body"],
        ),
        p(
            "The first video engine is a self-hosted deployment of Wan 2.2, a leading "
            "open-source video model released under the Apache 2.0 licence. That licence "
            "allows commercial use. Generated videos are not claimed by the model authors; "
            "the customer remains responsible for lawful, appropriate use. The product is "
            "designed so additional open-source or commercial models can be added later "
            "without rebuilding the application.",
            st["body"],
        ),
        p(
            "This is being designed as a real paid product: accounts and team workspaces, "
            "plans and credits, usage limits, private storage, safety controls, and an "
            "experience that stays understandable during the several minutes video generation "
            "typically takes.",
            st["body"],
        ),
    ]

    story.append(
        callout(
            "An important product fact",
            "Wan 2.2 creates short clips of about five seconds. The first release will be "
            "honest about that. Longer pieces (for example a 30–180 second ad) are a later "
            "capability, assembled from multiple shots and a storyboard — not a stretched "
            "or looped five-second clip. If current marketing language refers to longer ads, "
            "that language should be aligned with this first-release scope before customer launch.",
            st,
        )
    )
    story.append(Spacer(1, 4 * mm))

    story += [
        p("3. What the product is for", st["h1"]),
        p(
            "The product sits inside MarketLoopAI’s existing direction: help marketers turn "
            "one idea into usable creative. Video is the most expensive and slowest part of "
            "that workflow today. The aim is not to replace a full film studio. The aim is "
            "to give a founder, marketer, or agency a reliable way to produce short clips "
            "for social, ads, and concepting — with cost and quality under control.",
            st["body"],
        ),
        p("Primary users", st["h2"]),
        bullets(
            [
                "<b>Solo founders and creators</b> — need a few clips a month without hiring production.",
                "<b>In-house marketing teams</b> — share a workspace, keep campaign folders, and iterate on prompts.",
                "<b>Agencies</b> — separate client workspaces so one brand never sees another brand’s assets.",
            ],
            st,
        ),
        p("4. First commercial release — what the client receives", st["h1"]),
        p(
            "The first release is a complete product loop, not a laboratory demo. A paying "
            "customer should be able to do the following without our engineers in the room.",
            st["body"],
        ),
        table(
            ["Area", "Included in the first release"],
            [
                [
                    "Access",
                    "Secure sign-in, personal or team workspace, roles (owner, admin, member, viewer).",
                ],
                [
                    "Workspace",
                    "Projects (for example by campaign or client), generation history, search and filters.",
                ],
                [
                    "Create",
                    "Text-to-video from a prompt. Image-to-video from a product still plus optional prompt.",
                ],
                [
                    "Settings",
                    "Aspect ratio for common placements (landscape and portrait). Optional seed for iteration. "
                    "Clear credit cost shown before submit.",
                ],
                [
                    "Waiting",
                    "A dedicated job page with live status, elapsed time, and progress. Email when the job finishes "
                    "so the customer can leave the tab.",
                ],
                [
                    "Result",
                    "In-browser preview, download of the video file, poster frame, and the ability to retry or duplicate settings.",
                ],
                [
                    "Billing",
                    "Subscription plans, credit balance, automatic refund if a generation fails, upgrade via Stripe.",
                ],
                [
                    "Safety",
                    "Prompt screening, private files, time-limited download links, and the ability to cancel a queued job.",
                ],
            ],
            [32 * mm, w - 32 * mm],
        ),
        p("Table 1. First-release product scope.", st["cap"]),
        p("5. How a customer uses it", st["h1"]),
        p(
            "The experience is built around the fact that AI video is not instant. A typical "
            "clip on the first engine is expected to take several minutes. The interface will "
            "never look frozen, and the customer will always know whether the job is queued, "
            "running, succeeded, or failed.",
            st["body"],
        ),
        table(
            ["Step", "What the customer does", "What they see"],
            [
                ["1", "Creates an account and a project.", "Workspace, remaining credits, a clear “New video” action."],
                ["2", "Writes a prompt, or uploads a still and adds direction.", "Cost in credits, clip length, and aspect ratio before they commit."],
                ["3", "Submits the job.", "Immediate confirmation. They are taken to a job page — not a spinning overlay."],
                ["4", "Waits, or leaves and comes back.", "Queue / generating / encoding, with progress and the option to cancel if still queued."],
                ["5", "Reviews the clip.", "Player, download, copy prompt, generate again with the same settings."],
            ],
            [18 * mm, 70 * mm, w - 88 * mm],
        ),
        p("Table 2. Customer journey for a single generation.", st["cap"]),
        p("6. Plans and usage (published direction)", st["h1"]),
        p(
            "The public MarketLoopAI pricing page already describes monthly plans. Video "
            "volume on that page is the commercial starting point. Internally, usage will be "
            "metered in <b>credits</b> so a higher-quality or more expensive model can cost "
            "more than a faster one, without rewriting the plans.",
            st["body"],
        ),
        table(
            ["Plan", "Monthly", "AI videos / month (published)", "Positioning"],
            [
                ["Free", "$0", "1", "Try the product."],
                ["Starter", "$29", "5", "Solo creators and small teams."],
                ["Pro", "$79", "20", "Growing marketing teams. Featured plan."],
                ["Agency", "$199", "80", "Agencies managing multiple brands."],
            ],
            [32 * mm, 28 * mm, 58 * mm, w - 118 * mm],
        ),
        p(
            "Table 3. Published plan direction as of August 2026. Final credit costs will be "
            "set from measured generation cost so the business does not sell GPU time at a loss. "
            "Annual billing (as already shown on the site) remains available.",
            st["cap"],
        ),
        p(
            "Failed generations return credits. Customers cannot run unlimited parallel jobs; "
            "each plan has a concurrency cap so one account cannot exhaust the shared hardware.",
            st["body"],
        ),
        p("7. Delivery timeline", st["h1"]),
        p(
            "Work is sequenced so the product can be demonstrated early, without waiting for "
            "the first GPU to be installed. The website, accounts, billing, and generation "
            "experience are built first against a stand-in engine. The real Wan 2.2 model is "
            "connected once that loop is solid.",
            st["body"],
        ),
        table(
            ["Stage", "What is delivered", "Client-visible outcome"],
            [
                [
                    "Foundation",
                    "Workspaces, roles, credits, test billing.",
                    "We can show a signed-in product, not only a marketing site.",
                ],
                [
                    "Generation loop",
                    "Submit, progress, history, download — with a placeholder renderer.",
                    "The full customer journey can be walked in a meeting.",
                ],
                [
                    "Live engine",
                    "Self-hosted Wan 2.2 connected on dedicated GPU hardware.",
                    "Real five-second clips from text and from product images.",
                ],
                [
                    "Hardening",
                    "Safety, email notifications, admin operations, monitoring, backups.",
                    "Suitable for a closed paid beta.",
                ],
                [
                    "Commercial beta",
                    "Live billing, measured pricing, production operations.",
                    "Invited customers can pay and generate.",
                ],
            ],
            [32 * mm, 70 * mm, w - 102 * mm],
        ),
        p(
            "Table 4. Delivery stages. Dates should be agreed in a statement of work. "
            "The live-engine stage depends on GPU provisioning and a short measurement period "
            "before public performance claims are made.",
            st["cap"],
        ),
        p("8. What is not in the first release", st["h1"]),
        p(
            "Being explicit here avoids disappointment. These items are planned as later "
            "improvements; they are not missing by accident.",
            st["body"],
        ),
        bullets(
            [
                "Native videos longer than one short clip (about five seconds).",
                "Speech-to-video (talking-head from audio) and character animation / replacement.",
                "The larger Wan 2.2 quality tier (requires much more expensive hardware).",
                "A public developer API with customer-issued keys.",
                "In-browser video editing, brand-kit enforcement, or automatic posting to TikTok and ads platforms.",
                "Customer-uploaded custom model weights or fine-tuning.",
            ],
            st,
        ),
        p("9. How it is built — in business terms", st["h1"]),
        p(
            "The customer website and account system run separately from the machines that "
            "create video. If a graphics processor is busy or offline, the rest of the product "
            "(login, billing, history, support) stays available, and the customer sees a clear "
            "message that generation is delayed. That separation is the difference between a "
            "demo and a service a client can rely on.",
            st["body"],
        ),
        bullets(
            [
                "<b>Application</b> — the MarketLoopAI web product customers already see evolving (accounts, projects, billing).",
                "<b>Generation service</b> — dedicated hardware running Wan 2.2. One clip is processed at a time per GPU so quality is not degraded by overcrowding.",
                "<b>Private files</b> — videos are not sitting on a public link. Downloads use short-lived secure links.",
                "<b>Room to grow</b> — when demand rises, we add more generation machines. When a better model appears, it is plugged in as an option, not a rewrite.",
            ],
            st,
        ),
        p(
            "Wan 2.2 is used because it is commercially licensable, competitive in quality among "
            "open models, and can start on a single professional GPU for the smaller variant. "
            "A higher-quality variant exists and can be offered later as a premium option when "
            "volume justifies the hardware.",
            st["body"],
        ),
        p("10. Quality, time, and honest limits", st["h1"]),
        table(
            ["Topic", "What to tell a customer"],
            [
                [
                    "Length",
                    "About five seconds per generation in the first release.",
                ],
                [
                    "Time to result",
                    "Typically several minutes, not seconds. Official figures for the first engine "
                    "describe a five-second 720p clip in under nine minutes on consumer-class hardware. "
                    "We will publish our own typical times after we measure on the hardware we actually run.",
                ],
                [
                    "Quality",
                    "Strong for short social and concept clips. It will not match a live-action crew, "
                    "and results vary with prompt skill. Customers can retry.",
                ],
                [
                    "Consistency",
                    "The same prompt can vary. A saved seed helps iteration. Perfect frame-by-frame "
                    "repeatability is not something we will promise until we have measured it.",
                ],
                [
                    "Availability",
                    "Generation depends on GPU capacity. We will show status in the product rather than fail silently.",
                ],
            ],
            [32 * mm, w - 32 * mm],
        ),
        p("Table 5. Claims we are prepared to stand behind in the first release.", st["cap"]),
        p("11. Security, privacy, and ownership", st["h1"]),
        bullets(
            [
                "Each organisation only sees its own projects, prompts, and files.",
                "Videos and uploads are stored privately. Sharing is by design (download), not by an open folder on the internet.",
                "Customers own their outputs, subject to law and the product terms. MarketLoopAI does not use customer prompts or videos to train a public model in this design.",
                "Unsafe or disallowed prompts can be blocked. The customer remains responsible for how they use generated media.",
                "Payment is handled by Stripe. We do not store card numbers on our servers.",
                "A retention policy will apply (for example, free-tier files kept for a shorter period than paid). This will be stated in the privacy policy before launch.",
            ],
            st,
        ),
        p("12. Commercial notes", st["h1"]),
        p(
            "The largest ongoing cost is the generation hardware, which incurs cost even when "
            "few customers are generating. Pricing must therefore follow measured cost per clip, "
            "not only the published video counts on the marketing site. After a short measurement "
            "window on production hardware, credit prices can be frozen for beta.",
            st["body"],
        ),
        p(
            "A closed beta with paying design partners is the responsible path: it tests quality "
            "expectations, wait times, and support load before a wide launch. Unlimited or "
            "very-low-priced video on expensive hardware is not a sustainable offer.",
            st["body"],
        ),
        p("13. Suggested next steps with you", st["h1"]),
        bullets(
            [
                "Confirm that a five-second short-form product matches what you want to take to market first.",
                "Agree which customer (or internal brand) will be the first design partner.",
                "Align public website copy with first-release length and wait times.",
                "If you wish to proceed to a statement of work, we will attach dates, responsibilities, and acceptance criteria to the stages in Table 4.",
            ],
            st,
        ),
        p("14. Document control", st["h1"]),
        table(
            ["Field", "Value"],
            [
                ["Title", "MarketLoopAI AI Video Generation — Client Overview"],
                ["Version", "1.0"],
                ["Date", "27 August 2026"],
                ["Classification", "Confidential — intended recipient only"],
                ["Status", "For discussion; not a contract"],
                ["Related internal document", "Software requirements and engineering blueprint (not attached)"],
            ],
            [45 * mm, w - 45 * mm],
        ),
        p(
            "© 2026 MarketLoopAI. This document may be forwarded to people inside the recipient "
            "organisation who need it for evaluation. Please do not publish it.",
            st["footer_note"],
        ),
    ]
    return story


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=A4,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=20 * mm,
        bottomMargin=16 * mm,
        title="MarketLoopAI AI Video Generation — Client Overview",
        author="MarketLoopAI",
        subject="Client overview of the AI video generation SaaS product",
    )
    story = build_story()

    def first(c, d):
        cover_page(c, d)

    def later(c, d):
        header_footer(c, d)

    doc.build(story, onFirstPage=first, onLaterPages=later)
    print(OUT)


if __name__ == "__main__":
    main()
