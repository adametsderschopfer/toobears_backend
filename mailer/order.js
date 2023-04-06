import transporter from './index.js';

export async function notifyBuyerMakeOrder(order) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: order.buyer.email,
    subject: 'New Order',
    text: `Hi, A new order has been placed with the following details:
    Customer Name: ${order.buyer.username}
    Customer Email: ${order.buyer.email}
    Please log in to the admin panel to view the details of the order.
    `,
  };
  await transporter.sendMail(mailOptions);
}

export async function notifySellerMakeOrder(order) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: order.seller.email,
    subject: 'New Order',
    text: `Hi, A new order has been placed with the following details by ${order.buyer.username}:
    Customer Name: ${order.buyer.username}
    Customer Email: ${order.buyer.email}
    Please log in to the admin panel to view the details of the order.
    `,
  };
  await transporter.sendMail(mailOptions);
}


