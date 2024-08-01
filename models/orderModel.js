
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
<<<<<<< HEAD
    vendor: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    }],
=======
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
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
            country: String
        },
        required: true
    },
    billingAddress: {
        type: {
            address: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        },
        required: true
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

// Check if the model is already registered
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
