import express from "express";
import authMiddleware from "../../Middleware/authMiddleware.js";
import { categoryAction } from "./action.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", categoryAction.createCategory);
router.get("/", categoryAction.getCategories);
router.put("/:id", categoryAction.updateCategory);
router.delete("/:id", categoryAction.deleteCategory);

export default router;
