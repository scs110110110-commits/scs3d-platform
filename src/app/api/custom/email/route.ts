import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { BRAND_NAME, BRAND_URL, CONTACT_EMAIL } from "@/lib/config";

export const dynamic = "force-dynamic";

/** Safe config check — booleans only, no secret values exposed */
export async function GET() {
  return NextResponse.json({
    configured: !!(process.env.SMTP_USER && process.env.SMTP_PASS),
    hasSmtpUser: !!process.env.SMTP_USER,
    hasSmtpPass: !!process.env.SMTP_PASS,
    hasAdminPassword: !!process.env.ADMIN_PASSWORD,
  });
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 6;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const idea = String(formData.get("idea") || "").trim();
    const dimensions = String(formData.get("dimensions") || "").trim();

    if (!idea) {
      return NextResponse.json({ error: "Please describe your idea." }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      return NextResponse.json(
        { error: "Email service not configured. Please contact us on WhatsApp." },
        { status: 503 }
      );
    }

    const attachments: { filename: string; content: Buffer; contentType?: string }[] = [];
    const files = formData.getAll("photos");

    for (const file of files) {
      if (!(file instanceof File) || file.size === 0) continue;
      if (attachments.length >= MAX_FILES) break;
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `Each photo must be under ${MAX_FILE_SIZE / 1024 / 1024}MB.` },
          { status: 400 }
        );
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      attachments.push({
        filename: file.name,
        content: buffer,
        contentType: file.type || undefined,
      });
    }

    if (attachments.length === 0) {
      return NextResponse.json(
        { error: "Please upload at least one reference photo." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    const body = [
      `New custom request from ${BRAND_URL}`,
      "",
      `Name: ${name || "Not provided"}`,
      `Email: ${email}`,
      dimensions ? `Dimensions: ${dimensions}` : null,
      "",
      "Project idea:",
      idea,
      "",
      `Attachments: ${attachments.length} photo(s)`,
    ]
      .filter(Boolean)
      .join("\n");

    await transporter.sendMail({
      from: `"${BRAND_NAME} Website" <${smtpUser}>`,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `[${BRAND_NAME}] Custom Request — ${name || email}`,
      text: body,
      attachments,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email send error:", err);
    return NextResponse.json(
      { error: "Failed to send email. Please try WhatsApp instead." },
      { status: 500 }
    );
  }
}
