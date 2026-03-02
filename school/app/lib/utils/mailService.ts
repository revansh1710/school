const nodemailer = require("nodemailer")
import path from "path"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const sendWelcomeMail = async ({ to, name }: { to: string; name: string }) => {
  const pdfPath = path.join(process.cwd(), "public/admissions/prospectus.pdf")

  const info = await transporter.sendMail({
    from: `"School" <${process.env.SMTP_USER}>`,
    to,
    subject: "Welcome to School — Admissions Information",

    html: `
      <div style="font-family:Segoe UI, Arial; background:#f5f7fa; padding:32px 16px;">
        <div style="max-width:600px;margin:auto;background:#fff;border-radius:8px;border:1px solid #e5e7eb;">
          <div style="background:#1e3a5f;padding:24px;color:#fff;text-align:center;">
            <h1 style="margin:0;font-size:22px;">School</h1>
            <p style="margin:6px 0 0;font-size:13px;opacity:.9;">
              Inspiring Excellence • Nurturing Character
            </p>
          </div>

          <div style="padding:28px 24px;color:#374151;">
            <h2 style="margin-top:0;font-size:18px;">Dear ${name},</h2>

            <p style="line-height:1.7;font-size:14px;">
              Thank you for your interest in our school. We are delighted to
              share more information about our programs and admissions process.
            </p>

            <p style="line-height:1.7;font-size:14px;">
              📎 Please find attached our <strong>Admissions Prospectus</strong>
              with detailed information about curriculum, facilities,
              and next steps.
            </p>

            <p style="margin-top:24px;font-size:14px;">
              Warm regards,<br/>
              <strong>Admissions Office</strong><br/>
              School
            </p>
          </div>

          <div style="background:#f9fafb;padding:16px;text-align:center;font-size:12px;color:#6b7280;border-top:1px solid #e5e7eb;">
            © ${new Date().getFullYear()} School • All rights reserved
          </div>
        </div>
      </div>
    `,

    attachments: [
      {
        filename: "School-Admissions-Prospectus.pdf",
        path: pdfPath,
        contentType: "application/pdf",
      },
    ],
  })

  return info
}

export { sendWelcomeMail }