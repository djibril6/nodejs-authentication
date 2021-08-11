import sgMail from '@sendgrid/mail';
import { config } from '../config/';
import { logger } from '../utils';

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @param {string} html
 * @returns {Promise}
 */
const sendEmail = async (to: string, subject: string, text: string, html: string) => {
  // using Twilio SendGrid's v3 Node.js Library
  // https://github.com/sendgrid/sendgrid-nodejs

  sgMail.setApiKey(config.email.sendgridAPIKey)
  const msg = {
    to,
    from: config.email.from, // Change to your verified sender
    subject,
    text,
    html,
  }
  sgMail
  .send(msg)
  .then(() => {
    logger.info(`📧 Email Sent to ${to}`);
  })
  .catch((error) => {
    logger.warn(error)
  })
};

/**
 * Send a new reseted password by email
 * @param {string} to
 * @param {string} newPassword
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to: string, newPassword: string) => {
  const subject = '🔐 Reset password';
  const text = `Dear user,
  Here your new password: ${newPassword}
  If you did not request any password resets, then please let us now.`;
  const html = `<p>Dear user,
  Here your new password: <b>${newPassword}</b>
  If you did not request any password resets, then please let us now.<p>`
  await sendEmail(to, subject, text, html);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to: string, token: string) => {
  const subject = 'Email Verification';
  // TODO: -- replace this url with the link to the email verification service back-end app
  const verificationEmailUrl = `${config.verificationEmailUrl}:${config.port}/api/auth/verify-email/${token}`;
  const text = `Dear user,
  To verify your email, click on this link: ${verificationEmailUrl}
  If you did not create an account, then ignore this email.`;
  const html = `<p>Dear user,
  To verify your email, click <a href="${verificationEmailUrl}">Here</a> <br>
  If you did not create an account, then ignore this email.`
  await sendEmail(to, subject, text, html);
};

const emailService = {
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
};

export default emailService;
