import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import isAuthenticated from "../middlewares/isAuthenticated.middleware.js";
import {
    getUserChannelSubscribers,
    getUserSubscribedChannels,
    toggleSubscription
} from "../controllers/subscription.controller.js";

const router = Router();

router.use(verifyJWT);
router.use(isAuthenticated)

// Protected routes
router.post("/c/:channelId", toggleSubscription); // toggle subscribe/unsubscribe
router.get("/u/:userId/subscribers", getUserChannelSubscribers);
router.get("/u/:userId/subscribedTo", getUserSubscribedChannels);

export default router;