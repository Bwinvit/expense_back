import express from "express";
import { AuthAction } from "./action.js";

const router = express.Router();

router.post("/", AuthAction.loginUser);
router.get("/profile", AuthAction.getProfile);

export default router;