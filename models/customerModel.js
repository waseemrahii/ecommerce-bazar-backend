import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }],
    orderStatus: {
        type: String,
        enum: [
            'pending',
            'confirmed',
            'packaging',
            'out_for_delivery',
            'delivered',
            'failed_to_deliver',
            'returned',
            'canceled'
        ],
        default: 'pending'
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'],
        required: true
    },
    shippingAddress: {
        type: {
            address: String,
            city: String,
            state: String,
            zipCode: String,
            country: String,
            phone: String
        }
    },
    billingAddress: {
        type: {
            address: String,
            city: String,
            state: String,
            zipCode: String,
            country: String,
            phone: String
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware to update `updatedAt` field before saving
orderSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Populate function to include customer and vendor information
orderSchema.pre('findOne', function (next) {
    this.populate({
        path: 'customer',
        select: 'firstName lastName permanentAddress officeShippingAddress officeBillingAddress'
    }).populate({
        path: 'vendor',
        select: 'firstName lastName shopName address'
    }).populate({
        path: 'products',
        select: 'name description price sku'
    });
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
