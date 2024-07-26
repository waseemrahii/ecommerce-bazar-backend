import express from 'express';
import {
    createRefund,
    getAllRefunds,
    getRefundById,
    updateRefundStatus,
    deleteRefund,
    getRefundsByVendor
} from '../controllers/refundController.js';

const router = express.Router();

// Refund routes
router.get('/', getAllRefunds);
router.post('/', createRefund);
// Define the route
router.get('/vendor', getRefundsByVendor);
router.get('/:id', getRefundById);
router.put('/:id/status', updateRefundStatus);
router.delete('/:id', deleteRefund);

export default router;
