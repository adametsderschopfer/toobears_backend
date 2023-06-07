import transporter from './index.js';
import { readSource } from './reader.js';

export async function notifyNewMessage(user, message) {
  const html = await readSource('./templates/chat/new-message.html');
  const htmlContent = html
    .replaceAll('{URL_AVATR}', `${process.env.currentDomain}${user.avatarUrl}`)
    .replaceAll('{URL_NAME_FROM}', message.from)
    .replaceAll('{URL_TEXT}', message.text)
    .replaceAll('{URL_DATE}', message.createdAt.toLocaleDateString());

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: user.email,
    subject: 'New message in chat',
    html: htmlContent
  };
  const info = await transporter.sendMail(mailOptions);
  console.log('info', info);
}
