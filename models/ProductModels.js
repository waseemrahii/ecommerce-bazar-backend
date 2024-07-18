

// import mongoose from 'mongoose';
// import mongoosePaginate from 'mongoose-paginate-v2';

// const reviewSchema = new mongoose.Schema({
//     reviewerName: { type: String, required: true },
//     reviewerEmail: { type: String, required: true },
//     reviewText: { type: String, required: true },
//     rating: { type: Number, required: true, min: 1, max: 5 },
// }, { timestamps: true });

// const productSchema = new mongoose.Schema({
//     name: { type: String },
//     description: { type: String },
//     category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
//     subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
//     subSubCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubSubCategory' },
//     productType: { type: String, enum: ['physical', 'digital'], default: 'physical' },
//     digitalProductType: { type: String, default: "type" },
//     sku: { type: String },
//     unit: { type: String },
//     tags: [{ type: String }],
//     price: { type: Number, required: true },
//     discount: { type: Number },
//     quantity: { type: Number },
//     stock: { type: Number, default: 0 },
//     salesCount: { type: Number, default: 0 }, // New field for tracking sales
//     averageRating: { type: Number, default: 0 }, // New field for average rating
//     thumbnail: { type: String },
//     images: [{ type: String }],
//     isFeatured: { type: Boolean, default: false },
//     status: { type: String, enum: ['pending', 'active', 'inactive'], default: 'pending' },
//     reviews: [reviewSchema]
// }, { timestamps: true });

//  productSchema.plugin(mongoosePaginate);

// const Product = mongoose.model('Product', productSchema);

// export default Product;



import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const reviewSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    reviewText: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"]
    },
    description: {
        type: String,
        required: [true, "Product description is required"]
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        // required: [true, "Category is required"]
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory'
    },
    subSubCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubSubCategory'
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        // required: [true, "Brand is required"]
    },
    productType: {
        type: String,
        required: [true, "Product type is required"]
    },
    digitalProductType: {
        type: String
    },
    sku: {
        type: String,
        required: [true, "SKU is required"]
    },
    unit: {
        type: String,
        required: [true, "Unit is required"]
    },
    tags: [String],
    price: {
        type: Number,
        required: [true, "Price is required"]
    },
    discount: {
        type: Number
    },
    discountType: {
        type: String,
        enum: ['percent', 'flat']
    },
    discountAmount: {
        type: Number
    },
    taxAmount: {
        type: Number
    },
    taxIncluded: {
        type: Boolean,
        required: [true, "Tax inclusion status is required"]
    },
    minimumOrderQty: {
        type: Number,
        required: [true, "Minimum order quantity is required"]
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"]
    },
    stock: {
        type: Number,
        required: [true, "Stock is required"]
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    color: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Color'
    },
    attributeType: {
        type: String
    },
    size: {
        type: String
    },
    thumbnail: String,
    images: [String],
    videoLink: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    reviews: [reviewSchema]
}, {
    timestamps: true
});
productSchema.plugin(mongoosePaginate);
const Product = mongoose.model('Product', productSchema);
export default Product;
