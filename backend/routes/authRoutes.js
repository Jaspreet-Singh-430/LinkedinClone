import express from "express";
import { protectRoute } from "../middlewares/auth.js";
import { login, signup, logout, getCurrentUser } from "../controllers/authControllers.js";
const router = express.Router();
router.post("/login",login);
router.post("/register", signup);
router.get("/logout",logout);
router.get("/me",protectRoute, getCurrentUser);
export default router;