import nodemailer from 'nodemailer';

// One transporter for the whole app
const transporter = nodemailer.createTransport({
  service: 'gmail',       // or smtp host/port if you prefer
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Optional: verify connection when server boots
transporter.verify(err => {
  if (err) {
    console.error('✖️  Mail server connection failed:', err.message);
  } else {
    console.log('✅ Mail server ready to send messages');
  }
});

export default transporter;
