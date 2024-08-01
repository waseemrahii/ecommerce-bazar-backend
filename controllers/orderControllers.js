<<<<<<< HEAD
/////////////////// redis

import Order from '../models/orderModel.js';
import Product from '../models/ProductModels.js';

import client from '../redisClient.js'; // Import Redis client
import { sendErrorResponse, sendSuccessResponse } from '../utils/responseHandler.js';

import { buildSearchQuery} from '../utils/buildSearchQuery.js'
=======
import Order from '../models/orderModel.js';
import Product from '../models/ProductModels.js';
import Customer from '../models/customerModel.js';
import Vendor from '../models/vendorModel.js';
import User from '../models/userModel.js'; // Import User model if needed
import Category from '../models/categoryModel.js'; // Import Category model
import SubCategory from '../models/subCategoryModel.js'; // Import SubCategory model
import Brand from '../models/brandModel.js'; // Import Brand model


>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
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
<<<<<<< HEAD
                { path: 'colors', select: 'name' }
=======
                { path: 'color', select: 'name' }
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
            ]
        })
        .populate({
            path: 'customer',
            select: 'firstName lastName email phoneNumber image role referCode status permanentAddress officeShippingAddress officeBillingAddress'
        })
        .populate({
            path: 'vendor',
            select: 'firstName lastName phoneNumber email shopName address vendorImage logo banner status'
<<<<<<< HEAD
        });
};


export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        // Check cache first
        const cacheData = await client.get(`order:${id}`);
        if (cacheData) {
            return res.status(200).json(JSON.parse(cacheData));
        }

        const order = await populateOrderDetails(Order.findById(id));
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Cache the result
        await client.set(`order:${id}`, JSON.stringify(order));
        sendSuccessResponse(res, order, 'Order fetched successfully');

        // res.status(200).json(order);
=======
        })
     
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
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
    } catch (error) {
        handleError(res, error);
    }
};


<<<<<<< HEAD

export const createOrder = async (req, res) => {
    try {
        // Create the order
        const order = await Order.create(req.body);

        // Debugging: Log the newly created order
        console.log(`[DEBUG] Created order: ${JSON.stringify(order)}`);

        // Populate order details
        const populatedOrder = await populateOrderDetails(Order.findById(order._id));

        // Debugging: Log the populated order
        console.log(`[DEBUG] Populated order: ${JSON.stringify(populatedOrder)}`);

        // Cache the newly created order
        const newCacheKey = `order:${order._id}`;
        await client.set(newCacheKey, JSON.stringify(populatedOrder));
        console.log(`[CACHE] Cached new order with key: ${newCacheKey}`);

        // Invalidate all orders cache
        await client.del(`all_orders`);
        console.log(`[CACHE] Invalidated cache for all orders`);

        // Return the newly created and populated order
        // res.status(201).json(populatedOrder);
        sendSuccessResponse(res, populatedOrder, 'Order created successfully');

    } catch (error) {
        console.error(`[ERROR] Error creating order: ${error.message}`);
        sendErrorResponse(res, error);
    }
};




export const getAllOrders = async (req, res) => {
    try {
        const searchParams = req.query;
        const cacheKey = searchParams && Object.keys(searchParams).length ? 
            `all_orders:${JSON.stringify(searchParams)}` : 
            `all_orders`;

        // Check cache first
        const cacheData = await client.get(cacheKey);
        if (cacheData) {
            console.log(`[CACHE] Cache hit for key: ${cacheKey}`);
            return res.status(200).json(JSON.parse(cacheData));
        }

        console.log(`[CACHE] Cache miss for key: ${cacheKey}`);
        const query = buildSearchQuery(searchParams);
        const orders = await populateOrderDetails(Order.find(query));

        // Cache the result
        await client.set(cacheKey, JSON.stringify(orders));
        console.log(`[CACHE] Cached result for key: ${cacheKey}`);

        // res.status(200).json(orders);
        sendSuccessResponse(res, orders, 'Order fetched successfully');

    } catch (error) {
        console.error(`[ERROR] Error retrieving orders: ${error.message}`);
        sendErrorResponse(res, error);
    }
};


=======
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
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;
        const order = await Order.findByIdAndUpdate(id, { orderStatus }, { new: true, runValidators: true });
        const populatedOrder = await populateOrderDetails(Order.findById(order._id));
<<<<<<< HEAD

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update cache
        await client.set(`order:${id}`, JSON.stringify(populatedOrder));

        // res.status(200).json(populatedOrder);
        sendSuccessResponse(res, populatedOrder, 'Order Status Updated successfully');

=======
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(populatedOrder);
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
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
<<<<<<< HEAD

        // Remove from cache
        await client.del(`order:${id}`);
        await client.del('all_orders'); // Invalidate all orders cache

        // res.status(204).json();
        sendSuccessResponse(res, 'Order Deleted  successfully');

=======
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
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
    } catch (error) {
        handleError(res, error);
    }
};

// Get all orders for a specific vendor
export const getAllOrdersForVendor = async (req, res) => {
    try {
        const vendorId = req.params.vendorId;
<<<<<<< HEAD
        const cacheKey = `vendor_orders:${vendorId}`;
        
        // Check cache first
        const cacheData = await client.get(cacheKey);
        if (cacheData) {
            return res.status(200).json(JSON.parse(cacheData));
        }

        const products = await Product.find({ userId: vendorId }).select('_id');
        const productIds = products.map(product => product._id);
        const orders = await populateOrderDetails(Order.find({ products: { $in: productIds } }));

        // Cache the result
        await client.set(cacheKey, JSON.stringify(orders));

=======
        const products = await Product.find({ userId: vendorId }).select('_id');
        const productIds = products.map(product => product._id);
        const orders = await populateOrderDetails(Order.find({ products: { $in: productIds } }));
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
        res.status(200).json(orders);
    } catch (error) {
        handleError(res, error);
    }
};

// Get orders by status
export const getOrdersByStatus = async (req, res) => {
    try {
        const status = req.params.status;
<<<<<<< HEAD
        const cacheKey = `orders_status:${status}`;
        
        // Check cache first
        const cacheData = await client.get(cacheKey);
        if (cacheData) {
            return res.status(200).json(JSON.parse(cacheData));
        }

        const orders = await populateOrderDetails(Order.find({ orderStatus: status }));

        // Cache the result
        await client.set(cacheKey, JSON.stringify(orders));

=======
        const orders = await populateOrderDetails(Order.find({ orderStatus: status }));
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
        res.status(200).json(orders);
    } catch (error) {
        handleError(res, error);
    }
};

<<<<<<< HEAD
// Get orders by customer
export const getOrdersByCustomer = async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const cacheKey = `customer_orders:${customerId}`;
        
        // Check cache first
        const cacheData = await client.get(cacheKey);
        if (cacheData) {
            return res.status(200).json(JSON.parse(cacheData));
        }

        const orders = await populateOrderDetails(Order.find({ customer: customerId }));

        // Cache the result
        await client.set(cacheKey, JSON.stringify(orders));

=======



export const getOrdersByCustomer = async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const orders = await populateOrderDetails(Order.find({ customer: customerId }));
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
        res.status(200).json(orders);
    } catch (error) {
        handleError(res, error);
    }
};

// Get order by ID for customer
export const getOrderByIdForCustomer = async (req, res) => {
    try {
        const { customerId, orderId } = req.params;
<<<<<<< HEAD
        const cacheKey = `customer_order:${customerId}:${orderId}`;
        
        // Check cache first
        const cacheData = await client.get(cacheKey);
        if (cacheData) {
            return res.status(200).json(JSON.parse(cacheData));
        }

=======
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
        const order = await populateOrderDetails(Order.findOne({ _id: orderId, customer: customerId }));
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
<<<<<<< HEAD

        // Cache the result
        await client.set(cacheKey, JSON.stringify(order));

=======
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
        res.status(200).json(order);
    } catch (error) {
        handleError(res, error);
    }
};

// Check order status for customer
export const checkOrderStatus = async (req, res) => {
    try {
        const { customerId, orderId } = req.params;
<<<<<<< HEAD
        const cacheKey = `order_status:${customerId}:${orderId}`;
        
        // Check cache first
        const cacheData = await client.get(cacheKey);
        if (cacheData) {
            return res.status(200).json(JSON.parse(cacheData));
        }

=======
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
        const order = await Order.findOne({ _id: orderId, customer: customerId }).select('orderStatus');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
<<<<<<< HEAD

        // Cache the result
        await client.set(cacheKey, JSON.stringify(order));

        res.status(200).json(order);
        res.status(200).json({
            success: true,

            docs: order,
        });
=======
        res.status(200).json({ orderStatus: order.orderStatus });
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
    } catch (error) {
        handleError(res, error);
    }
};

<<<<<<< HEAD
=======
// Get orders for a specific vendor by status
export const getOrdersForVendorByStatus = async (req, res) => {
    try {
        const { vendorId, status } = req.params;
    if (!vendorId ||!status) {
            return res.status(400).json({ message: 'Vendor ID and status are required' });
        }     
        const products = await Product.find({ userId: vendorId }).select('_id');
        const productIds = products.map(product => product._id);
        const orders = await populateOrderDetails(Order.find({ products: { $in: productIds }, orderStatus: status }));
        
        if (!orders.length) {
            return res.status(404).json({ message: 'No orders found with the specified status for this vendor' });
        }

        res.status(200).json(orders);
    } catch (error) {
        handleError(res, error);
    }
};



export const getOrdersWithFilters = async (req, res) => {
    try {
        const { startDate, endDate, dataType, searchQuery, category, subCategory, brand, status, vendorId, customerId } = req.query;
        const query = {};

        if (startDate && endDate) {
            query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if (status) {
            query.orderStatus = status;
        }
        if (vendorId && mongoose.Types.ObjectId.isValid(vendorId)) {
            query.vendor = vendorId;
        }
        if (customerId && mongoose.Types.ObjectId.isValid(customerId)) {
            query.customer = customerId;
        }
        if (category) {
            const categoryDoc = await Category.findOne({ name: { $regex: category, $options: 'i' } });
            if (categoryDoc) {
                query['products.category'] = categoryDoc._id;
            } else {
                return res.status(404).json({ message: 'Category not found' });
            }
        }
        if (subCategory) {
            const subCategoryDoc = await SubCategory.findOne({ name: { $regex: subCategory, $options: 'i' } });
            if (subCategoryDoc) {
                query['products.subCategory'] = subCategoryDoc._id;
            } else {
                return res.status(404).json({ message: 'SubCategory not found' });
            }
        }
        if (brand) {
            const brandDoc = await Brand.findOne({ name: { $regex: brand, $options: 'i' } });
            if (brandDoc) {
                query['products.brand'] = brandDoc._id;
            } else {
                return res.status(404).json({ message: 'Brand not found' });
            }
        }
        if (dataType && searchQuery) {
            const searchFields = {
                product: 'products.name',
                customer: 'customer.firstName', // Adjust field based on your schema
                vendor: 'vendor.shopName', // Adjust field based on your schema
                order: '_id'
            };
            query[searchFields[dataType]] = { $regex: searchQuery, $options: 'i' };
        }

        const orders = await populateOrderDetails(Order.find(query));
        res.status(200).json(orders);
    } catch (error) {
        handleError(res, error);
    }
};
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
