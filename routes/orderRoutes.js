import express from 'express';
import {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    getOrdersForVendor,
    getAllOrdersForVendor,
    getOrdersByStatus,
 
    getOrdersByCustomer,
    getOrderByIdForCustomer,
    checkOrderStatus,
  
} from "../controllers/orderControllers.js";



const router = express.Router();

// Order routes
router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);

// Vendor-specific routes
router.get('/vendor/:vendorId', getOrdersForVendor); // For all products of a specific vendor
router.get('/vendor/:vendorId/all', getAllOrdersForVendor); // For all orders of a specific vendor
// Status-based routes
router.get('/status/:status', getOrdersByStatus);

// Customer-specific routes
router.get('/customer/:customerId', getOrdersByCustomer);
router.get('/customer/:customerId/order/:orderId', getOrderByIdForCustomer);
router.get('/customer/:customerId/order/:orderId/status', checkOrderStatus);

export default router;
