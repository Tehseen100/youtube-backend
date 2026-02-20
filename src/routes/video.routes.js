import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import isAuthenticated from "../middlewares/isAuthenticated.middleware.js";
import {
    deleteVideo,
    getMyVideos,
    getVideoById,
    togglePublishStatus,
    updateVideo,
    uploadVideo
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);
router.use(isAuthenticated);

// Protected routes
router.get("/", getMyVideos);
router.get("/:videoId", getVideoById);
router.post("/upload",
    upload.fields([
        {
            name: "thumbnail",
            maxCount: 1
        },
        {
            name: "video",
            maxCount: 1
        }
    ]),
    uploadVideo
);
router.patch("/:videoId/update-video", upload.single("thumbnail"), updateVideo);
router.patch("/:videoId/toggle-publish", togglePublishStatus);
router.delete("/:videoId/delete", deleteVideo);

export default router;
