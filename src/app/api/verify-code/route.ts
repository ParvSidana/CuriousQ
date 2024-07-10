import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username : usernameValidation
})

export async function POST(request:Request) {

    await dbConnect();

    try {
        
        const {username , code} = await request.json()
        
        const result = {
            username : decodeURIComponent(username)
        }

        const safeUsername = UsernameQuerySchema.safeParse(result);

        if(!safeUsername.success){
             return Response.json({
                success : false,
                message : "Invalid Username"
                },
                {
                    status : 400
                }
        )
        }


        const user = await UserModel.findOne({
            username : safeUsername.data.username
        }) 

        if(!user){
            return Response.json({
            success : false,
            message : "No such user exists"
        },{status : 400})
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodeNotExpired){

            user.isVerified = true;
            await user.save();

        
            return Response.json({
                success : true,
                message : "User verified successfully"
                },{status : 200}
            )
        
        }
        else if(!isCodeNotExpired){

            return Response.json({
                success : false,
                message : "Verification Code has expired. Please signup again to get a new code"
            },{status : 400})
        }

        else{
            return Response.json({
                success : false,
                message : "Invalid verification code."
            },{status : 400})
        }
        
        

    } catch (error) {
        console.error("Error verifying user",error)
        return Response.json({
            success : false,
            message : "Error verifying user"
        },{status : 500})
    }
}