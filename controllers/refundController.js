
import Refund from '../models/refundModel.js';
import Order from '../models/orderModel.js';
import mongoose from 'mongoose';

const populateOrderDetails = (query) => {
    return query.populate({
        path: 'order',
        populate: [
            { path: 'customer', select: 'firstName lastName email phoneNumber role referCode status' },
            { path: 'vendor', select: 'firstName lastName shopName address phoneNumber email vendorImage logo banner status' },
            { path: 'products', select: 'name description category subCategory subSubCategory brand productType digitalProductType sku unit tags price discount discountType discountAmount taxAmount taxIncluded minimumOrderQty quantity stock isFeatured color attributeType size thumbnail images videoLink status' },
        ],
    });
};

// Create a new refund request
export const createRefund = async (req, res) => {
    try {
        const { order, reason } = req.body;

        // Check if the order exists
        const orderExists = await Order.findById(order);
        if (!orderExists) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const refund = await Refund.create({ order, reason });
        res.status(201).json(refund);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const getAllRefunds = async (req, res) => {
    try {
        const { status, searchQuery } = req.query;
        const query = {};

        if (status) {
            query.status = status;
        }

        if (searchQuery) {
            query['order.customer.firstName'] = { $regex: searchQuery, $options: 'i' };
        }

        const refunds = await populateOrderDetails(Refund.find(query)).sort({ status: 1 }).exec();
        
        // Log the generated query and results for debugging
        console.log('Generated query:', JSON.stringify(query, null, 2));
        console.log('Refunds:', refunds);

        res.status(200).json(refunds);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Get refund by ID
export const getRefundById = async (req, res) => {
    try {
        const refund = await populateOrderDetails(Refund.findById(req.params.id));
        if (!refund) {
            return res.status(404).json({ message: 'Refund not found' });
        }
        res.status(200).json(refund);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};




export const updateRefundStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, statusReason } = req.body;

        const refund = await Refund.findByIdAndUpdate(
            id, 
            { status, statusReason, processedAt: Date.now() }, 
            { new: true, runValidators: true }
        );

        if (!refund) {
            return res.status(404).json({ message: 'Refund not found' });
        }

        res.status(200).json(refund);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a refund request
export const deleteRefund = async (req, res) => {
    try {
        const { id } = req.params;
        const refund = await Refund.findByIdAndDelete(id);
        if (!refund) {
            return res.status(404).json({ message: 'Refund not found' });
        }
        res.status(204).json();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};






export const getRefundsByVendor = async (req, res) => {
    try {
      const { vendorId, status } = req.query;
  
      // Check if vendorId is a valid ObjectId
      if (vendorId && !mongoose.Types.ObjectId.isValid(vendorId)) {
        return res.status(400).json({ message: 'Invalid vendor ID' });
      }
  
      // Convert vendorId to ObjectId
      const vendorObjectId = vendorId ? new mongoose.Types.ObjectId(vendorId) : null;
  
      // Build the query
      let query = Refund.find();
  
      // Populate order details
      query = populateOrderDetails(query);
  
      // Execute the query
      const refunds = await query.exec();
  
      // Filter refunds by the vendor ID and status (if provided)
      const filteredRefunds = refunds.filter(refund => {
        const matchesVendor = vendorObjectId ? refund.order.vendor._id.equals(vendorObjectId) : true;
        const matchesStatus = status ? refund.status.toLowerCase() === status.toLowerCase() : true;
        return matchesVendor && matchesStatus;
      });
  
      // Log the filtered refunds for debugging
      console.log('Filtered Refunds:', filteredRefunds);
  
      // Check if refunds were found
      if (filteredRefunds.length === 0) {
        return res.status(404).json({ message: `No refunds found for the specified criteria.` });
      }
  
      // Send the found refunds in the response
      res.status(200).json(filteredRefunds);
    } catch (error) {
      // Handle errors
      console.error('Error fetching refunds:', error);
      res.status(500).json({ message: error.message });
    }
  };