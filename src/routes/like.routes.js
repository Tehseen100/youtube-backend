import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import isAuthenticated from "../middlewares/isAuthenticated.middleware.js";
import {
    getCommentLikes,
    getLikedVideos,
    getVideoLikes,
    toggleCommentLike,
    toggleVideoLike
} from "../controllers/like.controller.js";

const router = Router();

router.use(verifyJWT);
router.use(isAuthenticated);

router.post("/v/:videoId", toggleVideoLike);
router.post("/c/:commentId", toggleCommentLike);
router.get("/v/:videoId", getVideoLikes);
router.get("/c/:commentId", getCommentLikes);
router.get("/liked-videos", getLikedVideos);

export default router;