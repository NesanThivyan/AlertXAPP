import transporter from '../config/mailer.js';

const sendEmail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: `"MedAlert" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
};

export default sendEmail;
