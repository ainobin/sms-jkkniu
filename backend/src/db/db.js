import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        console.log(`url: ${process.env.MONGO_URI}/${DB_NAME}`);
        
        const connectionInstanace = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`MongoDB Connected: ${connectionInstanace.connection.host}`);
    
    } catch (error) {
        console.log('Connection Failed: ', error.message);
        process.exit(1);
    }
}

export default connectDB;