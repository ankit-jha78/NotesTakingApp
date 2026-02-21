import mongoose from "mongoose";
const MONGODB_URL=process.env.MONGODB_URL;

let isConnected=false;
async function dbConnect() {
    if(isConnected){
        console.log("Mongodb is already connected")
        return;
        }
   
    if (!MONGODB_URL) {
        throw new Error("MONGODB_URL environment variable is not set");
    }

    try {
        
        
        const db= await mongoose.connect(MONGODB_URL);
        isConnected=db.connections[0].readyState===1;
        console.log("Connected to mongodb");
    } catch (error) {
        console.log("Failed to connect to mongodb",error);
        throw error
    }
}
export default dbConnect;