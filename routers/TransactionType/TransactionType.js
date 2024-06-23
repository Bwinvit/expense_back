import express from "express";
import authMiddleware from "../../Middleware/authMiddleware.js";
import { TransactionTypeAction } from "./action.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", TransactionTypeAction.createTransactionType);
router.get("/", TransactionTypeAction.getTransactionTypes);
router.put("/:id", TransactionTypeAction.updateTransactionType);
router.delete("/:id", TransactionTypeAction.deleteTransactionType);

export default router;
