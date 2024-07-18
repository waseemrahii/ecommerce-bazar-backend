// import express from "express";

// import checkObjectId from "../middleware/checkObjectId.js";
// import { protect, restrictTo } from "../middleware/authMiddleware.js";
// import {
// 	createCategory,
// 	deleteCategory,
// 	getCategories,
// 	getCategory,
// 	updateCategory,
// } from "../controllers/categoryController.js";

// const router = express.Router();

// router
// 	.route("/")
// 	.get(getCategories)
// 	.post(createCategory);
// 	// .post(protect, restrictTo("admin"), createCategory);

// router
// 	.route("/:id")
// 	.get(checkObjectId, getCategory)
// 	.put(protect, restrictTo("admin"), checkObjectId, updateCategory)
// 	.delete(protect, restrictTo("admin"), checkObjectId, deleteCategory);

// export default router;


import express from "express";
import multer from "multer";
import path from "path";
import {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
	getCategoryBySlug
} from "../controllers/categoryController.js";

// Set storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB limit
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
});

// Check file type
const checkFileType = (file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb("Error: Images Only!");
    }
};

const router = express.Router();

router.route("/")
    .post(upload.single("logo"), createCategory)
    .get(getCategories);

router.route("/:id")
    .get(getCategoryById)
    .put(upload.single("logo"), updateCategory)
    .delete(deleteCategory);

router.route("/slug/:slug")
    .get(getCategoryBySlug);

export default router;
