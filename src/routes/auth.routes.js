import { Router } from "express";
import {
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser
} from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import isAuthenticated from "../middlewares/isAuthenticated.middleware.js";

const router = Router();

router.post("/register",
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

// protected routes
router.post("/logout", verifyJWT, isAuthenticated, logoutUser);

export default router;