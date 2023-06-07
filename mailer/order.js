import transporter from './index.js';
import { readSource } from './reader.js';

export async function notifyBuyerMakeOrder(order) {
  const html = await readSource('./templates/order/buyer-notification.html');

  const htmlContent = html
  .replaceAll('{URL_NAME_ORDER}', order._id)
  .replaceAll('{URL_NAME_SELLER}', order.seller.username)
  .replaceAll('{URL_NAME_SHOP}', order.seller.shopname)
  .replaceAll('{URL_IMAGE_ORDER}', `${process.env.currentDomain}/api/${order.card.imgUrl?.[0]}`)
  .replaceAll('{URL_TO_ORDER}', `${process.env.currentDomain}/orderInfo/${order._id}`);

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: order.buyer.email,
    subject: 'New Order',
    html: htmlContent,
  };
  await transporter.sendMail(mailOptions);
}

export async function notifySellerMakeOrder(order) {
  const html = await readSource('./templates/order/seller-notification.html');

  const htmlContent = html
    .replaceAll('{URL_IMAGE_ORDER}', `${process.env.currentDomain}/api${order.card?.imgUrl?.[0]}`)
    .replaceAll('{URL_TO_ORDER}', `${process.env.currentDomain}/orderInfo/${order._id}`)
    .replaceAll('{URL_NAME_BUYER}', order.buyer.username)
    .replaceAll('{URL_COUNTRY_BUYER}', order.buyer.country)
    .replaceAll('{URL_NAME}', order._id);

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: order.seller.email,
    subject: 'New Order',
    html: htmlContent
  };
  await transporter.sendMail(mailOptions);
}


