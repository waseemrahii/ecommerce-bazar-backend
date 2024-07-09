import express from "express";

import checkObjectId from "../middleware/checkObjectId.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import {
	createCategory,
	deleteCategory,
	getCategories,
	getCategory,
	updateCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router
	.route("/")
	.get(getCategories)
	.post(protect, restrictTo("admin"), createCategory);

router
	.route("/:id")
	.get(checkObjectId, getCategory)
	.put(protect, restrictTo("admin"), checkObjectId, updateCategory)
	.delete(protect, restrictTo("admin"), checkObjectId, deleteCategory);

export default router;
