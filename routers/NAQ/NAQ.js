import express from "express";
import { NAQAction } from "./action.js";

const router = express.Router();

router.get("/quote", NAQAction.getQuotes);
router.post("/quote", NAQAction.createQuote);
router.put("/quote", NAQAction.updateQuote);
router.delete("/quote", NAQAction.deleteQuote);

export default router;
