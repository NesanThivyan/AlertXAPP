// utils/sendConfirmationMail.js
// -----------------------------------------------------------------------------
// Re‑usable Nodemailer helper for booking‑confirmation e‑mails
// -----------------------------------------------------------------------------
// 1️⃣  Requires these environment variables:
//     EMAIL_USER      – the Gmail address to send from
//     EMAIL_APP_PASS  – 16‑char Gmail App Password (2‑Step Verification enabled)
// 2️⃣  Import this function and call `await sendConfirmationMail(to, booking)`
// 3️⃣  The module verifies the SMTP connection once on first import

import nodemailer from 'nodemailer';

// -----------------------------------------------------------------------------
// Create a single shared transporter
// -----------------------------------------------------------------------------
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASS,
  },
});

// Verify SMTP connection at startup — helpful in dev & CI
transporter.verify()
  .then(() => console.log('📧  Gmail SMTP ready'))
  .catch((err) => console.error('❌  Gmail SMTP error:', err));

// -----------------------------------------------------------------------------
// Helper to send a booking‑confirmation e‑mail
// -----------------------------------------------------------------------------
/**
 * Send a confirmation e‑mail when a booking is accepted.
 *
 * @param {string} to       Recipient e‑mail address
 * @param {object} booking  Booking document
 *   – Must include at least `_id` and `status`. If `booking.user.name` exists
 *     it will be used in the greeting.
 */
export default async function sendConfirmationMail(to, booking) {
  const namePart = booking?.user?.name ? ` ${booking.user.name}` : '';

  const mailOptions = {
    from: `"AlertX" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your Booking is Confirmed!',
    html: `
      <h3>Hello${namePart},</h3>
      <p>Your booking has been <strong>confirmed</strong>.</p>
      <p><b>Booking ID:</b> ${booking._id}</p>
      <p><b>Status:</b> ${booking.status}</p>
      <p>Thank you for using AlertX!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    alert(`📧  Confirmation mail sent → ${to}`);
  } catch (err) {
    alert('❌  Failed to send confirmation mail:', err);
    throw err; // re‑throw so callers can handle it
  }
}

