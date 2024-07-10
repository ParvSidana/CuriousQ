import mongoose ,{Schema, Document} from "mongoose";

// MESSAGE SCHEMA


export interface Message extends Document{
    message : string;
    createdAt : Date
}
            //describes the type of schema(typescript)
const MessageSchema : Schema<Message> = new Schema({
    message: {
        type: String,
        required:true,

    },
    createdAt: {
        type:Date,
        required:true,
        default:Date.now
    }

})

// USER SCHEMA

export interface User extends Document{
    username : string;
    email : string;
    password : string;
    verifyCode : string;
    verifyCodeExpiry : Date;
    isVerified : boolean;
    isAcceptingMessage : boolean;
    messages : Message[];
}
            //describes the type of schema(typescript)
const UserSchema : Schema<User> = new Schema({
    username: {
        type: String,
        required:[true,"Username is required"],
        trim : true,
        unique:true

    },
    email: {
        type:String,
        required:[true,"Email is required"],
        unique:true,
        match : [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please use a valid email address']
    },
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    verifyCode:{
        type:String,
        required:[true,"Verify Code is required"],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"Verify Code Expiry is required"],
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        default : true
    },
    messages: [MessageSchema] //type - array name inside array brackets.


})

// CREATING MODEL USING NEXTJS

// nextjs( EDGE TIME FRAMEWORK) doesnt know whether the app is booting up first time unlike express in which initialisatn takes place at once.Hence reqd models be like --

                //if model already present                          //new model
const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema);

export default UserModel;