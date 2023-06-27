import mongoose from "mongoose";

const SubscriberSchema = new mongoose.Schema({
    listener: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    speaker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    enableEmail: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});


export default mongoose.model('Subscriber', SubscriberSchema)
