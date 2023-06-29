import mongoose from "mongoose";
import { sendRegistration, notifyChangePassword } from '../mailer/user.js';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    shortlink: {
        type: String,
    },
    avatarUrl: {
        type: String,
        default: 'uploads/default/user.png',
    },
    shopname: {
        type: String,
        optional: true,
    },
    code: {
        type: String,
    },
    cards: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Card'
    }],
    liked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card',
    }],
    role: {
        type: String,
        default: 'Seller'
    },
    bannerUrl: {
        type: String,
    },
    status: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: ''
    },
    subscribe: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: this
    }],
    subsCount: {
        type: Number,
        default: 0
    },
    subscribed: [{
        type: mongoose.Schema.ObjectId,
        ref: this
    }],
    fbUrl: {
        type: String
    },
    tgUrl: {
        type: String
    },
    instUrl: {
        type: String
    },
    vkUrl: {
        type: String
    },
    country: {
        type: String,
        default: ''
    },
    deliveryDescription: {
        type: String,
        default: ''
    },
    paymentDescription: {
        type: String,
        default: ''
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
}, {
    timestamps: true,
});


UserSchema.post('save', async (user) => {
    sendRegistration(user);
});

UserSchema.post('updateOne', async function() {
    const filter = this.getFilter();
    const userModel = await this.model.findOne(filter);
    if (this._update.$set.passwordHash) {
        notifyChangePassword(userModel);
    }
});

export default mongoose.model('User', UserSchema)
