import express from "express";
import {
	createVendor,
	deleteVendor,
	getVendor,
	getVendors,
	updateVendor,
} from "./../controllers/vendorController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import {
	VendorLogin,
	vendorLogout,
	VendorSignup,
} from "../controllers/authController.js";
import Vendor from "../models/vendorModel.js";

const router = express.Router();

router.post("/login", VendorLogin);
router.post("/register", VendorSignup);
router.post("/logout", protect, vendorLogout);

router
	.route("/")
	.post(protect, restrictTo("admin", "vendor"), createVendor)
	.get(protect, restrictTo("admin", "vendor"), getVendors);

router
	.route("/:id")
	.get(protect, getVendor)
	.put(protect, updateVendor)
	.delete(protect, restrictTo("admin", "vendor"), deleteVendor);

export default router;
