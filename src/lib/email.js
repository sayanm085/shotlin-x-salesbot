// Email sending service
import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from './logger.js';

// For __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Load email template
const loadTemplate = async (templateName) => {
  try {
    const templatePath = path.join(__dirname, `../../templates/email/${templateName}.hbs`);
    const template = await fs.readFile(templatePath, 'utf8');
    return Handlebars.compile(template);
  } catch (error) {
    logger.error(`Error loading email template ${templateName}:`, error);
    throw error;
  }
};

// Send email
export const sendEmail = async (to, subject, templateName, data) => {
  try {
    const transporter = createTransporter();
    
    // Load and compile template
    let htmlContent;
    try {
      const template = await loadTemplate(templateName);
      htmlContent = template(data);
    } catch (error) {
      // Fallback to basic template if template not found
      htmlContent = `
        <h1>${subject}</h1>
        <p>Hello,</p>
        <p>Thank you for your interest in Shotlin services.</p>
        <p>Here are the details you requested:</p>
        <pre>${JSON.stringify(data, null, 2)}</pre>
        <p>Best regards,<br>Shotlin Team</p>
      `;
    }
    
    // Send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: htmlContent
    });
    
    logger.info(`Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`Error sending email to ${to}:`, error);
    return { success: false, error: error.message };
  }
};

// Send proposal email
export const sendProposal = async (lead, packageDetails) => {
  if (!lead.email) {
    return { success: false, error: 'No email address available' };
  }
  
  return await sendEmail(
    lead.email,
    `Your Shotlin Web Development Proposal - ${lead.shopName || 'Custom Solution'}`,
    'proposal',
    {
      name: lead.name,
      business: lead.shopName,
      industry: lead.industry,
      package: packageDetails,
      date: new Date().toLocaleDateString()
    }
  );
};