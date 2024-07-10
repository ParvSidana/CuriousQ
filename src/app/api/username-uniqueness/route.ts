import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username : usernameValidation
})

export async function GET(request : Request){
    // console.log(request);
    
    await dbConnect();

    try {
        // The URL() constructor returns a newly created URL object representing the URL defined by the parameters.

        const {searchParams} = new URL(request.url);

        const queryParam = {
            username : searchParams.get('username')
        }

        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        // console.log(result);

        if(!result.success){
            // const usernameErrors = result.error.format().username?._errors || [];
             return Response.json({
                success : false,
                message : "Invalid Query Parameters"
                },
                {
                    status : 400
                }
        )
        }

        const {username} = result.data;


        const existingUser = await UserModel.findOne({
            username,
            isVerified: true
        })

        if(existingUser){
            return Response.json({
            success : false,
            message : "Username is already taken"
            },
            {
                status : 400
            }
        )
        }

         return Response.json({
            success : true,
            message : "Username is available"
            },
            {
                status : 200
            }
        )


    } catch (error) {
        console.error("Error checking username",error);

        return Response.json({
            success : false,
            message : "Error checking username"
            },
            {
                status : 500
            }
        )
    }
}