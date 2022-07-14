import mongoose from "mongoose";

const { Schema }  = mongoose;

const CardSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true
    },

    photo:{
        type: [String],
        required: true
    },

    price:{
        type: Number,
        required: true
    },

    size:{
        type: Number,
        required: true
    },

    category:{
        type: String,
        required: true
    },

    status:{
        type: String,
        required: true
    },

    description:{
        type: String,
        required: true
    },
})

export default mongoose.model("Card", CardSchema)