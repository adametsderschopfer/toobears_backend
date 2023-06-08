import mongoose from "mongoose";
import MessageModel from './Message.js';
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
        console.log('currentChat from updateOne middleware', currentChat);
        currentChat.users.forEach(user => {
            notifyNewMessage(user, currentChat.lastMessage);
        })
    }
})

ChatSchema.post('save', async function(doc, next) {
    const currentChat = await Chat.findById(doc._id).populate('users lastMessage');
    console.log('currentChat from save middleware', currentChat);
    currentChat.users.forEach(user => {
        notifyNewMessage(user, currentChat.lastMessage);
    })
})

const Chat =  mongoose.model('Chat', ChatSchema)

export default Chat;
