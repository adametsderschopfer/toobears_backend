import transporter from './index.js';
import { readSource } from './reader.js';

export async function notifyNewMessage(user, message, senderUser) {
  const html = await readSource('./templates/chat/new-message.html');
  const htmlContent = html
    .replaceAll('{URL_AVATR}', `${process.env.currentDomain}/api/${senderUser.avatarUrl}`)
    .replaceAll('{URL_NAME_FROM}', senderUser.username)
    .replaceAll('{URL_TEXT}', message.text ?? `${process.env.currentDomain}/api${message.attachment}`)
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
