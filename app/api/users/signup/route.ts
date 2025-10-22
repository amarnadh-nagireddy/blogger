import bcryptjs from "bcryptjs";
import connect from "@/lib/config/db";
import User from "@/lib/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

connect()


export async function POST(request: NextRequest){
    try{
        const reqBody= await request.json()
        const {username,email,password}=reqBody
        console.log(reqBody);
        // Check if user exists or not
        const user= await User.findOne({email})
        if (user){
            return NextResponse.json({error: "Email already in use"}, {status:400})
        }
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword=await bcryptjs.hash(password,salt)
        const newUser=new User({
            username,
            email,
            password:hashedPassword
        })
        const savedUser=await newUser.save()
        console.log(savedUser);

        
        
        return NextResponse.json({
            message:"User Created successfully",
            success:true,
            savedUser
        })


    }catch(error: unknown){
        if (error instanceof Error) {
                return NextResponse.json({error: error.message}, {status:500})
        }
        return NextResponse.json({error: "Error at signup"}, {status:500})
    }
}