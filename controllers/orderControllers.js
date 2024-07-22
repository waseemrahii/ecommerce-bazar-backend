import Order from '../models/orderModel.js';
import Product from '../models/ProductModels.js';
import Customer from '../models/customerModel.js';
import Vendor from '../models/vendorModel.js';
import User from '../models/userModel.js'; // Import User model if needed

// Error handling middleware
const handleError = (res, error) => {
    res.status(400).json({ message: error.message });
};

// Common populate function
const populateOrderDetails = (query) => {
    return query
        .populate({
            path: 'products',
            select: 'name description price sku category subCategory subSubCategory brand productType digitalProductType unit tags discount discountType discountAmount taxAmount taxIncluded minimumOrderQty quantity stock isFeatured color attributeType size thumbnail images videoLink status',
            populate: [
                { path: 'category', select: 'name' },
                { path: 'subCategory', select: 'name' },
                { path: 'brand', select: 'name' },
                { path: 'color', select: 'name' }
            ]
        })
        .populate({
            path: 'customer',
            select: 'firstName lastName email phoneNumber image role referCode status permanentAddress officeShippingAddress officeBillingAddress'
        })
        .populate({
            path: 'vendor',
            select: 'firstName lastName phoneNumber email shopName address vendorImage logo banner status'
        })
        .populate({
            path: 'userId', // Assuming `userId` references a User model
            select: 'firstName lastName email role'
        });
};

// Create a new order
export const createOrder = async (req, res) => {
    try {
        const order = await Order.create(req.body);
        const populatedOrder = await populateOrderDetails(Order.findById(order._id));
        res.status(201).json(populatedOrder);
    } catch (error) {
        handleError(res, error);
    }
};

// Get all orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await populateOrderDetails(Order.find());
        res.status(200).json(orders);
    } catch (error) {
        handleError(res, error);
    }
};


// Get order by ID
export const getOrderById = async (req, res) => {
    try {
        const order = await populateOrderDetails(Order.findById(req.params.id));
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        handleError(res, error);
    }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;
        const order = await Order.findByIdAndUpdate(id, { orderStatus }, { new: true, runValidators: true });
        const populatedOrder = await populateOrderDetails(Order.findById(order._id));
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(populatedOrder);
    } catch (error) {
        handleError(res, error);
    }
};

// Delete an order
export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByIdAndDelete(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(204).json();
    } catch (error) {
        handleError(res, error);
    }
};

// Get orders for a specific vendor (all products)
export const getOrdersForVendor = async (req, res) => {
    try {
        const vendorId = req.params.vendorId;
        const products = await Product.find({ userId: vendorId }).select('_id');
        const productIds = products.map(product => product._id);
        const orders = await populateOrderDetails(Order.find({ products: { $in: productIds } }));
        res.status(200).json(orders);
    } catch (error) {
        handleError(res, error);
    }
};

// Get all orders for a specific vendor
export const getAllOrdersForVendor = async (req, res) => {
    try {
        const vendorId = req.params.vendorId;
        const products = await Product.find({ userId: vendorId }).select('_id');
        const productIds = products.map(product => product._id);
        const orders = await populateOrderDetails(Order.find({ products: { $in: productIds } }));
        res.status(200).json(orders);
    } catch (error) {
        handleError(res, error);
    }
};

// Get orders by status
export const getOrdersByStatus = async (req, res) => {
    try {
        const status = req.params.status;
        const orders = await populateOrderDetails(Order.find({ orderStatus: status }));
        res.status(200).json(orders);
    } catch (error) {
        handleError(res, error);
    }
};

// Get pending orders
export const getPendingOrders = async (req, res) => {
    return getOrdersByStatus(req, res, 'pending');
};

// Get confirmed orders
export const getConfirmedOrders = async (req, res) => {
    return getOrdersByStatus(req, res, 'confirmed');
};

// Get packaging orders
export const getPackagingOrders = async (req, res) => {
    return getOrdersByStatus(req, res, 'packaging');
};

// Get out for delivery orders
export const getOutForDeliveryOrders = async (req, res) => {
    return getOrdersByStatus(req, res, 'out_for_delivery');
};

// Get delivered orders
export const getDeliveredOrders = async (req, res) => {
    return getOrdersByStatus(req, res, 'delivered');
};

// Get failed to deliver orders
export const getFailedToDeliverOrders = async (req, res) => {
    return getOrdersByStatus(req, res, 'failed_to_deliver');
};

// Get returned orders
export const getReturnedOrders = async (req, res) => {
    return getOrdersByStatus(req, res, 'returned');
};

// Get canceled orders
export const getCanceledOrders = async (req, res) => {
    return getOrdersByStatus(req, res, 'canceled');
};




// Get pending orders (Admin-specific)
export const getPendingOrdersAdmin = async (req, res) => {
    return getOrdersByStatus(req, res, 'pending');
};

// Get confirmed orders (Admin-specific)
export const getConfirmedOrdersAdmin = async (req, res) => {
    return getOrdersByStatus(req, res, 'confirmed');
};

// Get packaging orders (Admin-specific)
export const getPackagingOrdersAdmin = async (req, res) => {
    return getOrdersByStatus(req, res, 'packaging');
};

// Get out for delivery orders (Admin-specific)
export const getOutForDeliveryOrdersAdmin = async (req, res) => {
    return getOrdersByStatus(req, res, 'out_for_delivery');
};

// Get delivered orders (Admin-specific)
export const getDeliveredOrdersAdmin = async (req, res) => {
    return getOrdersByStatus(req, res, 'delivered');
};

// Get failed to deliver orders (Admin-specific)
export const getFailedToDeliverOrdersAdmin = async (req, res) => {
    return getOrdersByStatus(req, res, 'failed_to_deliver');
};

// Get returned orders (Admin-specific)
export const getReturnedOrdersAdmin = async (req, res) => {
    return getOrdersByStatus(req, res, 'returned');
};

// Get canceled orders (Admin-specific)
export const getCanceledOrdersAdmin = async (req, res) => {
    return getOrdersByStatus(req, res, 'canceled');
};




// Get orders by customer
export const getOrdersByCustomer = async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const orders = await populateOrderDetails(Order.find({ customer: customerId }));
        res.status(200).json(orders);
    } catch (error) {
        handleError(res, error);
    }
};

// Get order by ID for customer
export const getOrderByIdForCustomer = async (req, res) => {
    try {
        const { customerId, orderId } = req.params;
        const order = await populateOrderDetails(Order.findOne({ _id: orderId, customer: customerId }));
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        handleError(res, error);
    }
};

// Check order status for customer
export const checkOrderStatus = async (req, res) => {
    try {
        const { customerId, orderId } = req.params;
        const order = await Order.findOne({ _id: orderId, customer: customerId }).select('orderStatus');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ orderStatus: order.orderStatus });
    } catch (error) {
        handleError(res, error);
    }
};