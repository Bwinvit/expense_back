import express from "express";
import { TransactionAction } from "./action.js";
import authMiddleware from "../../Middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", TransactionAction.createTransaction);
router.get("/", TransactionAction.getTransactions);
router.get("/:id", TransactionAction.getTransaction);
router.put("/:id", TransactionAction.updateTransaction);
router.delete("/:id", TransactionAction.deleteTransaction);
router.delete("/", TransactionAction.clearTransactionsByUserId);
router.delete("/all", TransactionAction.clearAllTransactions);

export default router;
