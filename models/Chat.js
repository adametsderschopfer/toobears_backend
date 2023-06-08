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
    if (this._update?.$set?.text) {
        const currentChat = await this.model.findOne().populate('users lastMessage');
        currentChat.users.forEach(user => {
            notifyNewMessage(user, currentChat.lastMessage);
        })
    }
})

const Chat =  mongoose.model('Chat', ChatSchema)

export default Chat;
