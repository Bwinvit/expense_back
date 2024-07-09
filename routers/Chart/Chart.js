import express from "express";
import authMiddleware from "../../Middleware/authMiddleware.js";
import { chartAction } from "./action.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/expense-breakdown", chartAction.getExpenseBreakDown);

export default router;
