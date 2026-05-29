import express from "express";
const router = express.Router();
import { getSuggestedConnections, updateUserProfile,getPublicProfile } from "../controllers/userControllers.js";
import { protectRoute } from "../middlewares/auth.js";

router.get("/suggestions", protectRoute, getSuggestedConnections);
router.put("/profile", protectRoute, updateUserProfile);
router.get("/:username", getPublicProfile);

export default router;