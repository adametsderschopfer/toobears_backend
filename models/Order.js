import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    card:{
        type: mongoose.Schema.ObjectId,
        ref: 'Card',
        required: true,
    },
    buyer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    seller:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status:{
        type: Number,
        default: 0
    },
    deliveryCode:{
        type: String,
        default: ''
    },
}, {
    timestamps: true,
});

export default mongoose.model('Order', OrderSchema)