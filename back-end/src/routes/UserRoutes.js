import express from "express";
import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
} from "../controllers/UserController.js";
import protect from "../middleware/Auth.js";
import upload from "../middleware/ImageUpload.js";

const router = express.Router();

router.post("/register", upload.single("profilePicture"), registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

export default router;
