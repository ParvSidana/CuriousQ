import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel, { User } from "@/model/User";

export async function DELETE(
  req: Request,
  { params }: { params: { messageid: string } }
) {
  await dbConnect();
  const messageId = params.messageid;
  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = user._id;

  try {
    const updatedRes = await UserModel.findByIdAndUpdate(
      userId,
      {
        $pull: { messages: { _id: messageId } },
      },
      {
        new: true,
      }
    );

    if(!updatedRes){
        return Response.json(
      {
        success: false,
        message: "Message not found",
      },
      {
        status: 404,
      }
    );
    }

    return Response.json(
      {
        success: true,
        message: "Message deleted",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error while deleting messages",
      },
      {
        status: 501,
      }
    );
  }
}
