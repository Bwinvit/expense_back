import express from "express";
import { UserAction } from "./action.js";

const router = express.Router();

router.post("/", UserAction.createUser);
router.get("/", UserAction.getUserById);
router.put("/", UserAction.updateUser);
router.delete("/", UserAction.deleteUser);

export default router;
