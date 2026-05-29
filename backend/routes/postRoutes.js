import express from "express";
import { protectRoute } from "../middlewares/auth.js";
import { getFeedPosts,createPost,deletePost, getPostById,createComment,createLike } from "../controllers/postControllers.js";
const router = express.Router();
router.get("/",protectRoute,getFeedPosts);
router.post("/create",protectRoute,createPost);
router.delete("/:postId",protectRoute,deletePost);
router.get("/:id",protectRoute,getPostById)
router.post("/:id/comment",protectRoute,createComment);
router.post("/:id/like",protectRoute,createLike);
export default router;