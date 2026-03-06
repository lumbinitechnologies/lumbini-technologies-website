// Supabase Edge Function: send-letter
// Generates a PDF letter, uploads to Storage, and emails a signed link to the intern.
//
// Required env vars (set in Supabase project):
// - SUPABASE_URL
// - SUPABASE_ANON_KEY
// - SUPABASE_SERVICE_ROLE_KEY
//
// Optional (email sending via Resend):
// - RESEND_API_KEY
// - FROM_EMAIL (e.g. "Lumbini HR <hr@yourdomain.com>")
//
// Storage:
// - Create a bucket named "letters" (private recommended).
//
// Request body:
// { applicationId: string | number, type: "offer" | "agreement" }

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { PDFDocument, StandardFonts, rgb } from "npm:pdf-lib@1.17.1";

type LetterType = "offer" | "agreement";

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function requireEnv(name: string): string {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function safeFilePart(input: string) {
  return (input || "unknown")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

async function generatePdfBytes(params: {
  type: LetterType;
  applicantName: string;
  applicantEmail: string;
  university?: string | null;
  degree?: string | null;
  year?: string | null;
  createdAt?: string | null;
}) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4

  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const margin = 56;
  const width = page.getWidth();
  let y = page.getHeight() - margin;

  const title = params.type === "offer"
    ? "Internship Offer Letter"
    : "Internship Agreement";

  const company = "Lumbini Technologies";
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  page.drawText(company, {
    x: margin,
    y,
    size: 20,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  y -= 28;

  page.drawText(title, {
    x: margin,
    y,
    size: 14,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  y -= 22;

  page.drawText(`Date: ${dateStr}`, {
    x: margin,
    y,
    size: 11,
    font,
    color: rgb(0.15, 0.15, 0.15),
  });
  y -= 28;

  page.drawText(`Dear ${params.applicantName || "Intern"},`, {
    x: margin,
    y,
    size: 11,
    font,
    color: rgb(0, 0, 0),
  });
  y -= 22;

  const lines: string[] = [];
  if (params.type === "offer") {
    lines.push(
      "We are pleased to offer you an internship opportunity at Lumbini Technologies, subject to verification of the information provided and our policies.",
      "",
      `Intern Email: ${params.applicantEmail}`,
      `University: ${params.university || "—"}`,
      `Degree/Branch: ${params.degree || "—"}`,
      `Year/Semester: ${params.year || "—"}`,
      "",
      "Internship duration: 3 months",
      "Start date: To be confirmed by HR",
      "",
      "Please reply to this email to confirm your acceptance. Further onboarding details will be shared separately.",
    );
  } else {
    lines.push(
      `This internship agreement is made between Lumbini Technologies and ${params.applicantName || "the Intern"}.`,
      "",
      "The Intern agrees to:",
      "- Work on assigned tasks and projects",
      "- Maintain confidentiality of company information",
      "- Follow workplace policies and professional conduct",
      "- Attend required meetings and provide timely updates",
      "",
      `Intern Email: ${params.applicantEmail}`,
      `University: ${params.university || "—"}`,
      "",
      "Duration: 3 months",
      "",
      "By proceeding with onboarding, you acknowledge and agree to the terms above. HR will share the final signed copy.",
    );
  }

  const maxWidth = width - margin * 2;
  const fontSize = 11;
  const lineHeight = 16;

  // crude wrap: split long lines into chunks
  const wrapLine = (text: string) => {
    if (!text) return [""];
    const words = text.split(/\s+/);
    const out: string[] = [];
    let cur = "";
    for (const w of words) {
      const next = cur ? `${cur} ${w}` : w;
      const wWidth = font.widthOfTextAtSize(next, fontSize);
      if (wWidth <= maxWidth) {
        cur = next;
      } else {
        if (cur) out.push(cur);
        cur = w;
      }
    }
    if (cur) out.push(cur);
    return out;
  };

  for (const raw of lines) {
    const wrapped = wrapLine(raw);
    for (const line of wrapped) {
      page.drawText(line, {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      y -= lineHeight;
      if (y < margin + 80) {
        // Add a new page if needed
        const p = doc.addPage([595.28, 841.89]);
        y = p.getHeight() - margin;
        // switch reference for subsequent drawing
        (page as unknown as { drawText: typeof p.drawText }).drawText =
          p.drawText.bind(p);
      }
    }
    // paragraph spacing
    y -= 6;
  }

  y -= 10;
  page.drawText("Sincerely,", { x: margin, y, size: 11, font });
  y -= 18;
  page.drawText("HR Team", { x: margin, y, size: 11, font: fontBold });
  y -= 14;
  page.drawText(company, { x: margin, y, size: 11, font: fontBold });

  const pdfBytes = await doc.save();
  return pdfBytes;
}

async function sendEmailViaResend(params: {
  apiKey: string;
  from: string;
  to: string;
  subject: string;
  html: string;
}) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: params.from,
      to: [params.to],
      subject: params.subject,
      html: params.html,
    }),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Resend failed: ${res.status} ${t}`.trim());
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  try {
    const SUPABASE_URL = requireEnv("SUPABASE_URL");
    const SUPABASE_ANON_KEY = requireEnv("SUPABASE_ANON_KEY");
    const SUPABASE_SERVICE_ROLE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader) return json(401, { error: "Missing Authorization header" });

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });

    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const body = await req.json().catch(() => null) as
      | { applicationId?: string | number; type?: LetterType }
      | null;

    const applicationId = body?.applicationId;
    const type = body?.type;
    if (!applicationId || (type !== "offer" && type !== "agreement")) {
      return json(400, { error: "Invalid body. Expect { applicationId, type }" });
    }

    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) return json(401, { error: "Unauthorized" });

    const requesterEmail = userData.user.email;
    if (!requesterEmail) return json(403, { error: "No requester email" });

    const { data: adminRow, error: adminErr } = await adminClient
      .from("admins")
      .select("id")
      .eq("email", requesterEmail)
      .maybeSingle();

    if (adminErr) return json(500, { error: adminErr.message });
    if (!adminRow) return json(403, { error: "Forbidden (not an admin)" });

    const { data: app, error: appErr } = await adminClient
      .from("applications")
      .select("id,name,email,university,degree,year,created_at")
      .eq("id", applicationId)
      .maybeSingle();

    if (appErr) return json(500, { error: appErr.message });
    if (!app) return json(404, { error: "Application not found" });
    if (!app.email) return json(400, { error: "Application missing email" });

    const pdfBytes = await generatePdfBytes({
      type,
      applicantName: app.name || "Intern",
      applicantEmail: app.email,
      university: app.university,
      degree: app.degree,
      year: app.year,
      createdAt: app.created_at,
    });

    const fileNameBase = `${safeFilePart(app.name || "intern")}-${type}-${Date.now()}`;
    const objectPath = `${app.id}/${fileNameBase}.pdf`;

    const upload = await adminClient.storage
      .from("letters")
      .upload(objectPath, new Blob([pdfBytes], { type: "application/pdf" }), {
        contentType: "application/pdf",
        upsert: true,
      });

    if (upload.error) return json(500, { error: upload.error.message });

    const signed = await adminClient.storage
      .from("letters")
      .createSignedUrl(objectPath, 60 * 60 * 24 * 7); // 7 days

    if (signed.error) return json(500, { error: signed.error.message });

    const signedUrl = signed.data.signedUrl;

    let emailSent = false;
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const fromEmail = Deno.env.get("FROM_EMAIL");

    if (resendKey && fromEmail) {
      const subject = type === "offer"
        ? "Your Internship Offer Letter"
        : "Your Internship Agreement";

      const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111">
          <p>Hi ${app.name || "there"},</p>
          <p>Your document is ready:</p>
          <p>
            <a href="${signedUrl}" target="_blank" rel="noreferrer">${type === "offer" ? "Offer Letter" : "Internship Agreement"} (secure link)</a>
          </p>
          <p>This link expires in 7 days. If it expires, reply to this email and we’ll resend it.</p>
          <p>Regards,<br/>Lumbini HR</p>
        </div>
      `;

      await sendEmailViaResend({
        apiKey: resendKey,
        from: fromEmail,
        to: app.email,
        subject,
        html,
      });
      emailSent = true;
    }

    return json(200, {
      ok: true,
      type,
      applicationId: app.id,
      to: app.email,
      storagePath: objectPath,
      signedUrl,
      emailSent,
      expiresInSeconds: 60 * 60 * 24 * 7,
    });
  } catch (e) {
    return json(500, { error: e instanceof Error ? e.message : String(e) });
  }
});

