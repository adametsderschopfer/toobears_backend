import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_USER_PASS
  }
});

// verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
       console.log(error);
  } else {
       console.log(`mail server has been started on HOST ${process.env.SMTP_HOST}`);
  }
});

export default transporter;
