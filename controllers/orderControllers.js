import Order from '../models/orderModel.js';
import Product from '../models/ProductModels.js';
import Customer from '../models/customerModel.js';
import Vendor from '../models/vendorModel.js';
import User from '../models/userModel.js'; // Import User model if needed
import Category from '../models/categoryModel.js'; // Import Category model
import SubCategory from '../models/subCategoryModel.js'; // Import SubCategory model
import Brand from '../models/brandModel.js'; // Import Brand model


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
