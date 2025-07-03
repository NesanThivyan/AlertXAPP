// server/utils/sendBookingConfirmationEmail.js
import nodemailer from 'nodemailer';

/**
 * Sends an email to the user confirming their booking.
 * @param {Object} opts
 * @param {string} opts.to         – recipient email
 * @param {string} opts.username   – display name
 * @param {string} opts.bookingId  – booking reference
 * @param {Date}   opts.date       – booking date/time
 */
export default async function sendBookingConfirmationEmail({
  to,
  username,
  bookingId,
  date,
}) {
  // 1. Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // true for 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // 2. Email content
  const mailOptions = {
    from: `"AlertX" <${process.env.SMTP_FROM}>`,
    to,
    subject: 'Your ambulance booking is confirmed 🚑',
    html: `
      <p>Hi ${username},</p>
      <p>Your booking <strong>#${bookingId}</strong> has been confirmed for <strong>${date.toLocaleString()}</strong>.</p>
      <p>We’ll keep you updated on any status changes.</p>
      <p style="margin-top:2rem;">Stay safe,<br/>AlertX Team</p>
    `,
  };

  // 3. Send
  await transporter.sendMail(mailOptions);
}
