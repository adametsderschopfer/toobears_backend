import transporter from './index.js';
import { readSource } from './reader.js';

export async function sendSupport(name, email, message) {
  const html = await readSource('./templates/support.html');
  const htmlContent = html
    .replaceAll('{NAME}', name)
    .replaceAll('{EMAIL}', email)
    .replaceAll('{MESSAGE}', message)

  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: process.env.SUPPORT_ADDRESS,
    subject: 'Support request',
    html: htmlContent
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('info', info);
  } catch (e) {
    console.error('mail send error', e)
  }
}
