// utils/emailTemplates.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';
import mjml2html from 'mjml'; // ✅ default export

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ match your folder name
const TEMPLATES_DIR = path.join(__dirname, '..', 'email-templates');

const templateCache = new Map();

async function loadTemplate(name) {
  if (templateCache.has(name)) return templateCache.get(name);
  const filePath = path.join(TEMPLATES_DIR, `${name}.mjml`);
  const raw = await fs.readFile(filePath, 'utf8');
  const compiled = Handlebars.compile(raw);
  templateCache.set(name, compiled);
  return compiled;
}

export async function renderTemplate(name, data = {}) {
  const compiled = await loadTemplate(name);
  const mjmlString = compiled(data);
  const { html, errors } = mjml2html(mjmlString, { minify: true });
  if (errors && errors.length) {
    console.warn('MJML render warnings:', errors);
  }
  return html;
}
