import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request : Request) {
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
    

    const userId = user._id;

    // checking user is accepting messages or not
    //getting user accepting status
    const {acceptMessages} = await request.json();

    try {

        const updatedUser  = await UserModel.findByIdAndUpdate({
            _id : userId,
            isVerified : true
            } , 
            {isAcceptingMessage : acceptMessages},

            {new : true} //we get the updated user value using 'new:true'
        )

        if(!updatedUser){
            return Response.json(
                 {
                    success: false ,
                    message: "Failed to update Message acceptance status"
                },
                {
                    status:401
                }
            )
        }
        return Response.json(
                 {
                    success: true ,
                    message: "Message acceptance status updated successfully",updatedUser
                },
                {
                    status:201
                }
            )
        
    } catch (error) {
        return Response.json(
                {
                    success: false ,
                    message: "Error accepting messages"
                },
                {
                    status:501
                }
            )
    }

}

export async function GET(request : Request) {
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
    
        

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId);
    
            if(!foundUser){
                return Response.json(
                     {
                        success: false ,
                        message: "User not found"
                    },
                    {
                        status:404
                    }
                )
            }
    
            return Response.json(
                    {
                        success: true ,
                        isAcceptingMessage : foundUser.isAcceptingMessage
                        
                    },
                    {
                        status:201
                    }
                ) 
    } catch (error) {
        return Response.json(
                {
                    success: false ,
                    message: "Error getting accepting message status"
                },
                {
                    status:501
                }
            )
    }

}
