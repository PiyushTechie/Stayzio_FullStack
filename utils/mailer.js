// utils/mailer.js
import sgMail from "@sendgrid/mail";
import fs from "fs";
import path from "path";
import mjml2html from "mjml";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmailFromMJML = async ({ to, subject, templateName, templateData }) => {
  const templatePath = path.join(process.cwd(), "email-templates", `${templateName}.mjml`);
  const mjmlContent = fs.readFileSync(templatePath, "utf-8");

  // Replace {{placeholders}}
  let filledTemplate = mjmlContent;
  for (const [key, value] of Object.entries(templateData)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    filledTemplate = filledTemplate.replace(regex, value || "");
  }

  // Convert MJML → HTML
  const { html, errors } = mjml2html(filledTemplate);
  if (errors.length > 0) {
    console.error("MJML Errors:", errors);
  }

  const msg = {
    to,
    from: process.env.SENDGRID_FROM,
    subject,
    html,
  };

  await sgMail.send(msg);
  console.log(`✅ Email sent to ${to} with ${templateName}`);
};

// In your mailer.js or wherever you set up SendGrid
console.log("Attempting to use SendGrid Key:", process.env.SENDGRID_API_KEY);

// If this prints "undefined", your .env file is the problem.
// If it prints the key, the key itself (permissions, value) is the problem.