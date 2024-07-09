import express from "express";
import authMiddleware from "../../Middleware/authMiddleware.js";
import { billAction } from "./action.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/create", billAction.createBill);
router.get("/getBills", billAction.getBills);
router.put("/update/:billId", billAction.updateBill);
router.delete("/delete/:billId", billAction.deleteBill);
router.put("/markAsPaid/:billId", billAction.markBillAsPaid);

//Admin Action
router.delete("/clear", billAction.clearTransactionsByUserId);

export default router;
