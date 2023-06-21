import mongoose from "mongoose";
import User from './User.js';
import { notifyNewMessage } from "../mailer/chat.js";

const ChatSchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    text: {
        type: String,
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Message',
        default: null,
    },
    time: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

ChatSchema.post('save', async function (doc, next) {
    console.log('currentChat from save middleware');
    const currentChat = await Chat.findById(doc._id).populate('users lastMessage');
    if (!currentChat || !currentChat.lastMessage || !currentChat.lastMessage.text) return;
    
    const recipient = currentChat.users[0]._id == currentChat.lastMessage.from ? currentChat.users[1] : currentChat.users[0]
    const senderUser = currentChat.users[0]._id == currentChat.lastMessage.from ? currentChat.users[0] : currentChat.users[1]

    notifyNewMessage(recipient, currentChat.lastMessage, senderUser);
    next();
})

const Chat = mongoose.model('Chat', ChatSchema)

export default Chat;
