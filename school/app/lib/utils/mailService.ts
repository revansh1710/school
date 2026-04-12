const nodemailer = require("nodemailer")
import path from "path"
import { statusConfig } from "@/lib/admissionStatusConfig"
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})
const COLORS = {
  navy: "#0a0f1e",
  navyMid: "#0d1630",
  navyLight: "#111d3c",
  cyan: "#00d4ff",
  cyanDim: "#00aacc",
  gold: "#c9a84c",
  goldLight: "#e2c97e",
  white: "#ffffff",
  grayLight: "#e8edf5",
  grayMid: "#8a9ab8",
  grayText: "#4a5568",
}

/**
 * Shared CSS animations injected into the <head> of every email.
 * Supported in Gmail (Android/iOS), Apple Mail, Outlook.com, Thunderbird.
 * Outlook desktop ignores @keyframes gracefully — styles degrade cleanly.
 */
const ANIMATION_STYLES = `
<style type="text/css">
  /* ── Pulse: accent bar gradient glow ── */
  @keyframes barPulse {
    0%,100% { opacity:1; }
    50%      { opacity:0.45; }
  }
  /* ── Crest gold shimmer ── */
  @keyframes crestGlow {
    0%   { box-shadow:0 4px 14px rgba(201,168,76,0.35); }
    100% { box-shadow:0 4px 28px rgba(201,168,76,0.65), 0 0 10px rgba(201,168,76,0.25); }
  }
  /* ── Monospace subtitle blink (terminal cursor feel) ── */
  @keyframes subBlink {
    0%,89%,100% { opacity:1; }
    90%,95%     { opacity:0.3; }
  }
  /* ── Section label flicker ── */
  @keyframes labelFlicker {
    0%,96%,100% { opacity:1; }
    97%,99%     { opacity:0; }
  }
  /* ── Scanline sweep across card body ── */
  @keyframes scanline {
    0%   { top:-10%; }
    100% { top:110%; }
  }
  /* ── Holographic shimmer ── */
  @keyframes shimmer {
    0%   { background-position:-200% center; }
    100% { background-position:200% center; }
  }
  /* ── Step cards slide in on load ── */
  @keyframes stepReveal {
    from { opacity:0; transform:translateX(-14px); }
    to   { opacity:1; transform:translateX(0); }
  }
  /* ── Callout box border pulse ── */
  @keyframes calloutPulse {
    0%   { border-color:rgba(201,168,76,0.2); }
    100% { border-color:rgba(201,168,76,0.5); }
  }
  /* ── CTA button gradient rotation ── */
  @keyframes ctaBorderRotate {
    0%   { background-position:0% 50%; }
    50%  { background-position:100% 50%; }
    100% { background-position:0% 50%; }
  }
  /* ── CTA light-sweep ── */
  @keyframes btnSweep {
    0%   { left:-60%; }
    100% { left:160%; }
  }
  /* ── Footer line breathing ── */
  @keyframes footerLine {
    0%,100% { width:50px; opacity:0.5; }
    50%     { width:90px; opacity:1; }
  }
  /* ── Expiry timer blink ── */
  @keyframes expiryBlink {
    0%,100% { opacity:1; }
    50%     { opacity:0.55; }
  }

  /* ── Apply animations ── */
  .bar-pulse    { animation:barPulse    3s ease-in-out infinite; }
  .crest-glow   { animation:crestGlow  3s ease-in-out infinite alternate; }
  .sub-blink    { animation:subBlink   4s ease-in-out infinite; }
  .lbl-flicker  { animation:labelFlicker 6s step-end infinite; }
  .scanline     { animation:scanline   5s linear infinite; pointer-events:none; }
  .shimmer-bar  {
    background:linear-gradient(115deg,transparent 30%,rgba(0,212,255,0.05) 50%,rgba(201,168,76,0.05) 60%,transparent 70%);
    background-size:300% 100%;
    animation:shimmer 6s ease-in-out infinite;
    pointer-events:none;
  }
  .step-1 { animation:stepReveal .45s ease both .05s; }
  .step-2 { animation:stepReveal .45s ease both .15s; }
  .step-3 { animation:stepReveal .45s ease both .25s; }
  .step-4 { animation:stepReveal .45s ease both .35s; }
  .callout-pulse { animation:calloutPulse 4s ease-in-out infinite alternate; }
  .cta-border-rotate {
    background:linear-gradient(135deg,#00d4ff,#0088bb,#00d4ff);
    background-size:200% 200%;
    animation:ctaBorderRotate 3s linear infinite;
  }
  .btn-sweep::after {
    content:'';
    position:absolute;top:-50%;left:-60%;width:40%;height:200%;
    background:linear-gradient(90deg,transparent,rgba(0,212,255,0.18),transparent);
    transform:skewX(-20deg);
    animation:btnSweep 3s ease-in-out infinite 1s;
  }
  .footer-line-anim { animation:footerLine 3s ease-in-out infinite; }
  .expiry-blink     { animation:expiryBlink 2s ease-in-out infinite; }
</style>
`

/** Shared SVG header — school crest + name, with animation classes */
const renderHeader = (subtitle = "Excellence in Education") => `
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="
        background: linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyMid} 60%, #0b1a3a 100%);
        padding: 0;
        position: relative;
        overflow: hidden;
      ">
        <!-- Holographic shimmer overlay -->
        <div class="shimmer-bar" style="
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
        "></div>

        <!-- Scanline sweep -->
        <div class="scanline" style="
          position: absolute; left: 0; right: 0; height: 3px;
          background: linear-gradient(to bottom, transparent, rgba(0,212,255,0.06), transparent);
          z-index: 2;
        "></div>

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="position:relative;z-index:3;">
          <tr>
            <!-- Animated left accent stripe -->
            <td width="4" class="bar-pulse" style="
              background: linear-gradient(to bottom, ${COLORS.cyan}, ${COLORS.gold});
              font-size:0; line-height:0;
            ">&nbsp;</td>
            <td style="padding: 32px 40px 26px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 14px;">
                      <tr>
                        <!-- Animated crest -->
                        <td class="crest-glow" style="
                          background: linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldLight} 50%, ${COLORS.gold} 100%);
                          border-radius: 4px 4px 12px 12px;
                          padding: 10px 13px;
                          text-align: center;
                        ">
                          <span style="font-size: 22px; line-height: 1;">🏛️</span>
                        </td>
                        <td width="14">&nbsp;</td>
                        <td style="vertical-align: middle;">
                          <div style="
                            font-family: 'Georgia', 'Times New Roman', serif;
                            font-size: 25px; font-weight: 700;
                            color: ${COLORS.white};
                            letter-spacing: 2px; text-transform: uppercase; line-height: 1.1;
                          ">SCHOOL</div>
                          <!-- Terminal-blink subtitle -->
                          <div class="sub-blink" style="
                            font-family: 'Courier New', monospace;
                            font-size: 9px; letter-spacing: 3px;
                            color: ${COLORS.cyan};
                            text-transform: uppercase; margin-top: 5px;
                          ">${subtitle}</div>
                        </td>
                      </tr>
                    </table>

                    <!-- Gradient divider -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td height="1" style="
                          background: linear-gradient(to right, ${COLORS.cyan}, ${COLORS.gold}, transparent);
                          font-size:0; line-height:0;
                        ">&nbsp;</td>
                      </tr>
                    </table>

                    <div style="
                      font-family: 'Courier New', monospace;
                      font-size: 9px; letter-spacing: 4px;
                      color: ${COLORS.grayMid};
                      text-transform: uppercase; margin-top: 11px;
                    ">INSPIRING EXCELLENCE &nbsp;·&nbsp; NURTURING CHARACTER</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`

/** Shared footer */
const renderFooter = () => `
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="
        background: ${COLORS.navy};
        border-top: 1px solid rgba(0,212,255,0.2);
        padding: 24px 40px;
        text-align: center;
      ">
        <!-- Dot separator row -->
        <div style="
          font-family: 'Courier New', monospace;
          font-size: 10px;
          letter-spacing: 3px;
          color: ${COLORS.grayMid};
          text-transform: uppercase;
          margin-bottom: 10px;
        ">
          ADMISSIONS &nbsp;·&nbsp; ENQUIRIES &nbsp;·&nbsp; SUPPORT
        </div>
        <div style="
          font-family: Georgia, serif;
          font-size: 11px;
          color: rgba(138,154,184,0.6);
          margin-top: 8px;
        ">
          © ${new Date().getFullYear()} School &nbsp;|&nbsp; All rights reserved &nbsp;|&nbsp; Confidential Communication
        </div>
        <!-- Animated bottom cyan line -->
        <table class="footer-line-anim" cellpadding="0" cellspacing="0" border="0" style="margin: 14px auto 0; width:80px;">
          <tr>
            <td height="2" style="background: linear-gradient(to right, transparent, ${COLORS.cyan}, transparent); font-size:0; line-height:0;">&nbsp;</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`

/* ─────────────────────────────────────────────
   WELCOME EMAIL
   ───────────────────────────────────────────── */
const sendWelcomeMail = async ({ to, name }: { to: string; name: string }) => {
  const pdfPath = path.join(process.cwd(), "public/admissions/prospectus.pdf")

  const steps = [
    {
      num: "01",
      title: "Register Your Enquiry",
      desc: "Complete an enquiry with the school so your email is registered in our system.",
    },
    {
      num: "02",
      title: "Use Your Registered Email",
      desc: "On the login page, enter the same email address you used during your enquiry.",
    },
    {
      num: "03",
      title: "Receive Your Secure Link",
      desc: "A one-time access link will be delivered instantly to your inbox.",
    },
    {
      num: "04",
      title: "Access Your Dashboard",
      desc: "Click the link to log in securely — no password required.",
    },
  ]

  const stepsHTML = steps
    .map(
      (s, i) => `
    <tr>
      <td style="padding: 0 0 14px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" class="step-${i + 1}" style="
          background: linear-gradient(135deg, ${COLORS.navyLight} 0%, rgba(17,29,60,0.6) 100%);
          border: 1px solid rgba(0,212,255,0.15);
          border-left: 3px solid ${COLORS.cyan};
          border-radius: 6px;
        ">
          <tr>
            <td width="64" style="padding: 18px 0 18px 20px; vertical-align: top;">
              <div style="
                font-family: 'Courier New', monospace;
                font-size: 20px; font-weight: 700;
                color: ${COLORS.cyan}; opacity: 0.45; line-height: 1;
              ">${s.num}</div>
            </td>
            <td style="padding: 18px 20px 18px 0; vertical-align: top;">
              <div style="
                font-family: Georgia, serif;
                font-size: 13px; font-weight: 700;
                color: ${COLORS.white}; margin-bottom: 3px; letter-spacing: 0.5px;
              ">${s.title}</div>
              <div style="
                font-family: 'Courier New', monospace;
                font-size: 12px; color: ${COLORS.grayMid}; line-height: 1.7;
              ">${s.desc}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `
    )
    .join("")

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to School</title>
  ${ANIMATION_STYLES}
</head>
<body style="margin:0;padding:0;background:#060b18;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#060b18;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="
          max-width:600px;
          width:100%;
          background:${COLORS.navyMid};
          border-radius:10px;
          overflow:hidden;
          border:1px solid rgba(0,212,255,0.18);
          box-shadow:0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.08);
        ">

          <!-- HEADER -->
          <tr><td>${renderHeader("Admissions Portal")}</td></tr>

          <!-- BODY -->
          <tr>
            <td style="padding: 40px 40px 32px;">

              <!-- Greeting -->
              <div style="
                font-family: 'Courier New', monospace;
                font-size: 10px;
                letter-spacing: 4px;
                color: ${COLORS.cyan};
                text-transform: uppercase;
                margin-bottom: 12px;
              ">WELCOME MESSAGE</div>

              <h2 style="
                font-family: Georgia, 'Times New Roman', serif;
                font-size: 22px;
                color: ${COLORS.white};
                margin: 0 0 16px;
                font-weight: 400;
                letter-spacing: 0.5px;
              ">Dear <span style="color:${COLORS.gold};">${name}</span>,</h2>

              <p style="
                font-family: Arial, sans-serif;
                font-size: 14px;
                color: ${COLORS.grayMid};
                line-height: 1.8;
                margin: 0 0 28px;
              ">
                Welcome to School's Parent Portal. We are delighted to have your family join our community. 
                Your child's journey with us begins here — with secure, seamless access to everything you need.
              </p>

              <!-- Divider with label -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td height="1" style="background: rgba(0,212,255,0.15); font-size:0; line-height:0;">&nbsp;</td>
                  <td style="padding: 0 16px; white-space:nowrap;">
                    <span style="
                      font-family: 'Courier New', monospace;
                      font-size: 9px;
                      letter-spacing: 3px;
                      color: ${COLORS.cyan};
                      text-transform: uppercase;
                    ">HOW TO ACCESS</span>
                  </td>
                  <td height="1" style="background: rgba(0,212,255,0.15); font-size:0; line-height:0;">&nbsp;</td>
                </tr>
              </table>

              <!-- Steps -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${stepsHTML}
              </table>

              <!-- Info callout box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" class="callout-pulse" style="margin-top:8px; margin-bottom:32px;">
                <tr>
                  <td style="
                    background: linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(0,212,255,0.06) 100%);
                    border: 1px solid rgba(201,168,76,0.25);
                    border-radius: 6px;
                    padding: 16px 20px;
                  ">
                    <div style="
                      font-family: 'Courier New', monospace;
                      font-size: 10px;
                      letter-spacing: 3px;
                      color: ${COLORS.gold};
                      text-transform: uppercase;
                      margin-bottom: 6px;
                    ">📎 ATTACHED: PROSPECTUS</div>
                    <div style="
                      font-family: Arial, sans-serif;
                      font-size: 13px;
                      color: ${COLORS.grayMid};
                      line-height: 1.6;
                    ">
                      We have attached our Admissions Prospectus for your review. 
                      It contains full details on our curriculum, facilities, fee structure, and admissions timeline.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Sign-off -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td height="1" style="background: rgba(0,212,255,0.12); font-size:0; line-height:0; margin-bottom:20px;">&nbsp;</td>
                </tr>
              </table>
              <div style="
                font-family: Arial, sans-serif;
                font-size: 13px;
                color: ${COLORS.grayMid};
                line-height: 1.8;
                margin-top: 20px;
              ">
                Warm regards,<br/>
                <span style="
                  font-family: Georgia, serif;
                  font-size: 15px;
                  color: ${COLORS.white};
                  font-weight: 600;
                ">School Administration</span><br/>
                <span style="
                  font-family: 'Courier New', monospace;
                  font-size: 10px;
                  letter-spacing: 2px;
                  color: ${COLORS.cyan};
                ">ADMISSIONS OFFICE</span>
              </div>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr><td>${renderFooter()}</td></tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `

  const info = await transporter.sendMail({
    from: `"School" <${process.env.SMTP_USER}>`,
    to,
    subject: "Welcome to School — Admissions Information",
    html,
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

/* ─────────────────────────────────────────────
   MAGIC LOGIN EMAIL
   ───────────────────────────────────────────── */
const sendMagicLoginMail = async ({
  to,
  name,
  loginLink,
}: {
  to: string
  name: string
  loginLink: string
}) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Access Your Dashboard</title>
  ${ANIMATION_STYLES}
</head>
<body style="margin:0;padding:0;background:#060b18;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#060b18;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="
          max-width:600px;
          width:100%;
          background:${COLORS.navyMid};
          border-radius:10px;
          overflow:hidden;
          border:1px solid rgba(0,212,255,0.18);
          box-shadow:0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.08);
        ">

          <!-- HEADER -->
          <tr><td>${renderHeader("Parent Portal")}</td></tr>

          <!-- BODY -->
          <tr>
            <td style="padding: 40px 40px 36px;">

              <!-- Label -->
              <div class="lbl-flicker" style="
                font-family: 'Courier New', monospace;
                font-size: 10px;
                letter-spacing: 4px;
                color: ${COLORS.cyan};
                text-transform: uppercase;
                margin-bottom: 12px;
              ">SECURE ACCESS LINK</div>

              <h2 style="
                font-family: Georgia, 'Times New Roman', serif;
                font-size: 22px;
                color: ${COLORS.white};
                margin: 0 0 16px;
                font-weight: 400;
              ">Hello, <span style="color:${COLORS.gold};">${name}</span></h2>

              <p style="
                font-family: 'Courier New', monospace;
                font-size: 12px;
                color: ${COLORS.grayMid};
                line-height: 1.9;
                margin: 0 0 32px;
              ">
                Your secure one-time login link is ready. Click the button below to access 
                your Parent Dashboard — no password needed.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <!-- Animated outer border -->
                    <table cellpadding="0" cellspacing="0" border="0" class="cta-border-rotate" style="
                      border-radius: 8px;
                      background-size: 200% 200%;
                      padding: 1.5px;
                      box-shadow: 0 0 32px rgba(0,212,255,0.3), 0 8px 24px rgba(0,0,0,0.5);
                    ">
                      <tr>
                        <td style="
                          background: linear-gradient(135deg, #003d55 0%, #002233 100%);
                          border-radius: 7px;
                          padding: 2px;
                          overflow: hidden;
                          position: relative;
                        ">
                          <a href="${loginLink}" class="btn-sweep" style="
                            display: inline-block;
                            padding: 16px 48px;
                            font-family: 'Courier New', monospace;
                            font-size: 13px;
                            font-weight: 700;
                            letter-spacing: 3px;
                            text-transform: uppercase;
                            color: ${COLORS.cyan};
                            text-decoration: none;
                            border-radius: 5px;
                            background: linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(0,212,255,0.03) 100%);
                            position: relative;
                            overflow: hidden;
                          ">
                            ⚡ Access Dashboard
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Expiry notice with blink -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                <tr>
                  <td style="
                    background: rgba(201,168,76,0.06);
                    border: 1px solid rgba(201,168,76,0.2);
                    border-radius: 6px;
                    padding: 14px 18px;
                    text-align: center;
                  ">
                    <span class="expiry-blink" style="
                      font-family: 'Courier New', monospace;
                      font-size: 11px;
                      letter-spacing: 2px;
                      color: ${COLORS.gold};
                      text-transform: uppercase;
                    ">⏳ Link expires in 15 minutes</span>
                  </td>
                </tr>
              </table>

              <!-- Security note -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="
                    background: rgba(0,0,0,0.2);
                    border-left: 2px solid rgba(0,212,255,0.3);
                    border-radius: 0 4px 4px 0;
                    padding: 14px 18px;
                  ">
                    <div style="
                      font-family: 'Courier New', monospace;
                      font-size: 9px;
                      letter-spacing: 2px;
                      color: ${COLORS.grayMid};
                      text-transform: uppercase;
                      margin-bottom: 4px;
                    ">🔒 SECURITY NOTICE</div>
                    <div style="
                      font-family: Arial, sans-serif;
                      font-size: 12px;
                      color: rgba(138,154,184,0.7);
                      line-height: 1.6;
                    ">
                      If you did not request this link, please ignore this email. 
                      Never share this link with anyone — it grants direct access to your account.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Sign-off -->
              <div style="
                font-family: Arial, sans-serif;
                font-size: 13px;
                color: ${COLORS.grayMid};
                line-height: 1.8;
                margin-top: 32px;
              ">
                Regards,<br/>
                <span style="
                  font-family: Georgia, serif;
                  font-size: 15px;
                  color: ${COLORS.white};
                  font-weight: 600;
                ">School Administration</span><br/>
                <span style="
                  font-family: 'Courier New', monospace;
                  font-size: 10px;
                  letter-spacing: 2px;
                  color: ${COLORS.cyan};
                ">PARENT PORTAL SYSTEM</span>
              </div>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr><td>${renderFooter()}</td></tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `

  const info = await transporter.sendMail({
    from: `"School" <${process.env.SMTP_USER}>`,
    to,
    subject: "⚡ Access Your Parent Dashboard — Secure Link Inside",
    html,
  })

  return info
}

const getStatusContent = (status: string, parentName: string) => {
  switch (status) {
    case "new":
      return {
        subject: "📩 Application Received",
        title: "APPLICATION RECEIVED",
        message: `Dear ${parentName},<br/><br/>
        We have successfully received your enquiry.<br/>
        Our admissions team will review your details and reach out to you shortly.`,
      }

    case "contacted":
      return {
        subject: "📞 Admissions Team Contacted You",
        title: "CONTACT INITIATED",
        message: `Dear ${parentName},<br/><br/>
        Our admissions team has reached out to you regarding your application.<br/>
        Please check your phone or email and feel free to respond for further assistance.`,
      }

    case "documents_submitted":
      return {
        subject: "📄 Documents Received",
        title: "DOCUMENTS SUBMITTED",
        message: `Dear ${parentName},<br/><br/>
        Your documents have been successfully submitted and are currently under review.<br/>
        We will notify you once the evaluation is complete.`,
      }

    case "interview_scheduled":
      return {
        subject: "🎓 Interview Scheduled",
        title: "INTERVIEW SCHEDULED",
        message: `Dear ${parentName},<br/><br/>
        Your interview has been scheduled.<br/>
        Please log in to your dashboard to view the date, time, and further instructions.`,
      }

    case "accepted":
      return {
        subject: "🎉 Admission Confirmed",
        title: "APPLICATION ACCEPTED",
        message: `Dear ${parentName},<br/><br/>
        Congratulations! We are pleased to inform you that your application has been accepted.<br/>
        We look forward to welcoming you to our school community.`,
      }

    case "rejected":
      return {
        subject: "Application Status Update",
        title: "APPLICATION UPDATE",
        message: `Dear ${parentName},<br/><br/>
        Thank you for your interest in our institution.<br/>
        After careful consideration, we regret to inform you that your application was not selected.<br/><br/>
        We sincerely wish you the very best for the future.`,
      }

    case "withdrawn":
      return {
        subject: "Application Withdrawn",
        title: "WITHDRAWAL CONFIRMED",
        message: `Dear ${parentName},<br/><br/>
        Your application has been successfully withdrawn as per your request.<br/>
        If this was not intended, please contact our admissions office.`,
      }

    default:
      return null
  }
}

const sendStatusUpdateMail = async ({
  to,
  parentName,
  status,
}: {
  to: string
  parentName: string
  status: string
}) => {
  const normalizedStatus = (status || "new").trim().toLowerCase()

  const content = getStatusContent(normalizedStatus, parentName)

  if (!content) return


  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
${ANIMATION_STYLES}
</head>
<body style="margin:0;padding:0;background:#060b18;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px;">
<tr>
<td align="center">

<table width="600" style="
  background:${COLORS.navyMid};
  border-radius:10px;
  overflow:hidden;
  border:1px solid rgba(0,212,255,0.2);
">

<tr><td>${renderHeader("Admissions Update")}</td></tr>

<tr>
<td style="padding:40px">

<div style="
  font-family:'Courier New';
  font-size:10px;
  letter-spacing:4px;
  color:${COLORS.cyan};
  margin-bottom:12px;
">
${content.title}
</div>

<h2 style="color:${COLORS.white}; font-family:Georgia;">
Hello <span style="color:${COLORS.gold}">${parentName}</span>,
</h2>

<p style="
  color:${COLORS.grayMid};
  font-size:14px;
  line-height:1.8;
">
${content.message}
</p>

<div style="margin-top:30px; color:${COLORS.grayMid}; font-size:13px;">
Warm regards,<br/>
<b style="color:${COLORS.white}">School Administration</b>
</div>

</td>
</tr>

<tr><td>${renderFooter()}</td></tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`

  return transporter.sendMail({
    from: `"School" <${process.env.SMTP_USER}>`,
    to,
    subject: content.subject,
    html,
  })
}

export { sendWelcomeMail, sendMagicLoginMail, sendStatusUpdateMail }