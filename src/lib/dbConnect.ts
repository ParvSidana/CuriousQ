import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?:number
}

const connection : ConnectionObject = {};

async function dbConnect() : Promise<void> {

    // if db already connected due to next js edge time framework -- 
    if(connection.isConnected){
        console.log("DB already connected");
        return;
    }

// else connect --

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || " ", {});
        // console.log(db);

        connection.isConnected = db.connections[0].readyState;

        console.log("DB connected successfully");

    } catch (error) {
            console.log("DB connection unsuccessful", error);
            process.exit(1);
    }

    
} 

export default dbConnect;