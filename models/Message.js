import mongoose from "mongoose";
import ChatModel from './Chat.js';

const MessageSchema = new mongoose.Schema({
    chat: {
        type: String,
    },
    from: {
        type: String,
    },
    text:{
        type: String,
    },
    time:{
        type: mongoose.Schema.Types.Mixed,
        default: Date.now,
    },
    attachment:{
        type: String,
    }
}, {
    timestamps: true,
});

MessageSchema.post('save', async function(message) {
    const chat = await ChatModel.findById(message.chat);

    if (chat) {
        chat.lastMessage = message._id;
        await chat.save();
    }
});

export default mongoose.model('Message', MessageSchema)
