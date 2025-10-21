import connect from "@/lib/config/db";
import User from "@/lib/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@//lib/helpers/mailer";
connect()


export async function POST(request: NextRequest){
    try{
        const reqBody= await request.json()
        const {email}=reqBody
        console.log(reqBody);
        // Check if user exists or not
        const user= await User.findOne({email})
        if (!user){
            return NextResponse.json({error: "User not found "}, {status:400})
        }
        
        console.log("Now sending mail");
        //sending  Email

        await sendEmail({email,emailType:"RESET",userId:user._id});
        
        return NextResponse.json({
            message:"Reset mail send",
            success:true,
            
        })


    }catch(error: any){
        return NextResponse.json({error: "Error at RESET"}, {status:500})
    }
}