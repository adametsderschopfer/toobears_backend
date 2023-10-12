import transporter from './index.js';
import { readSource } from './reader.js';

export async function notifyBuyerMakeOrder(order) {
  const html = await readSource('./templates/order/buyer-notification.html');

  const htmlContent = html
  .replaceAll('{URL_NAME_ORDER}', order._id)
  .replaceAll('{URL_NAME_SELLER}', order.seller.username)
  .replaceAll('{URL_NAME_SHOP}', order.seller.shopname ? `(${order.seller.shopname})` : '')
  .replaceAll('{URL_IMAGE_ORDER}', `${process.env.currentDomain}/api${order.card.imgUrl?.[0]}`)
  .replaceAll('{URL_TO_ORDER}', `${process.env.currentDomain}/orderInfo/${order._id}`);
  console.log('order.buyer.email', order.buyer.email);
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: order.buyer.email,
    subject: 'New Order',
    html: htmlContent,
  };
  const info = await transporter.sendMail(mailOptions);
  console.log('info', info);
}

export async function notifySellerMakeOrder(order) {
  const html = await readSource('./templates/order/seller-notification.html');
  
  const htmlContent = html
    .replaceAll('{URL_IMAGE_ORDER}', `${process.env.currentDomain}/api${order.card?.imgUrl?.[0]}`)
    .replaceAll('{URL_TO_ORDER}', `${process.env.currentDomain}/orderInfo/${order._id}`)
    .replaceAll('{URL_NAME_BUYER}', order.buyer.username + ' ' + order.buyer.surname)
    .replaceAll('{URL_FROM}', order.shippingCountry + ' ' + order.shippingState + ' ' + order.shippingCity + ' ' + order.shippingAddress)
    .replaceAll('{URL_NAME}', order.card.name);
  console.log('order.seller.email', order.seller.email);
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: order.seller.email,
    subject: 'New Order',
    html: htmlContent
  };
  const info = await transporter.sendMail(mailOptions);
  console.log('info', info);
}


