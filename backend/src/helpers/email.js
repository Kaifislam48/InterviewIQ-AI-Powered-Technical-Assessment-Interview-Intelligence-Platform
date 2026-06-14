const env = require('../config/env');
const logger = require('../utils/logger');

const sendEmail = async (options) => {
  // In development/test or if credentials are empty, log email link to console.
  if (
    env.NODE_ENV === 'development' ||
    env.NODE_ENV === 'test' ||
    !env.SMTP_USER ||
    !env.SMTP_PASS
  ) {
    logger.info(`
================ MOCK MAIL SENT ================
TO: ${options.to}
SUBJECT: ${options.subject}
MESSAGE:
${options.text}
================================================
    `);
    return true;
  }

  // Ready for production using nodemailer:
  try {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: env.FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error(`Failed to send email: ${error.message}`);
    throw error;
  }
};

module.exports = {
  sendEmail,
};
