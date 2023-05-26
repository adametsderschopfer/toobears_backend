import mongoose from "mongoose";


const CardSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    price:{
        type: String,
        required: true,
    },
    cathegory:{
        type: String,
    },
    size:{
        type: Number,
        required: true,
    },
    status: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    imgUrl: {
        type: Array,
    },
    viewsCount:{
        type: Number,
        default: 0
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    hashtags:{
        type: [String],
        default: []
    },
    like:
        [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
    likeCount:{
        type: Number,
        default: 0,
    },
    currency:{
        type: String,
        default: 'USD'
    },
    deliveryDescription: {
        type: String,
    },
    paymentDescription: {
        type: String,
    },
    symbol:{
        type: String,
        default: '$',
    },
    delivery: [{
        destPrice:[{
            type: String,
        }],
        destination:[{
            type: String,
       }],
        destCurrency:[{
            type: String,
        }],
    }],
    status:{
        type: String
    }
}, {
    timestamps: true,
});

export default mongoose.model('Card', CardSchema)
