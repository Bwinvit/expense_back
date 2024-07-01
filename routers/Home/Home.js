import express from "express";
import authMiddleware from "../../Middleware/authMiddleware.js";
import { homeAction } from "./homeAction.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/month-sum", homeAction.getMonthlySum);

export default router;
