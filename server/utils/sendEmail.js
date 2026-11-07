const nodemailer = require("nodemailer");
let transporter;

module.exports = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !to) {
    console.log(`[email skipped] "${subject}" -> ${to || "n/a"}`);
    return;
  }
  transporter ??= nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  try {
    await transporter.sendMail({ from: `"${process.env.BRAND_NAME || "QIVANTA"}" <${process.env.EMAIL_USER}>`, to, subject, html });
  } catch (e) {
    console.error("Email failed:", e.message);
  }
};
