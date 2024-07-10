import {NextAuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from  "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions : NextAuthOptions = {

    // specify the providers for sign-in basis --

    providers: [
        // CredentialsProvider allows you to handle signing in with arbitrary credentials, such as a username and password,

        CredentialsProvider({
            id: "credentials",
            name: "Credentials",

            credentials: {
            email: { label: "Email", type: "text" },
            password: { label: "Password", type: "password" }
            },

            async authorize(credentials : any,req) : Promise<any>{
                await dbConnect();
                try {

                    const user = await UserModel.findOne({
                        $or : [
                            {email : credentials.identifier}, //credentials.identifier.email
                            {username : credentials.identifier}
                        ]
                    })

                    if(!user){
                        throw new Error("No user found with this email.")
                    }

                    if(!user.isVerified){
                        throw new Error("User is not verified.Please verify the user first")

                    }

                    // password checking --

                    const isPassword = await bcrypt.compare(credentials.password,user.password);

                    if(isPassword){
                        return  user;
                    }
                    else{
                        throw new Error("Incorrect Password.")
                    }
                    
                } catch (error : any) {
                    throw new Error(error);
                }
            }
        })
    ],
    callbacks: {
        // user is the one we get from providers->CredentialsProvider --

        async session({ session, token }) {
            
            if(token){
                const typedToken = token as { _id ?: string, isVerified?: boolean, isAcceptingMess?: boolean, username?: string };

                session.user._id = typedToken._id
                session.user.isVerified = typedToken.isVerified;
                session.user.isAcceptingMess = typedToken.isAcceptingMess
                session.user.username = typedToken.username;
            }
            return session
        },
        async jwt({ token, user }) {

            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMess = user.isAcceptingMess;
                token.username = user.username;

            }
            return token
        }
    },
    pages:{
        signIn: "/sign-in"
    },
    session: {
        strategy : 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
    
    

}
