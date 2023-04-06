import transporter from './index.js';

export async function sendRegistration(user) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: user.email,
    subject: 'Registration Successful',
    text: `Hi ${user.username}, Thank you for registering as a ${user.role} with our website. Your account has been created successfully. You can log in to your account using your email address and the password you provided.
    `,
  };
  await transporter.sendMail(mailOptions);
}

export async function notifyChangePassword(user) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: user.email,
    subject: 'Password has changed',
    text: `Your password has been changed. You can log in to your account using your email address and the password you provided`
  };
  await transporter.sendMail(mailOptions);
}
