import express from 'express';
import {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
<<<<<<< HEAD
    // getOrdersForVendor,
=======
    getOrdersForVendor,
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
    getAllOrdersForVendor,
    getOrdersByStatus,
    getOrdersByCustomer,
    getOrderByIdForCustomer,
    checkOrderStatus,
<<<<<<< HEAD
    // getOrdersForVendorByStatus ,
    // getOrdersWithFilters,

=======
    getOrdersForVendorByStatus ,
    getOrdersWithFilters
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
} from "../controllers/orderControllers.js";



const router = express.Router();

// Order routes
router.post('/', createOrder);
router.get('/', getAllOrders);
<<<<<<< HEAD
// router.get('/filter', getOrdersWithFilters);
=======
router.get('/filter', getOrdersWithFilters);
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);

router.get('/status/:status', getOrdersByStatus);  // Status-based routes
// Vendor-specific routes
<<<<<<< HEAD
// router.get('/vendor/:vendorId', getOrdersForVendor); // For all products of a specific vendor
router.get('/vendor/:vendorId/all', getAllOrdersForVendor); // For all orders of a specific vendor
// router.get('/vendor/:vendorId/status/:status', getOrdersForVendorByStatus); // Add new route
=======
router.get('/vendor/:vendorId', getOrdersForVendor); // For all products of a specific vendor
router.get('/vendor/:vendorId/all', getAllOrdersForVendor); // For all orders of a specific vendor
router.get('/vendor/:vendorId/status/:status', getOrdersForVendorByStatus); // Add new route
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a

// Customer-specific routes
router.get('/customer/:customerId', getOrdersByCustomer);
router.get('/customer/:customerId/order/:orderId', getOrderByIdForCustomer);
router.get('/customer/:customerId/order/:orderId/status', checkOrderStatus);

// Route for filtering and searching
export default router;
