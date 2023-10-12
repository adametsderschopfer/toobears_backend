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
    orderId: {
        type: Number,
        default: 1
    },
    message: {
        type: String,
    },
}, {
    timestamps: true,
});

OrderSchema.pre('save', async function (next) {
    if (!this.isNew) {
        return (next())
    }
    const lastOrder = await Order.findOne({}).sort({ orderId: -1 }).limit(1)
    this.orderId = lastOrder ? lastOrder.orderId + 1 : 1
    next()
})

// Post save hook
OrderSchema.post('save', async function (doc, next) {
    const order = await Order.findById(doc._id)
        .populate('buyer seller', 'username surname email country shopname')
        .populate('card', 'imgUrl name');

    if (order.status === 0) {
        notifySellerMakeOrder(order);
    }
    if (order.status === 1) {
        notifyBuyerMakeOrder(order);
    }

    next();
});

// Pre update hook
OrderSchema.pre('findOneAndUpdate', async function(next) {
    const update = this.getUpdate();
    if (update.$set && update.$set.status !== undefined) {
        const order = await this.model.findOne(this.getFilter())
            .populate('buyer seller', 'username surname email country shopname')
            .populate('card', 'imgUrl');

        if (update.$set.status === 1) {
            notifyBuyerMakeOrder(order);
        }
    }

    next();
});

const Order = mongoose.model('Order', OrderSchema)


export default Order;
