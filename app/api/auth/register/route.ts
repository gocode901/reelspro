import { NextRequest,NextResponse } from "next/server";
import User from "@/models/user";
import { connectToDatabase } from "@/lib/db";

export async function POST(req:NextRequest){
    try {
        const {email,password}= await req.json();

        if(!email|| !password){
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const existedUser= await User.findOne({email});

        if(existedUser){
             return NextResponse.json(
                { error: "User already exist" },
                { status: 400 }
            );
        }
         await User.create({
            email,
            password
        });
        
        return NextResponse.json(
                { message: "User registered successfully" },
                { status: 200 }
            ); 
    
    } catch (error) {
        return NextResponse.json(
                { error: "registeration failed" },
                { status: 500 }
            );
    }

}