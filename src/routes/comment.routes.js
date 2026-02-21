import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import isAuthenticated from "../middlewares/isAuthenticated.middleware.js";
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment
} from "../controllers/comment.controller.js";


const router = Router();

router.use(verifyJWT);
router.use(isAuthenticated);

// Protected routes
router.post("/:videoId", addComment);
router.get("/:videoId", getVideoComments);
router.patch("/:commentId/update", updateComment);
router.delete("/:commentId/delete", deleteComment);

export default router;