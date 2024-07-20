// import mongoose from 'mongoose';

// const featureDealSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true,
//     },
//     startDate: {
//         type: Date,
//         required: true,
//     },
//     endDate: {
//         type: Date,
//         required: true,
//     },
//     status: {
//         type: String,
//         enum: ['active', 'expired', 'inactive'], // Valid statuses
//         default: 'inactive',
//     },
//     activeProducts: {
//         type: Number,
//         default: 0, // Initially, no products are active in the flash deal
//     },
//     productId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Product',
//         required: false, // Initially, no product is associated
//     }
// }, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// const FeatureDeal = mongoose.model('FeatureDeal', featureDealSchema);

// export default FeatureDeal;


// models/FeatureDeal.js

import mongoose from 'mongoose';

const featureDealSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'expired'],
        default: 'inactive',
    },
    productIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    activeProducts: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const FeatureDeal = mongoose.model('FeatureDeal', featureDealSchema);
export default FeatureDeal;
