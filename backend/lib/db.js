import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const ConnectDB = () => {
    // Database connection logic here
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("Database connected successfully");
    }).catch((err) => {
        console.error("Database connection error:", err);
        process.exit(1); // Exit the process with an error code
    });
};