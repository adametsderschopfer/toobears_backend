import mongoose from "mongoose";

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

export default mongoose.model('Message', MessageSchema)
