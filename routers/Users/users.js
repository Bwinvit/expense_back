import express from "express";
import { UserAction } from "./action.js";

const router = express.Router();

router.post("/", UserAction.createUser);

export default router;
