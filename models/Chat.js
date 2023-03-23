import mongoose from "mongoose";

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

export default mongoose.model('Chat', ChatSchema)