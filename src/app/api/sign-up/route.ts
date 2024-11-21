import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";



                //(POST, GET, PATCH) needs to be like this only -- 
export async function POST(request : Request) {
    await dbConnect();
    try {

        const {username,email,password} = await request.json();

        // ALGORITHM FOR SIGNUP --

        const existingUserWithVerifiedUsername = await UserModel.findOne({
            username,
            isVerified:true
        })

        if(existingUserWithVerifiedUsername){
            return Response.json(
                 {
                    success: false ,
                    message: "Username is already taken"
                },
                {
                    status:400
                }
            )
        }

        const existingUserByEmail = await UserModel.findOne({email})

        const verifyCode = Math.floor(100000+Math.random()*900000).toString();

        if(existingUserByEmail){

            if(existingUserByEmail.isVerified){
                return Response.json(
                    {
                        success:false,
                        message: "User already exists with this email"
                    },
                    {status:400}
                )
            }
            else{
                // prevUser didnt verify the email hence saving this current user instead --

                const hashedPassword = await bcrypt.hash(password,10);

                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.username = username;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+3600000)
                await existingUserByEmail.save();

            }
        }
        else{

            // CASE OF NEW USER --

            const hashedPassword = await bcrypt.hash(password,10);

            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours()+1);

            const newUser = new UserModel({
                username ,
                email ,
                password : hashedPassword,
                verifyCode ,
                verifyCodeExpiry : expiryDate,
                isVerified : false,
                isAcceptingMessage : true,
                messages : []

            })

            await newUser.save();

        }

        // send verification email

        // const emailResponse = await sendVerificationEmail(
        //     email,username,verifyCode
        // );

        // if(!emailResponse.success){
        //      return Response.json(
        //         {
        //             success: false,
        //             message: emailResponse.message
        //         },
        //         {
        //             status:500
        //         }
        //     )
        // }
        
        return Response.json(
                {
                    success:true,
                    message: "User registered. Please verify your email"
                },
                {
                    status:200
                }
            )

    } catch (error) {

        console.error("Error registering user",error);
        return Response.json(
            {
                success : false,
                message : "Error registering User"
            },
            {
                status : 500
            }
        )
    }
}