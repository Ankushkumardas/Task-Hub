import express from "express";
import { changepassword, getUserProfile, updateUserProfile } from "../controllers/userprofileController.js";
import { authmiddleware } from "../middlewares/authmiddleware.js";
const router = express.Router();
router.get("/profile",authmiddleware,getUserProfile);
router.put("/profile",authmiddleware,updateUserProfile);
router.put("/profile/changepassword",authmiddleware,changepassword);
export default router;