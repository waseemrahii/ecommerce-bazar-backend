// import express from "express";

// import {
// 	getProducts,
// 	getProduct,
// 	createProduct,
// 	updateProduct,
// 	deleteProduct,
// 	createProductReview,
// 	getTopProducts,
// } from "../controllers/productController.js";
// import checkObjectId from "../middleware/checkObjectId.js";
// import { protect, restrictTo } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router
// 	.route("/")
// 	.get(getProducts)
// 	.post(protect, restrictTo("admin"), createProduct);

// router.route("/:id/reviews").post(protect, checkObjectId, createProductReview);

// router.get("/top", getTopProducts);
// router
// 	.route("/:id")
// 	.get(checkObjectId, getProduct)
// 	.put(protect, restrictTo("admin"), checkObjectId, updateProduct)
// 	.delete(protect, restrictTo("admin"), checkObjectId, deleteProduct);

// export default router;





// import express from 'express';
// import {
//     createProduct,
//     getAllProducts,
//     getProductById,
//     updateProductImages,
//     deleteProduct,
//     addReview,
// 	getProductReviews,
// 	getProductsByVendor,
// 	updateProductStatus
// } from '../controllers/productController.js';
// import { uploadThumbnail, uploadImages } from '../config/multer-config.js';

// const router = express.Router();

// // Product routes
// router.post('/create', createProduct); // Handles both thumbnail and images
// router.put('/:id/images', uploadImages, updateProductImages);
// router.get('/', getAllProducts);
// router.get('/:id', getProductById);
// router.delete('/:id', deleteProduct);
// router.post('/:productId/reviews', addReview);
// router.get('/:productId/reviews', getProductReviews);
// router.get('/:venderId/vender', getProductsByVendor);
// // Route for updating product status
// router.put('/:id/status', updateProductStatus);
// export default router;


// internal router

import express from 'express';
import multer from 'multer';
import {
    createProduct,
    getAllProducts,
    getProductById,
    deleteProduct,
    addReview,
    getProductReviews,
    updateProductStatus,
    updateProductFeaturedStatus,
    getFeaturedProducts,
    getLatestProducts,
    getTopRatedProducts,
    // getLimitedStockedProducts
} from '../controllers/productController.js';

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = file.fieldname === 'thumbnail' ? 'uploads/thumbnails/' : 'uploads/images/';
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Product routes
router.post('/', upload.fields([{ name: 'thumbnail' }, { name: 'images', maxCount: 10 }]), createProduct);
router.get('/', getAllProducts);

// Static routes 
router.get('/feature-product', getFeaturedProducts);
router.get('/latest-product', getLatestProducts);
router.get('/top-rated', getTopRatedProducts);
// router.get('/limited-stock', getLimitedStockedProducts);

// Dynamic routes
router.post('/:productId/reviews', addReview);
router.get('/:productId/reviews', getProductReviews);
router.put('/:id/status', updateProductStatus);
router.put('/:id/feature', updateProductFeaturedStatus);
router.get('/:id', getProductById);
router.delete('/:id', deleteProduct);

export default router;
