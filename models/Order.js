import mongoose from "mongoose";
import { notifyBuyerMakeOrder, notifySellerMakeOrder } from "../mailer/order.js";

const OrderSchema = new mongoose.Schema({
    card: {
        type: mongoose.Schema.ObjectId,
        ref: 'Card',
        required: true,
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: Number,
        default: 0
    },
    deliveryCode: {
        type: String,
        default: ''
    },
}, {
    timestamps: true,
});

OrderSchema.post('save', async (order) => {
    const foundOrder = await Order.findById(order._id).populate('buyer seller', 'username email');
    if (this._update.$set.status === 3) {
        notifyBuyerMakeOrder(foundOrder);
        notifySellerMakeOrder(foundOrder);
    }
});

const Order = mongoose.model('Order', OrderSchema)


export default Order;
