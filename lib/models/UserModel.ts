import mongoose from "mongoose";


const userSchema =new mongoose.Schema({
    username :{
        type:String,
        required:[true,"Please provide a username"],
        unique:true,
    },
    email:{
        type:String,
        required:[true,"Please provide a email"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Please provide a password"],
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
   
})

const User=mongoose.models.user || mongoose.model("user",userSchema);
export default User;