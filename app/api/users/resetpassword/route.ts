import connectDB from "@/lib/config/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/UserModel";
import bcryptjs from "bcryptjs";
connectDB()

export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json()
        const {token,password} = reqBody
        console.log(token);
        const user = await User.findOne({forgotPasswordToken:token, forgotPasswordTokenExpiry:{$gt:Date.now()}});
        if (!user){
         return NextResponse.json({error: "Invalid Token"}, {status:400})

        }
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword=await bcryptjs.hash(password,salt)
        console.log(user);
        user.password=hashedPassword;
        user.forgotPasswordToken=undefined;
        user.forgotPasswordTokenExpiry=undefined;
        await user.save();
        console.log("Password reset sauccessful")
        return NextResponse.json({
            message:"Password Reset Successful",
            success:true
        })

    } catch (error:unknown) {
        if (error instanceof Error) {
                return NextResponse.json({error: error.message}, {status:500})
            }
         return NextResponse.json({error: "error at Reset the password"}, {status:500})
    }
}