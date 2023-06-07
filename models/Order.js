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
    shippingCountry: {
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
    message: {
        type: String,
    },
}, {
    timestamps: true,
});

OrderSchema.post('save', async function (order) {
    const foundOrder = await Order.findById(order._id)
        .populate('buyer seller', 'username email country')
        .populate('card', 'imgUrl');
    if (this._update && this._update.$set.status === 0) {
        notifySellerMakeOrder(foundOrder);
    }
    if (this._update && this._update.$set.status === 1) {
        notifyBuyerMakeOrder(foundOrder);
    }
});

const Order = mongoose.model('Order', OrderSchema)


export default Order;
