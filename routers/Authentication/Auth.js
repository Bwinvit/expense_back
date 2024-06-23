import express from "express";
import { AuthAction } from "./action.js";
import authMiddleware from "../../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/", AuthAction.loginUser);
router.get("/profile", authMiddleware, AuthAction.getProfile);
router.put("/profile", authMiddleware, AuthAction.updateUserProfile);
router.post(
  "/reset-password/",
  authMiddleware,
  AuthAction.postRequestPasswordReset
);
router.post("/reset-password/:token", AuthAction.postResetPassword);

export default router;
