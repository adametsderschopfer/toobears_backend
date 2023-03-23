import mongoose from "mongoose";

const FeedEventSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    event: {
        type: String,
    },
    entity: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    type: {
        type: String,
    },
}, {
    timestamps: true,
});

export default mongoose.model('FeedEvent', FeedEventSchema)