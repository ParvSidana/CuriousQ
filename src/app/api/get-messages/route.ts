import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request:Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    const user : User = session?.user as User;

    if(!session || !session.user ){
        return Response.json(
                 {
                    success: false ,
                    message: "Not Authenticated"
                },
                {
                    status:401
                }
            )
        }
    
     //converting to id in mongoose due to aggregation pipelines structure -- 
    const userId = new mongoose.Types.ObjectId(user._id);

    try {

        //aggregate pipeline returns an array 
        const user = await UserModel.aggregate([
            {$match : {id : userId}},

            // unwind makes an array to convert into many objects each having a message such that various operations can be performed on it.
            {$unwind : '$messages'},
            {$sort : {'messages.createdAt':-1 }},
            {$group : {_id : '$_id' , messages : {$push : '$messages'}}}
        ])

        if(!user || user.length === 0){
            return Response.json(
                 {
                    success: false ,
                    message: "User not found"
                },
                {
                    status:401
                }
            )
        }
        return Response.json(
                 {
                    success: true ,
                    messages: user[0].messages
                },
                {
                    status:201
                }
            )
    } catch (error) {
        return Response.json(
                 {
                    success: false ,
                    message: "Error getting get-messages functionality."
                },
                {
                    status:501
                }
            )
    }
   
}