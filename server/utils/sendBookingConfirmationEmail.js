import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASS,
  },
});

transporter.verify()
  .then(() => console.log('📧  Gmail SMTP ready'))
  .catch((e) => console.error('❌  Gmail SMTP error:', e));

export default async function sendConfirmationMail(to, booking) {
  const name = booking?.user?.name ? ` ${booking.user.name}` : '';

  await transporter.sendMail({
    from: `"AlertX" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your Booking is Confirmed!',
    html: `
      <h3>Hello${name},</h3>
      <p>Your booking has been <strong>confirmed</strong>.</p>
      <p><b>Booking ID:</b> ${booking._id}</p>
      <p><b>Status:</b> ${booking.status}</p>
    `,
  });

  console.log('📧  Confirmation mail sent →', to);
}
