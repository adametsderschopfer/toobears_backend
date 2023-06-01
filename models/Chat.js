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
    time:{
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

ChatSchema.post('updateOne', async function() {
    if (this._update?.$set?.text) {
        const currentChat = await this.model.findOne().populate('users text');
        const message = await MessageModel.findOne({text: currentChat.text});
        currentChat.users.forEach(user => {
            notifyNewMessage(user, message);
        })
    }
})

const Chat =  mongoose.model('Chat', ChatSchema)

export default Chat;
