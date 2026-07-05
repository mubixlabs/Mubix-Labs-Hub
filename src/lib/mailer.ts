import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const user = process.env.ZOHO_SMTP_USER;
  const pass = process.env.ZOHO_SMTP_PASSWORD;

  if (!user || !pass) {
    throw new Error("ZOHO_SMTP_USER or ZOHO_SMTP_PASSWORD is not configured.");
  }

  transporter = nodemailer.createTransport({
    host: process.env.ZOHO_SMTP_HOST || "smtp.zoho.com",
    port: Number(process.env.ZOHO_SMTP_PORT || 465),
    secure: true, // true for port 465
    auth: { user, pass },
  });

  return transporter;
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
  fromLabel?: string; // e.g. "Mubix Labs Support"
}) {
  const smtp = getTransporter();
  const fromEmail = process.env.ZOHO_SMTP_USER;
  const fromName = opts.fromLabel || "Mubix Labs";

  return smtp.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: opts.to,
    replyTo: opts.replyTo,
    subject: opts.subject,
    text: opts.text,
  });
}
