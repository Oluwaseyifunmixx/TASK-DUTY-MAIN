import express from "express";
import { RegisterUser, LoginUser, LogoutUser, getMe, updateProfile } from "../controllers/authContollers";
import { protect } from "../middleware/authMiddleware";

const router = express.Router()

router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.post("/logout", LogoutUser);
router.get("/me", protect, getMe);
router.put("/update-profile", protect, updateProfile)

export default router;