import express from "express";

import checkObjectId from "../middleware/checkObjectId.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import {
	createSubSubCategory,
	deleteSubSubCategory,
	getSubSubCategories,
	getSubSubCategory,
	updateSubSubCategory,
} from "../controllers/subSubCategoryController.js";

const router = express.Router();

router
	.route("/")
	.get(getSubSubCategories)
	.post(protect, restrictTo("admin"), createSubSubCategory);

router
	.route("/:id")
	.get(checkObjectId, getSubSubCategory)
	.put(protect, restrictTo("admin"), checkObjectId, updateSubSubCategory)
	.delete(protect, restrictTo("admin"), checkObjectId, deleteSubSubCategory);

export default router;
