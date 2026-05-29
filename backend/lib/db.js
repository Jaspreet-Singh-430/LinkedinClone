import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const ConnectDB = async () => {
    if (!process.env.MONGO_URI) {
        const err = new Error("Missing required environment variable: MONGO_URI");
        console.error(err.message);
        throw err;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully");
    } catch (err) {
        console.error("Database connection error:", err);
        throw err;
    }
};