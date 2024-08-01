import express from 'express';
import {
    createCoupon,
    getAllCoupons,
    getCouponById,
    updateCoupon,
    updateCouponStatus,
    deleteCoupon
} from '../controllers/couponController.js'; // Adjust the import path based on your directory structure

const router = express.Router();

// Route to create a new coupon
router.post('/', createCoupon);

// Route to get all coupons with optional search
router.get('/', getAllCoupons);

// Route to get a single coupon by ID
router.get('/:id', getCouponById);

// Route to update a coupon by ID
router.put('/:id', updateCoupon);

// Route to update coupon status by ID
router.patch('/:id/status', updateCouponStatus);

// Route to delete a coupon by ID
router.delete('/:id', deleteCoupon);

export default router;
