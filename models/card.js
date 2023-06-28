import mongoose from "mongoose";
import UserModel from "./User.js";
import SubscriberModel from "../models/Subscriber.js"
import { notifySubscriberCreateNewCard } from "../mailer/user.js";


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

CardSchema.post('save', async (card) => {
    const currentCard = await Card.findById(card._id).populate('author', 'imgUrl username surname shopname').populate('name imgUrl');
    if (!currentCard) return;
    const listeners = await SubscriberModel.find({ speaker: currentCard.author })
    listeners.forEach(async (subscriber) => {
        const user = await UserModel.findById(subscriber.listener).populate('email username');
        await notifySubscriberCreateNewCard(user, currentCard);
    })
});

const Card = mongoose.model('Card', CardSchema)
export default Card;
