import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    surname:{
        type: String,
        required: true,
    },
    email:{
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
    code:{
        type: String,
    },
    cards: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Card'
    }],
    liked:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card',
    }],
    role:{
        type: String,
        default: 'Seller'
    },
    bannerUrl:{
        type: String,
    },
    status:{
        type: String,
        default: '',
    },
    description:{
        type: String,
        default: ''
    },
    subscribe:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: this
    }],
    subsCount: {
        type: Number,
        default: 0
    },
    subscribed:[{
        type: mongoose.Schema.ObjectId,
        ref: this
    }],
    fbUrl:{
        type: String
    },
    tgUrl:{
        type: String
    },
    instUrl:{
        type: String
    },
    vkUrl:{
        type: String
    },
    country:{
        type: String,
        default: ''
    },
}, {
    timestamps: true,
});

export default mongoose.model('User', UserSchema)