import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
export const signup = async (req, res) => {
    try{
        const { name,email, password, username } = req.body;
        // Check if user already exists
        if(!name || !email || !password || !username){
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already taken" });
        }
        if(password.length < 6){
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user
        const newUser = new User({ name, email, password: hashedPassword, username });
        await newUser.save();
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
        res.cookie("jwt-linkedin", token, { httpOnly: true,
            maxAge: 3*24 * 60 * 60 * 1000,
            sameSite: "strict", 
            secure: process.env.NODE_ENV === "production" });
        res.status(201).json({ message: "User registered successfully"});
        //send welcome email
        const profileUrl=`${process.env.CLIENT_URL}/profile/${newUser.username}`;
        try {
            await sendWelcomeEmail(newUser.email, newUser.name,profileUrl);
        }
        catch(err){
            console.error("Error sending welcome email:", err);
        }

    }
    catch(err){
        console.error("Error during user registration:", err);
        res.status(500).json({ message: err.message });
    }
};

export const login = async(req, res) => {
    try{
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
        res.cookie("jwt-linkedin", token, { httpOnly: true,
            maxAge: 3*24 * 60 * 60 * 1000,
            sameSite: "strict", 
            secure: process.env.NODE_ENV === "production" });
        res.status(200).json({ message: "Login successful" });
    }
    catch(err){
        console.error("Error during user login:", err);
        res.status(500).json({ message: err.message });
    } 
};

export const logout = (req, res) => {
    res.clearCookie("jwt-linkedin");
    res.status(200).json({ message: "User logged out successfully" });
};
export const getCurrentUser = async(req, res) => {
    try {
    return res.status(200).json({ user: req.user });
    }
    catch(err){
        console.error("Error fetching current user:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}
