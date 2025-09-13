// utils/mailer.js
import nodemailer from "nodemailer";
import { renderTemplate } from "./emailTemplates.js"; // ✅ use single source

// ✅ Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // or use host/port/secure for custom SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Send email from MJML + Handlebars template
export async function sendEmailFromTemplate({ to, subject, templateName, templateData = {} }) {
  try {
    // Render MJML → HTML
    const html = await renderTemplate(templateName, templateData);

    const info = await transporter.sendMail({
      from: `"Stayzio" <${process.env.EMAIL_USER}>`, // sender name + email
      to,
      subject,
      html,
    });
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
}
