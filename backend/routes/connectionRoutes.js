import express from 'express';
const router = express.Router();
import { protectRoute } from '../middlewares/auth.js';
import { sendConnectionRequest, acceptConnectionRequest, rejectConnectionRequest, getConnectionRequests, getUserConnections, removeConnection, getConnectionStatus } from '../controllers/connectionControllers.js';
router.post("/request/:id",protectRoute,sendConnectionRequest);
router.put("/accept/:id",protectRoute,acceptConnectionRequest);
router.put("/reject/:id",protectRoute,rejectConnectionRequest);
router.get("/requests",protectRoute,getConnectionRequests);
router.get("/",protectRoute,getUserConnections);
router.delete("/remove/:id",protectRoute,removeConnection);
router.get("/status/:id",protectRoute,getConnectionStatus);

export default router;