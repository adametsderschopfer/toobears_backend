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
    
    role:{
        type: String,
        default:"User"
    }
},

{ timestamps: true }

)

export default mongoose.model("User", UserSchema)