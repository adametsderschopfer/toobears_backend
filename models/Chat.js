import mongoose from "mongoose";
import User from './User.js';
import { notifyNewMessage } from "../mailer/chat.js";

const ChatSchema = new mongoose.Schema({
    users:[{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    text:{
        type: String,
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Message',
    },
    time:{
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

ChatSchema.post('updateOne', async function() {
    console.log('this._update', this._update);
    if (this._update?.$set?.text) {
        const currentChat = await this.model.findOne(this._conditions).populate('users lastMessage');
        if (!currentChat) return;
        console.log('currentChat from updateOne middleware', currentChat);
        const senderUser = await User.findById(currentChat.lastMessage.from);
        currentChat.users.forEach(user => {
            notifyNewMessage(user, currentChat.lastMessage, senderUser);
        })
    }
})

ChatSchema.post('findOneAndUpdate', async function() {
    console.log('this._update', this._update);
    if (this._update?.$set?.text) {
        const currentChat = await this.model.findOne(this._conditions).populate('users lastMessage');
        if (!currentChat) return;
        console.log('currentChat from updateOne middleware', currentChat);
        const senderUser = await User.findById(currentChat.lastMessage.from);
        currentChat.users.forEach(user => {
            notifyNewMessage(user, currentChat.lastMessage, senderUser);
        })
    }
})

ChatSchema.post('save', async function(doc, next) {
    const currentChat = await Chat.findById(doc._id).populate('users lastMessage');
    console.log('currentChat from save middleware', currentChat);
    const senderUser = await User.findById(currentChat.lastMessage.from);
    currentChat.users.forEach(user => {
        notifyNewMessage(user, currentChat.lastMessage, senderUser);
    })
    next();
})

const Chat =  mongoose.model('Chat', ChatSchema)

export default Chat;
