import connect from "@/lib/config/db";
import User from "@/lib/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

connect()

export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json()
        const {token} = reqBody
        console.log(token);
        const user = await User.findOne({verifyToken:token, verifyTokenExpiry:{$gt:Date.now()}});
        if (!user){
         return NextResponse.json({error: "Invalid Token"}, {status:400})

        }
        console.log(user);
        user.isVerified=true;
        user.verifyToken=undefined;
        user.verifyTokenExpiry=undefined;
        await user.save();
        console.log("verified")
        return NextResponse.json({
            message:"Email Verified",
            success:true
        })

    } catch (error:any) {
         return NextResponse.json({error: "error at verigy email"}, {status:500})
    }
}