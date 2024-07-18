// import express from "express";
// import {
// 	createVendor,
// 	deleteVendor,
// 	getVendor,
// 	getVendors,
// 	updateVendor,
// } from "./../controllers/vendorController.js";
// import { protect, restrictTo } from "../middleware/authMiddleware.js";
// import {
// 	VendorLogin,
// 	vendorLogout,
// 	VendorSignup,
// } from "../controllers/authController.js";
// import Vendor from "../models/vendorModel.js";

// const router = express.Router();

// router.post("/login", VendorLogin);
// router.post("/register", VendorSignup);
// router.post("/logout", protect, vendorLogout);

// router
// 	.route("/")
// 	.post(protect, restrictTo("admin", "vendor"), createVendor)
// 	.get(protect, restrictTo("admin", "vendor"), getVendors);

// router
// 	.route("/:id")
// 	.get(protect, getVendor)
// 	.put(protect, updateVendor)
// 	.delete(protect, restrictTo("admin", "vendor"), deleteVendor);

// export default router;




// without authantication
// import express from "express";
// import {
// 	createVendor,
// 	deleteVendor,
// 	getVendor,
// 	getVendors,
// 	updateVendor,
// } from "./../controllers/vendorController.js";
// import { protect, restrictTo } from "../middleware/authMiddleware.js";
// import {
// 	VendorLogin,
// 	vendorLogout,
// 	VendorSignup,
// } from "../controllers/authController.js";
// import Vendor from "../models/vendorModel.js";

// const router = express.Router();

// router.post("/login", VendorLogin);
// router.post("/register", VendorSignup);
// router.post("/logout", protect, vendorLogout);

// router
// 	.route("/")
// 	// .post(protect, restrictTo("admin", "vendor"), createVendor)
// 	// .get(protect, restrictTo("admin", "vendor"), getVendors);
// 	.post(createVendor)
// 	.get(getVendors);

// router
// 	.route("/:id")
// 	.get(getVendor)
// 	.put(updateVendor)
// 	.delete(deleteVendor);

// export default router;




import express from 'express';
import multer from 'multer';

import { createVendor,registerVendor,loginVendor, updateVendorStatus, getAllVendors, getVendorById,deleteVendor } from '../controllers/vendorController.js'; // Adjust the path based on your project structure

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// POST /vendors - Create a new vendor
router.post('/', upload.fields([{ name: 'vendorImage' }, { name: 'logo' }, { name: 'banner' }]), createVendor);

router.post('/signup',  upload.fields([{ name: 'vendorImage' }, { name: 'logo' }, { name: 'banner' }]),registerVendor);

// POST /vendors/login - Vendor login
router.post('/login', loginVendor);

// PUT /vendors/:vendorId/status - Update vendor status
router.put('/:vendorId/status', updateVendorStatus);

// GET /vendors - Get all vendors
router.get('/', getAllVendors);

// GET /vendors/:vendorId - Get vendor by ID
router.get('/:vendorId', getVendorById);

router.delete('/:vendorId', deleteVendor); // Route for deleting a vendor

export default router;
