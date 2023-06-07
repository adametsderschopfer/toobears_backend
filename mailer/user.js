import transporter from './index.js';
import { readSource } from './reader.js';

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

export async function notifySubscriberCreateNewCard(user, card) {
  const html = await readSource('./templates/order/buyer-new-work.html');

  const htmlContent = html
    .replaceAll('{URL_seller-Name}', card.author.username)
    .replaceAll('{URL_IMAGE_ORDER}', `${process.env.currentDomain}/api${card.imgUrl?.[0]}`)
    .replaceAll('{URL_Name-of-work}', card.name)
    .replaceAll('{URL_TO_ORDER}', `${process.env.currentDomain}/card/${card._id}`)

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: user.email,
    subject: 'New Card',
    html: htmlContent,
  };
  await transporter.sendMail(mailOptions);
}
