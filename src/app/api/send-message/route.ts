import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request:Request) {
    await dbConnect();

    const {username, message} = await request.json();

    try {
        const user = await UserModel.findOne({username});

        if(!user){
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

        // check is user accepting messages

        if(!user.isAcceptingMessage){
            return Response.json(
                 {
                    success: false ,
                    message: "User is currently not accepting messages"
                },
                {
                    status:401
                }
            )
        }

        const newMessage = {message,createdAt : new Date()};

        user.messages.push(newMessage as Message);

        await user.save();
        return Response.json(
                 {
                    success: true ,
                    message: "Message sent successfully"
                },
                {
                    status:201
                }
            )


    } catch (error) {
        return Response.json(
                 {
                    success: false ,
                    message: "Error while sending message."
                },
                {
                    status:501
                }
            )
    }
}