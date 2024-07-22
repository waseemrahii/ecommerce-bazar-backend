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
    getPendingOrders,
    getConfirmedOrders,
    getPackagingOrders,
    getOutForDeliveryOrders,
    getDeliveredOrders,
    getFailedToDeliverOrders,
    getReturnedOrders,
    getCanceledOrders,
    getOrdersByCustomer,
    getOrderByIdForCustomer,
    checkOrderStatus,
    getPendingOrdersAdmin,
    getConfirmedOrdersAdmin,
    getPackagingOrdersAdmin,
    getOutForDeliveryOrdersAdmin,
    getDeliveredOrdersAdmin,
    getFailedToDeliverOrdersAdmin,
    getReturnedOrdersAdmin,
    getCanceledOrdersAdmin
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
router.get('/status/pending', getPendingOrders);
router.get('/status/confirmed', getConfirmedOrders);
router.get('/status/packaging', getPackagingOrders);
router.get('/status/out_for_delivery', getOutForDeliveryOrders);
router.get('/status/delivered', getDeliveredOrders);
router.get('/status/failed_to_deliver', getFailedToDeliverOrders);
router.get('/status/returned', getReturnedOrders);
router.get('/status/canceled', getCanceledOrders);



router.get('/admin/status/pending', getPendingOrdersAdmin);
router.get('/admin/status/confirmed', getConfirmedOrdersAdmin);
router.get('/admin/status/packaging', getPackagingOrdersAdmin);
router.get('/admin/status/out_for_delivery', getOutForDeliveryOrdersAdmin);
router.get('/admin/status/delivered', getDeliveredOrdersAdmin);
router.get('/admin/status/failed_to_deliver', getFailedToDeliverOrdersAdmin);
router.get('/admin/status/returned', getReturnedOrdersAdmin);
router.get('/admin/status/canceled', getCanceledOrdersAdmin);

// Customer-specific routes
router.get('/customer/:customerId', getOrdersByCustomer);
router.get('/customer/:customerId/order/:orderId', getOrderByIdForCustomer);
router.get('/customer/:customerId/order/:orderId/status', checkOrderStatus);

export default router;
