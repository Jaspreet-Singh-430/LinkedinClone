import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DEFAULT_RETRIES = 5;
const DEFAULT_DELAY_MS = 5000;

async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const ConnectDB = async ({ retries = DEFAULT_RETRIES, delayMs = DEFAULT_DELAY_MS } = {}) => {
    if (!process.env.MONGO_URI) {
        const err = new Error("Missing required environment variable: MONGO_URI");
        console.error(err.message);
        throw err;
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000,
            });
            console.log("Database connected successfully");
            return;
        } catch (err) {
            console.error(`Database connection attempt ${attempt} failed:`, err.message || err);
            if (attempt === retries) {
                console.error("All database connection attempts failed.");
                throw err;
            }
            console.log(`Retrying database connection in ${delayMs}ms...`);
            await delay(delayMs);
        }
    }
};
