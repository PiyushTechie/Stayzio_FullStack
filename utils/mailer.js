// utils/mailer.js
import fs from "fs";
import path from "path";
import mjml2html from "mjml";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

if (!BREVO_API_KEY) {
  throw new Error("BREVO_API_KEY is missing in .env");
}

if (!BREVO_API_KEY.startsWith("xkeysib-")) {
  throw new Error(
    `BREVO_API_KEY invalid: Starts with "${BREVO_API_KEY.substring(0, 9)}..." ` +
    `(expected "xkeysib-"). Use API v3 key from Brevo's API tab, not SMTP.`
  );
}

export const sendEmailFromMJML = async ({ to, subject, templateName, templateData, attachments = [] }) => {
  try {
    const templatePath = path.join(process.cwd(), "email-templates", `${templateName}.mjml`);
    const mjmlContent = fs.readFileSync(templatePath, "utf-8");

    let filledTemplate = mjmlContent;
    for (const [key, value] of Object.entries(templateData)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      filledTemplate = filledTemplate.replace(regex, value || "");
    }

    const { html, errors } = mjml2html(filledTemplate);
    if (errors?.length > 0) {
      console.error("MJML Errors:", errors);
    }

    const formattedAttachments = attachments.map(att => ({
      name: att.filename,
      content: att.content.toString('base64')
    }));

    const response = await fetch(BREVO_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "Stayzio",
          email: "piyushpraja1336@gmail.com",
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
        attachment: formattedAttachments.length > 0 ? formattedAttachments : undefined
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Full Brevo Response:", errText);
      throw new Error(`Brevo error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    return data;

  } catch (err) {
    console.error("Brevo send failed:", err.message);
    throw err;
  }
};