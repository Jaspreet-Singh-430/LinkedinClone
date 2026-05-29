import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import { ConnectDB } from "./lib/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";
dotenv.config();

const requiredEnv = ["MONGO_URI", "JWT_SECRET"];
const missingEnv = requiredEnv.filter((name) => !process.env[name]);
if (missingEnv.length) {
    console.error("Missing required environment variables:", missingEnv.join(", "));
    process.exit(1);
}

const app = express();
const __dirname = path.resolve();
if(process.env.NODE_ENV!="production"){
    app.use(cors({
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    }));
}
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/users",userRoutes)
app.use("/api/posts",postRoutes);
app.use("/api/notifications",notificationRoutes);
app.use("/api/connections",connectionRoutes);
const PORT = process.env.PORT || 5000;
if(process.env.NODE_ENV=="production"){
    app.use(express.static(path.join(__dirname,"/frontend/dist")))
    app.use((req, res) => {
        res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"))
    })
}

const startServer = async () => {
    try {
        await ConnectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server due to database connection error.", err);
        process.exit(1);
    }
};

startServer();
