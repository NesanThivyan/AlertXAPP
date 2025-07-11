import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASS,
  },
});

export default async function sendBookingRejectionEmail({
  to,
  username = "User",
  bookingId,
  date,
}) {
  const mailOptions = {
    from: `"AlertX" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Booking rejected",
    html: `
      <p>Hi <strong>${username}</strong>,</p>
      <p>We’re sorry, but your booking request (ID: ${bookingId}) for <strong>${date?.toLocaleString()}</strong> has been <span style="color:#d33;">rejected</span>.</p>
      <p>Please contact support if you have questions, or submit a new request at any time.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}
