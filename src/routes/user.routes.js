import { Router } from "express";
import {
    changeAvatar,
    changeCoverImage,
    changePassword,
    getCurrentUser,
    updateAccountDetails
} from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import isAuthenticated from "../middlewares/isAuthenticated.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);
router.use(isAuthenticated);

// Protected routes
router.get("/current-user", getCurrentUser);
router.post("/change-password", changePassword);
router.patch("/update-account", updateAccountDetails);

router.patch("/avatar", upload.single("avatar"), changeAvatar);
router.patch("/cover-image", upload.single("coverImage"), changeCoverImage);

export default router;