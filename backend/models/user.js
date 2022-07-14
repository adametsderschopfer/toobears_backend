import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

    username:{
        type: String,
        required: true,
    },

    surname:{
        type: String,
        required: true,
    },

    email:{
        type: String,
        required: true,
        unique: true
    },

    password:{
        type: String,
        required: true,
    },

    isAdmin:{
        type: Boolean,
        default: false,
    },

    isSeller:{
        type: Boolean,
        default: false
    }
},

{ timestamps: true }

)

export default mongoose.model("USer", UserSchema)