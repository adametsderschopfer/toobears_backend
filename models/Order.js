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
    shippingName: {
        type: String,
        default: '',
    },
    shippingContry: {
        type: String,
        default: '',
    },
    shippingCity: {
        type: String,
        default: '',
    },
    shippingState: {
        type: String,
        default: '',
    },
    shippingAddress: {
        type: String,
        default: '',
    },
    shippingPortalCode: {
        type: String,
        default: '',
    },
    shippingPhone: {
        type: String,
        default: '',
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

OrderSchema.post('save', async function (order) {
    const foundOrder = await Order.findById(order._id).populate('buyer seller', 'username email');
    if (this._update && this._update.$set.status === 3) {
        notifyBuyerMakeOrder(foundOrder);
        notifySellerMakeOrder(foundOrder);
    }
});

const Order = mongoose.model('Order', OrderSchema)


export default Order;
