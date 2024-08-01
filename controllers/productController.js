<<<<<<< HEAD
// //////////////////// with redis 

import Product from '../models/ProductModels.js';
import  { client } from '../utils/redisClient.js'; // Import Redis client

import {
    sendErrorResponse,
    sendSuccessResponse
} from '../utils/responseHandler.js';
import {
    validateProductDependencies
} from '../utils/validation.js';
import {
    populateProductDetails,
    formatProductResponse
} from '../utils/productHelper.js';
import {
    buildFilterQuery,
    buildSortOptions
} from '../utils/filterHelper.js';
import { productValidationSchema } from '../validations/productValidation.js'; // Import Joi schema
import Customer from '../models/customerModel.js';

export const createProduct = async (req, res) => {
    try {
        // Validate request body
        const { error } = productValidationSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ message: error.details.map(err => err.message).join(', ') });
        }

        const {
            name, description, category, subCategorySlug, subSubCategorySlug, brand,
            productType, digitalProductType, sku, unit, tags, price, discount,
            discountType, discountAmount, taxAmount, taxIncluded, minimumOrderQty,
            shippingCost, stock, isFeatured, colors, attributes, size, videoLink, 
            userId, userType
        } = req.body;

        const {
            categoryObj,
            subCategoryObj,
            subSubCategoryObj,
            brandObj,
            colorObjs,
            attributeObjs
        } = await validateProductDependencies({
=======
import Category from '../models/categoryModel.js';
import Product from '../models/ProductModels.js';
import SubCategory from '../models/subCategoryModel.js';
import SubSubCategory from '../models/subSubCategoryModel.js';
import Brand from '../models/brandModel.js';
import Color from '../models/colorModel.js';
import Customer from '../models/customerModel.js';
import Vendor from '../models/vendorModel.js';
import Attribute from '../models/attributeModel.js';
// Utility function for sending error responses
const sendErrorResponse = (res, error) => {
    res.status(500).json({ message: error.message });
};

// Validate and convert slugs to ObjectIds
const validateSlug = async (Model, slug) => {
    const obj = slug ? await Model.findOne({ slug }) : null;
    if (slug && !obj) {
        throw new Error(`Invalid ${Model.modelName.toLowerCase()} slug`);
    }
    return obj;
};

// Utility function for populating product details
const populateProductDetails = (query) => {
    return query
        .populate('category', 'name')
        .populate('subCategory', 'name')
        .populate('brand', 'name')
        .populate('colors', 'name')
        .populate('attributes', 'name');
};

// Format the product response data
const formatProductResponse = (product) => {
    return {
        ...product._doc,
        userId: product.vendor ? product.vendor : product.createdBy,
        userType: product.vendor ? 'vendor' : 'admin',
    };
};


// Create product
export const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
            category,
            subCategorySlug,
            subSubCategorySlug,
            brand,
<<<<<<< HEAD
            colors,
            attributes
        });

        const newProduct = new Product({
            name, description, category: categoryObj._id, subCategory: subCategoryObj ? subCategoryObj._id : undefined,
            subSubCategory: subSubCategoryObj ? subSubCategoryObj._id : undefined, brand: brandObj._id, productType,
            digitalProductType, sku, unit, tags, price, discount, discountType, discountAmount, taxAmount, taxIncluded,
            minimumOrderQty, shippingCost, stock, isFeatured: isFeatured || false, colors: colorObjs.map(color => color._id),
            attributes: attributeObjs.map(attribute => attribute._id), size, videoLink, userId, userType,
            thumbnail: req.files['thumbnail'] ? req.files['thumbnail'][0].path : undefined,
            images: req.files['images'] ? req.files['images'].map(file => file.path) : [], status: 'pending'
        });

        await newProduct.save();

        // Invalidate cache
        const cachePattern = 'all_products:*';
        console.log('Product created, invalidating cache...');
        const keys = await client.keys(cachePattern); // Get all keys matching the pattern
        for (const key of keys) {
            await client.del(key);
            console.log('Cache invalidated for', key);
        }

        sendSuccessResponse(res, newProduct, 'Product created successfully');
    } catch (error) {
        console.error('Error creating product:', error);
        sendErrorResponse(res, error);
    }
};


export const getAllProducts = async (req, res) => {
    try {
        const cacheKey = 'all_products:' + JSON.stringify(req.query);
        const cachedProducts = await client.get(cacheKey);

        if (cachedProducts) {
            console.log('Cache hit for', cacheKey);
            return res.status(200).json(JSON.parse(cachedProducts));
        }

        console.log('Cache miss for', cacheKey);
        const { sort, order = 'asc', page = 1, limit = 10 } = req.query;
        const filter = buildFilterQuery(req.query);
        const sortOptions = buildSortOptions(sort, order);
        const skip = (page - 1) * limit;
        const products = await populateProductDetails(Product.find(filter))
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        const totalDocs = await Product.countDocuments(filter);
        const response = {
            products,
            totalDocs,
            limit: parseInt(limit),
            totalPages: Math.ceil(totalDocs / limit),
            page: parseInt(page),
            pagingCounter: skip + 1,
            hasPrevPage: page > 1,
            hasNextPage: page * limit < totalDocs,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page * limit < totalDocs ? page + 1 : null
        };

        console.log('Setting cache for', cacheKey);
        await client.set(cacheKey, JSON.stringify(response), 'EX', 3600); // Cache for 1 hour
        sendSuccessResponse(res, response, 'Products fetched successfully');
=======
            productType,
            digitalProductType,
            sku,
            unit,
            tags,
            price,
            discount,
            discountType,
            discountAmount,
            taxAmount,
            taxIncluded,
            minimumOrderQty,
            shippingCost,
            stock,
            isFeatured,
            colors,
            attributes,
            size,
            videoLink,
            userId,
            userType,
           
        } = req.body;

        const categoryObj = await validateSlug(Category, category);
        const subCategoryObj = await validateSlug(SubCategory, subCategorySlug);
        const subSubCategoryObj = await validateSlug(SubSubCategory, subSubCategorySlug);

        const brandObj = await Brand.findById(brand);
        if (!brandObj) {
            return res.status(400).json({ message: 'Invalid brand ID' });
        }

        const colorObjs = await Color.find({ _id: { $in: colors } });
        if (colors && colorObjs.length !== colors.length) {
            return res.status(400).json({ message: 'One or more color IDs are invalid' });
        }

            // Validate attributes
            const attributeObjs = attributes ? await Attribute.find({ _id: { $in: attributes } }) : [];
            if (attributes && attributeObjs.length !== attributes.length) {
                return res.status(400).json({ message: 'One or more attribute IDs are invalid' });
            }

        const newProduct = new Product({
            name,
            description,
            category: categoryObj._id,
            subCategory: subCategoryObj ? subCategoryObj._id : undefined,
            subSubCategory: subSubCategoryObj ? subSubCategoryObj._id : undefined,
            brand: brandObj._id,
            productType,
            digitalProductType,
            sku,
            unit,
            tags,
            price,
            discount,
            discountType,
            discountAmount,
            taxAmount,
            taxIncluded,
            minimumOrderQty,
            shippingCost,
            stock,
            isFeatured: isFeatured || false,
            colors: colorObjs.map(color => color._id),
            attributes: attributeObjs.map(attribute => attribute._id),       
            size,
            videoLink,
            userId,
            userType,
            thumbnail: req.files['thumbnail'] ? req.files['thumbnail'][0].path : undefined,
            images: req.files['images'] ? req.files['images'].map(file => file.path) : [],
            status: 'pending',
        });
        await newProduct.save();
        res.status(201).json(newProduct);
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
    } catch (error) {
        sendErrorResponse(res, error);
    }
};


// Update product images
export const updateProductImages = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.images = req.files ? req.files.map(file => file.path) : [];
        await product.save();
<<<<<<< HEAD
        // Clear the cache for product details
        await client.del(`product_${productId}`);
=======
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
        res.status(200).json(product);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

<<<<<<< HEAD
=======
// Get all Products
export const getAllProducts = async (req, res) => {
    try {
        const { category, latest, newArrival, sort, order = 'asc', page = 1, limit = 10 } = req.query;

        let query = {};
        if (category) query.category = category;

        if (latest === 'true') {
            const last7Days = new Date();
            last7Days.setDate(last7Days.getDate() - 7);
            query.createdAt = { $gte: last7Days };
        }

        if (newArrival === 'true') {
            const last30Days = new Date();
            last30Days.setDate(last30Days.getDate() - 30);
            query.createdAt = { $gte: last30Days };
        }

        let sortOptions = {};
        if (sort) {
            sortOptions[sort] = order === 'asc' ? 1 : -1;
        } else {
            sortOptions.createdAt = -1;
        }

        const skip = (page - 1) * limit;
        const products = await Product.find(query)
            .populate('category', 'name')
            .populate('subCategory', 'name')
            .populate('brand', 'name')
            .populate('colors', 'name')
            .populate('attributes', 'name')
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        const totalDocs = await Product.countDocuments(query);
        const response = {
            docs: products,
            totalDocs,
            limit: parseInt(limit),
            totalPages: Math.ceil(totalDocs / limit),
            page: parseInt(page),
            pagingCounter: skip + 1,
            hasPrevPage: page > 1,
            hasNextPage: page * limit < totalDocs,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page * limit < totalDocs ? page + 1 : null
        };

        res.status(200).json(response);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};


>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
// Get Product by ID
export const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
<<<<<<< HEAD
        const cacheKey = `product_${productId}`;
        const cachedProduct = await client.get(cacheKey);

        if (cachedProduct) {
            return res.status(200).json(JSON.parse(cachedProduct));
        }

=======
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
        const product = await populateProductDetails(Product.findById(productId));

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
<<<<<<< HEAD

        await client.set(cacheKey, JSON.stringify(product), 'EX', 3600); // Cache for 1 hour
=======
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
        res.status(200).json(product);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

<<<<<<< HEAD

=======
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
// Delete a Product
export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
<<<<<<< HEAD
        // Clear the cache for product list and product details
        await client.del('all_products:*');
        await client.del(`product_${productId}`);
=======
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

// Add a new review to a product
export const addReview = async (req, res) => {
    try {
        const productId = req.params.productId;
        const { customerId, reviewText, rating } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const newReview = {
            customer: customerId,
            reviewText,
            rating
        };

        product.reviews.push(newReview);

        const totalReviews = product.reviews.length;
        const totalRating = product.reviews.reduce((acc, review) => acc + review.rating, 0);
        product.averageRating = totalRating / totalReviews;

        await product.save();
<<<<<<< HEAD
        // Clear the cache for product details
        await client.del(`product_${productId}`);
=======
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
        res.status(201).json({ message: 'Review added successfully', review: newReview });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

<<<<<<< HEAD
 // Get all reviews for a specific product

=======
// Get reviews for a specific product
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
export const getProductReviews = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product.reviews);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

<<<<<<< HEAD
// Update the status of a specific review
export const updateReviewStatus = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { status } = req.body; // Expecting status to be 'Active' or 'Inactive'

        if (!['Active', 'Inactive'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const product = await Product.findOne({ 'reviews._id': reviewId });
        if (!product) {
            return res.status(404).json({ message: 'Product or review not found' });
        }

        const review = product.reviews.id(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        review.status = status;

        await product.save();
        // Clear the cache for product details
        await client.del(`product_${product._id}`);
        res.status(200).json({ message: 'Review status updated successfully', review });
    } catch (error) {
        sendErrorResponse(res, error);
    }
};
=======

>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a

// Update product status
export const updateProductStatus = async (req, res) => {
    try {
<<<<<<< HEAD
        const { id } = req.params;
        const { status } = req.body; // Expecting status to be 'Pending', 'Active', 'Inactive'

        if (!['Pending', 'Active', 'Inactive'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const product = await Product.findById(id);
=======
        const productId = req.params.id;
        const { status } = req.body;

        const product = await Product.findByIdAndUpdate(productId, { status }, { new: true });

>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

<<<<<<< HEAD
        product.status = status;
        await product.save();
        // Clear the cache for product details
        await client.del(`product_${id}`);
        res.status(200).json({ message: 'Product status updated successfully', product });
    }
     catch (error) {
=======
        res.status(200).json(product);
    } catch (error) {
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
        sendErrorResponse(res, error);
    }
};

// Update product featured status
export const updateProductFeaturedStatus = async (req, res) => {
    try {
<<<<<<< HEAD
        const { id } = req.params;
        const { isFeatured } = req.body; // Expecting boolean

        if (typeof isFeatured !== 'boolean') {
            return res.status(400).json({ message: 'Invalid featured status' });
        }

        const product = await Product.findById(id);
=======
        const productId = req.params.id;
        const { isFeatured } = req.body;

        const product = await Product.findByIdAndUpdate(productId, { isFeatured }, { new: true });

>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

<<<<<<< HEAD
        product.isFeatured = isFeatured;
        await product.save();
        // Clear the cache for product details
        await client.del(`product_${id}`);
        res.status(200).json({ message: 'Product featured status updated successfully', product });
=======
        res.status(200).json(product);
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

<<<<<<< HEAD
// // Get all featured products
// export const getFeaturedProducts = async (req, res) => {
//     try {
//         const cacheKey = 'featured_products';
//         const cachedProducts = await client.get(cacheKey);

//         if (cachedProducts) {
//             return res.status(200).json(JSON.parse(cachedProducts));
//         }

//         const products = await populateProductDetails(Product.find({ isFeatured: true }));

//         await client.set(cacheKey, JSON.stringify(products), 'EX', 3600); // Cache for 1 hour
//         res.status(200).json(products);
//     } catch (error) {
//         sendErrorResponse(res, error);
//     }
// };

// Get latest products
export const getLatestProducts = async (req, res) => {
    try {
        const cacheKey = 'latest_products';
        const cachedProducts = await client.get(cacheKey);

        if (cachedProducts) {
            return res.status(200).json(JSON.parse(cachedProducts));
        }

        const products = await populateProductDetails(Product.find().sort({ createdAt: -1 }).limit(10));

        await client.set(cacheKey, JSON.stringify(products), 'EX', 3600); // Cache for 1 hour
=======
// Get featured products
export const getFeaturedProducts = async (req, res) => {
    try {
        const products = await populateProductDetails(Product.find({ isFeatured: true }));

        if (!products.length) {
            return res.status(404).json({ message: 'No featured products found' });
        }
        res.status(200).json(products);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

// // Get latest products
export const getLatestProducts = async (req, res) => {
    try {
        const products = await populateProductDetails(Product.find().sort({ createdAt: -1 }).limit(10));

        if (!products.length) {
            return res.status(404).json({ message: 'No latest products found' });
        }
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
        res.status(200).json(products);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

<<<<<<< HEAD


// Mark a product as sold
export const sellProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.status = 'sold';
        await product.save();
        // Clear the cache for product details
        await client.del(`product_${productId}`);
        res.status(200).json({ message: 'Product marked as sold' });
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

// Get limited stocked products
export const getLimitedStockedProducts = async (req, res) => {
    try {
        const cacheKey = 'limited_stocked_products';
        const cachedProducts = await client.get(cacheKey);

        if (cachedProducts) {
            return res.status(200).json(JSON.parse(cachedProducts));
        }

        const products = await populateProductDetails(Product.find({ stock: { $lt: 5 } }));

        await client.set(cacheKey, JSON.stringify(products), 'EX', 3600); // Cache for 1 hour
        res.status(200).json(products);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

// Get filtered products
export const getFilteredProducts = async (req, res) => {
    try {
        const cacheKey = `filtered_products:${JSON.stringify(req.query)}`;
        const cachedProducts = await client.get(cacheKey);

        if (cachedProducts) {
            return res.status(200).json(JSON.parse(cachedProducts));
        }

        const filter = buildFilterQuery(req.query);
        const products = await populateProductDetails(Product.find(filter));

        await client.set(cacheKey, JSON.stringify(products), 'EX', 3600); // Cache for 1 hour
        res.status(200).json(products);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

// Update Product
export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const updateData = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        Object.assign(product, updateData);
        if (req.files['thumbnail']) {
            product.thumbnail = req.files['thumbnail'][0].path;
        }
        if (req.files['images']) {
            product.images = req.files['images'].map(file => file.path);
        }

        await product.save();
        // Clear the cache for product details
        await client.del(`product_${productId}`);
        // Optional: Invalidate all products cache
        await client.del('all_products:*');
        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

// Delete a Product Image
export const deleteProductImage = async (req, res) => {
    try {
        const productId = req.params.id;
        const imageUrl = req.body.imageUrl; // Expecting image URL to delete

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.images = product.images.filter(image => image !== imageUrl);
        await product.save();
        // Clear the cache for product details
        await client.del(`product_${productId}`);
        res.status(200).json({ message: 'Product image deleted successfully' });
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

// Get all Digital Products
export const getAllDigitalProducts = async (req, res) => {
    try {
        const cacheKey = 'all_digital_products';
        const cachedProducts = await client.get(cacheKey);

        if (cachedProducts) {
            return res.status(200).json(JSON.parse(cachedProducts));
        }

        const products = await populateProductDetails(Product.find({ productType: 'digital' }));

        await client.set(cacheKey, JSON.stringify(products), 'EX', 3600); // Cache for 1 hour
        res.status(200).json(products);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

// Add product metadata
export const addProductMetadata = async (req, res) => {
    try {
        const productId = req.params.id;
        const { metadata } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.metadata = metadata;
        await product.save();
        // Clear the cache for product details
        await client.del(`product_${productId}`);
        res.status(200).json({ message: 'Product metadata added successfully', product });
    } catch (error) {
        sendErrorResponse(res, error);
    }
};


export const getTopRatedProducts = async (req, res) => {
    try {
        // Aggregation pipeline to get top-rated products
        const topRatedProducts = await Product.aggregate([
            // Unwind the reviews array to deconstruct each review document
            { $unwind: "$reviews" },

            // Group by product ID and calculate the average rating
            { 
=======
// Get top rated products

export const getTopRatedProducts = async (req, res) => {
    try {
        const topRatedProducts = await Product.aggregate([
            {
                $unwind: "$reviews",
            },
            {
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    thumbnail: { $first: "$thumbnail" },
                    averageRating: { $avg: "$reviews.rating" },
                    price: { $first: "$price" },
                    stock: { $first: "$stock" },
                    isFeatured: { $first: "$isFeatured" },
<<<<<<< HEAD
                    status: { $first: "$status" }
                }
            },

            // Sort by averageRating in descending order
            { $sort: { averageRating: -1 } },

            // Limit to top 5 products
            { $limit: 5 }
        ]);

        // Debugging output
        console.log('Top Rated Products:', topRatedProducts);

        // Check if products were found and respond accordingly
        if (!topRatedProducts.length) {
            return res.status(404).json({ message: 'No top-rated products found' });
        }

        // Send success response with top-rated products
        res.status(200).json(topRatedProducts);
    } catch (error) {
        console.error('Error fetching top-rated products:', error);
=======
                    status: { $first: "$status" },
                },
            },
            {
                $sort: { averageRating: -1 },
            },
            {
                $limit: 5,
            },
        ]);

        if (!topRatedProducts.length) {
            return res.status(404).json({ message: 'No top rated products found' });
        }

        res.status(200).json(topRatedProducts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching top rated products', error: error.message });
    }
};

// Sell product
export const sellProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { quantitySold } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.stock < quantitySold) {
            return res.status(400).json({ message: 'Not enough stock available' });
        }

        product.stock -= quantitySold;
        await product.save();
        res.status(200).json({ message: 'Product sold successfully', product });
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

// Get limited stocked products
export const getLimitedStockedProducts = async (req, res) => {
    try {
        // Find products with quantity less than 10
        const products = await Product.find({ quantity: { $lt: 10 } })
            .select('name quantity') // Select the required fields (name and quantity)
            .populate('category', 'name')
            .populate('subCategory', 'name')
            .populate('brand', 'name')
            .populate('color', 'name');

        // Calculate total quantity of products with less than 10 in stock
        const totalQuantity = products.reduce((sum, product) => sum + product.quantity, 0);

        // Check if products exist
        if (!products.length) {
            return res.status(404).json({ message: 'No products with limited stock found' });
        }

        // Send response with products and total quantity
        res.status(200).json({ products, totalQuantity });
    } catch (error) {
        // Handle errors
        console.error(error);
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
        sendErrorResponse(res, error);
    }
};



<<<<<<< HEAD
// Get Top Rated Products
// export const getTopRatedProducts = async (req, res) => {
//     try {
//         const cacheKey = 'top_rated_products';
//         const cachedProducts = await client.get(cacheKey);

//         if (cachedProducts) {
//             console.log('Cache hit for', cacheKey);
//             return res.status(200).json(JSON.parse(cachedProducts));
//         }

//         console.log('Cache miss for', cacheKey);
        
//         // Aggregation pipeline to get top-rated products
//         const topRatedProducts = await Product.aggregate([
//             // Unwind the reviews array to deconstruct each review document
//             { $unwind: "$reviews" },
            
//             // Group by product ID and calculate the average rating
//             {
//                 $group: {
//                     _id: "$_id",
//                     name: { $first: "$name" },
//                     thumbnail: { $first: "$thumbnail" },
//                     averageRating: { $avg: "$reviews.rating" },
//                     price: { $first: "$price" },
//                     stock: { $first: "$stock" },
//                     isFeatured: { $first: "$isFeatured" },
//                     status: { $first: "$status" }
//                 }
//             },
            
//             // Sort by averageRating in descending order
//             { $sort: { averageRating: -1 } },
            
//             // Limit the number of products (e.g., top 10)
//             { $limit: 10 }
//         ]);

//         // Cache the results for 1 hour
//         console.log('Setting cache for', cacheKey);
//         await client.set(cacheKey, JSON.stringify(topRatedProducts), 'EX', 3600);

//         res.status(200).json(topRatedProducts);
//     } catch (error) {
//         sendErrorResponse(res, error);
//     }
// };








////////////////// git up


//////// without redis

// import Category from '../models/categoryModel.js';
// import Product from '../models/ProductModels.js';
// import SubCategory from '../models/subCategoryModel.js';
// import SubSubCategory from '../models/subSubCategoryModel.js';
// import Brand from '../models/brandModel.js';
// import Color from '../models/colorModel.js';
// import Customer from '../models/customerModel.js';
// import Vendor from '../models/vendorModel.js';
// import Attribute from '../models/attributeModel.js';
// // Utility function for sending error responses
// const sendErrorResponse = (res, error) => {
//     res.status(500).json({ message: error.message });
// };

// // Validate and convert slugs to ObjectIds
// const validateSlug = async (Model, slug) => {
//     const obj = slug ? await Model.findOne({ slug }) : null;
//     if (slug && !obj) {
//         throw new Error(`Invalid ${Model.modelName.toLowerCase()} slug`);
//     }
//     return obj;
// };

// // Utility function for populating product details
// const populateProductDetails = (query) => {
//     return query
//         .populate('category', 'name')
//         .populate('subCategory', 'name')
//         .populate('brand', 'name')
//         .populate('colors', 'name')
//         .populate('attributes', 'name');
// };

// // Format the product response data
// const formatProductResponse = (product) => {
//     return {
//         ...product._doc,
//         userId: product.vendor ? product.vendor : product.createdBy,
//         userType: product.vendor ? 'vendor' : 'admin',
//     };
// };


// // Create product
// export const createProduct = async (req, res) => {
//     try {
//         const {
//             name,
//             description,
//             category,
//             subCategorySlug,
//             subSubCategorySlug,
//             brand,
//             productType,
//             digitalProductType,
//             sku,
//             unit,
//             tags,
//             price,
//             discount,
//             discountType,
//             discountAmount,
//             taxAmount,
//             taxIncluded,
//             minimumOrderQty,
//             shippingCost,
//             stock,
//             isFeatured,
//             colors,
//             attributes,
//             size,
//             videoLink,
//             userId,
//             userType,
           
//         } = req.body;

//         const categoryObj = await validateSlug(Category, category);
//         const subCategoryObj = await validateSlug(SubCategory, subCategorySlug);
//         const subSubCategoryObj = await validateSlug(SubSubCategory, subSubCategorySlug);

//         const brandObj = await Brand.findById(brand);
//         if (!brandObj) {
//             return res.status(400).json({ message: 'Invalid brand ID' });
//         }

//         const colorObjs = await Color.find({ _id: { $in: colors } });
//         if (colors && colorObjs.length !== colors.length) {
//             return res.status(400).json({ message: 'One or more color IDs are invalid' });
//         }

//             // Validate attributes
//             const attributeObjs = attributes ? await Attribute.find({ _id: { $in: attributes } }) : [];
//             if (attributes && attributeObjs.length !== attributes.length) {
//                 return res.status(400).json({ message: 'One or more attribute IDs are invalid' });
//             }

//         const newProduct = new Product({
//             name,
//             description,
//             category: categoryObj._id,
//             subCategory: subCategoryObj ? subCategoryObj._id : undefined,
//             subSubCategory: subSubCategoryObj ? subSubCategoryObj._id : undefined,
//             brand: brandObj._id,
//             productType,
//             digitalProductType,
//             sku,
//             unit,
//             tags,
//             price,
//             discount,
//             discountType,
//             discountAmount,
//             taxAmount,
//             taxIncluded,
//             minimumOrderQty,
//             shippingCost,
//             stock,
//             isFeatured: isFeatured || false,
//             colors: colorObjs.map(color => color._id),
//             attributes: attributeObjs.map(attribute => attribute._id),       
//             size,
//             videoLink,
//             userId,
//             userType,
//             thumbnail: req.files['thumbnail'] ? req.files['thumbnail'][0].path : undefined,
//             images: req.files['images'] ? req.files['images'].map(file => file.path) : [],
//             status: 'pending',
//         });
//         await newProduct.save();
//         res.status(201).json(newProduct);
//     } catch (error) {
//         sendErrorResponse(res, error);
//     }
// };


// // Update product images
// export const updateProductImages = async (req, res) => {
//     try {
//         const productId = req.params.id;
//         const product = await Product.findById(productId);

//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }

//         product.images = req.files ? req.files.map(file => file.path) : [];
//         await product.save();
//         res.status(200).json(product);
//     } catch (error) {
//         sendErrorResponse(res, error);
//     }
// };

// // Get all Products
// export const getAllProducts = async (req, res) => {
//     try {
//         const { category, latest, newArrival, sort, order = 'asc', page = 1, limit = 10 } = req.query;

//         let query = {};
//         if (category) query.category = category;

//         if (latest === 'true') {
//             const last7Days = new Date();
//             last7Days.setDate(last7Days.getDate() - 7);
//             query.createdAt = { $gte: last7Days };
//         }

//         if (newArrival === 'true') {
//             const last30Days = new Date();
//             last30Days.setDate(last30Days.getDate() - 30);
//             query.createdAt = { $gte: last30Days };
//         }

//         let sortOptions = {};
//         if (sort) {
//             sortOptions[sort] = order === 'asc' ? 1 : -1;
//         } else {
//             sortOptions.createdAt = -1;
//         }

//         const skip = (page - 1) * limit;
//         const products = await Product.find(query)
//             .populate('category', 'name')
//             .populate('subCategory', 'name')
//             .populate('brand', 'name')
//             .populate('colors', 'name')
//             .populate('attributes', 'name')
//             .sort(sortOptions)
//             .skip(skip)
//             .limit(parseInt(limit));

//         const totalDocs = await Product.countDocuments(query);
//         const response = {
//             docs: products,
//             totalDocs,
//             limit: parseInt(limit),
//             totalPages: Math.ceil(totalDocs / limit),
//             page: parseInt(page),
//             pagingCounter: skip + 1,
//             hasPrevPage: page > 1,
//             hasNextPage: page * limit < totalDocs,
//             prevPage: page > 1 ? page - 1 : null,
//             nextPage: page * limit < totalDocs ? page + 1 : null
//         };

//         res.status(200).json(response);
//     } catch (error) {
//         sendErrorResponse(res, error);
//     }
// };


// // Get Product by ID
// export const getProductById = async (req, res) => {
//     try {
//         const productId = req.params.id;
//         const product = await populateProductDetails(Product.findById(productId));

//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }
//         res.status(200).json(product);
//     } catch (error) {
//         sendErrorResponse(res, error);
//     }
// };

// // Delete a Product
// export const deleteProduct = async (req, res) => {
//     try {
//         const productId = req.params.id;
//         const product = await Product.findByIdAndDelete(productId);
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }
//         res.status(200).json({ message: 'Product deleted successfully' });
//     } catch (error) {
//         sendErrorResponse(res, error);
//     }
// };

// // Add a new review to a product
// export const addReview = async (req, res) => {
//     try {
//         const productId = req.params.productId;
//         const { customerId, reviewText, rating } = req.body;

//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }

//         const customer = await Customer.findById(customerId);
//         if (!customer) {
//             return res.status(404).json({ message: 'Customer not found' });
//         }

//         const newReview = {
//             customer: customerId,
//             reviewText,
//             rating
//         };

//         product.reviews.push(newReview);

//         const totalReviews = product.reviews.length;
//         const totalRating = product.reviews.reduce((acc, review) => acc + review.rating, 0);
//         product.averageRating = totalRating / totalReviews;

//         await product.save();
//         res.status(201).json({ message: 'Review added successfully', review: newReview });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Get reviews for a specific product
// export const getProductReviews = async (req, res) => {
//     try {
//         const productId = req.params.productId;
//         const product = await Product.findById(productId);

//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }

//         res.status(200).json(product.reviews);
//     } catch (error) {
//         sendErrorResponse(res, error);
//     }
// };



// // Update product status
// export const updateProductStatus = async (req, res) => {
//     try {
//         const productId = req.params.id;
//         const { status } = req.body;

//         const product = await Product.findByIdAndUpdate(productId, { status }, { new: true });

//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }

//         res.status(200).json(product);
//     } catch (error) {
//         sendErrorResponse(res, error);
//     }
// };

// // Update product featured status
// export const updateProductFeaturedStatus = async (req, res) => {
//     try {
//         const productId = req.params.id;
//         const { isFeatured } = req.body;

//         const product = await Product.findByIdAndUpdate(productId, { isFeatured }, { new: true });

//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }

//         res.status(200).json(product);
//     } catch (error) {
//         sendErrorResponse(res, error);
//     }
// };

// // Get featured products
// export const getFeaturedProducts = async (req, res) => {
//     try {
//         const products = await populateProductDetails(Product.find({ isFeatured: true }));

//         if (!products.length) {
//             return res.status(404).json({ message: 'No featured products found' });
//         }
//         res.status(200).json(products);
//     } catch (error) {
//         sendErrorResponse(res, error);
//     }
// };

// // // Get latest products
// export const getLatestProducts = async (req, res) => {
//     try {
//         const products = await populateProductDetails(Product.find().sort({ createdAt: -1 }).limit(10));

//         if (!products.length) {
//             return res.status(404).json({ message: 'No latest products found' });
//         }
//         res.status(200).json(products);
//     } catch (error) {
//         sendErrorResponse(res, error);
//     }
// };

// // Get top rated products

// export const getTopRatedProducts = async (req, res) => {
//     try {
//         const topRatedProducts = await Product.aggregate([
//             {
//                 $unwind: "$reviews",
//             },
//             {
//                 $group: {
//                     _id: "$_id",
//                     name: { $first: "$name" },
//                     thumbnail: { $first: "$thumbnail" },
//                     averageRating: { $avg: "$reviews.rating" },
//                     price: { $first: "$price" },
//                     stock: { $first: "$stock" },
//                     isFeatured: { $first: "$isFeatured" },
//                     status: { $first: "$status" },
//                 },
//             },
//             {
//                 $sort: { averageRating: -1 },
//             },
//             {
//                 $limit: 5,
//             },
//         ]);

//         if (!topRatedProducts.length) {
//             return res.status(404).json({ message: 'No top rated products found' });
//         }

//         res.status(200).json(topRatedProducts);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching top rated products', error: error.message });
//     }
// };

// // Sell product
// export const sellProduct = async (req, res) => {
//     try {
//         const productId = req.params.id;
//         const { quantitySold } = req.body;

//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }

//         if (product.stock < quantitySold) {
//             return res.status(400).json({ message: 'Not enough stock available' });
//         }

//         product.stock -= quantitySold;
//         await product.save();
//         res.status(200).json({ message: 'Product sold successfully', product });
//     } catch (error) {
//         sendErrorResponse(res, error);
//     }
// };

// // Get limited stocked products
// export const getLimitedStockedProducts = async (req, res) => {
//     try {
//         // Find products with quantity less than 10
//         const products = await Product.find({ quantity: { $lt: 10 } })
//             .select('name quantity') // Select the required fields (name and quantity)
//             .populate('category', 'name')
//             .populate('subCategory', 'name')
//             .populate('brand', 'name')
//             .populate('color', 'name');

//         // Calculate total quantity of products with less than 10 in stock
//         const totalQuantity = products.reduce((sum, product) => sum + product.quantity, 0);

//         // Check if products exist
//         if (!products.length) {
//             return res.status(404).json({ message: 'No products with limited stock found' });
//         }

//         // Send response with products and total quantity
//         res.status(200).json({ products, totalQuantity });
//     } catch (error) {
//         // Handle errors
//         console.error(error);
//         sendErrorResponse(res, error);
//     }
// };



// // Get all pending products
// export const getAllPendingProducts = async (req, res) => {
//     try {
//         const products = await Product.find({ status: 'pending' })
//             .sort({ createdAt: -1 })
//             .populate('category', 'name')
//             .populate('subCategory', 'name')
//             .populate('brand', 'name')
//             .populate('color', 'name');

//         const formattedProducts = products.map(formatProductResponse);
//         res.status(200).json(formattedProducts);
//     } catch (error) {
//         sendErrorResponse(res, error);
//     }
// };





// // Get all approved products
// export const getAllApprovedProducts = async (req, res) => {
//     try {
//         const products = await Product.find({ status: 'approved' })
//             .sort({ createdAt: -1 })
//             .populate('category', 'name')
//             .populate('subCategory', 'name')
//             .populate('brand', 'name')
//             // .populate('color', 'name');

//         const formattedProducts = products.map(formatProductResponse);
//         res.status(200).json(formattedProducts);
//     } catch (error) {
//         sendErrorResponse(res, error);
//     }
// };

// ///////////////////////
// // Get pending products created by a specific vendor
// export const getPendingProductsByVendor = async (req, res) => {
//     try {
//         const vendorId = req.params.vendorId;

//         // Validate vendorId
//         if (!vendorId) {
//             return res.status(400).json({ message: "Vendor ID is required" });
//         }
//         const vendor = await Vendor.findById(vendorId)
//         if (!vendor) {
//             return res.status(404).json({ message: "Vendor not found" });
//         }
//         console.log(`Fetching products for vendor ID: ${vendorId}`); // Debug log

//         // Query to find pending products created by the specified vendor
//         const products = await Product.find({
//             userId: vendorId,
//             userType: 'vendor', // Ensure this is 'vendor' if you expect vendor products
//             status: 'pending'
//         })
//             .sort({ createdAt: -1 })
//             .populate('category', 'name')
//             .populate('subCategory', 'name')
//             .populate('brand', 'name')
//             // .populate('color', 'name');

//         console.log(`Products found: ${products.length}`); // Debug log

//         // Check if products are fetched correctly
//         if (products.length === 0) {
//             return res.status(404).json({ message: "No pending products found for this vendor" });
//         }

//         // Format the response if the `formatProductResponse` function is defined
//         const formattedProducts = products.map(formatProductResponse);
//         res.status(200).json(formattedProducts);
//     } catch (error) {
//         sendErrorResponse(res, error);
//     }
// };

// // Get approved products created by a specific vendor
// export const getApprovedProductsByVendor = async (req, res) => {
//     try {
//         const vendorId = req.params.vendorId;
//         const products = await Product.find({ userId: vendorId, status: 'approved' })
//             .sort({ createdAt: -1 })
//             .populate('category', 'name')
//             .populate('subCategory', 'name')
//             .populate('brand', 'name')
//             // .populate('color', 'name');

//         const formattedProducts = products.map(formatProductResponse);
//         res.status(200).json(formattedProducts);
//     } catch (error) {
//         sendErrorResponse(res, error);
//     }
// };

// // Get approved products created by a specific vendor
// export const getDeniedProductsByVendor = async (req, res) => {
//     try {
//         const vendorId = req.params.vendorId;
//         const products = await Product.find({ userId: vendorId, status: 'rejected' })
//             .sort({ createdAt: -1 })
//             .populate('category', 'name')
//             .populate('subCategory', 'name')
//             .populate('brand', 'name')
//             // .populate('color', 'name');

//         const formattedProducts = products.map(formatProductResponse);
//         res.status(200).json(formattedProducts);
//     } catch (error) {
//         sendErrorResponse(res, error);
//     }
// };
// // Fetch products based on various filters
// export const getFilteredProducts = async (req, res) => {
//     try {
//         const {
//             category,
//             subCategory,
//             brand,
//             color,
//             priceRange,
//             rating,
//             sortBy,
//             page = 1,
//             limit = 10
//         } = req.query;

//         let query = {};
//         if (category) query.category = category;
//         if (subCategory) query.subCategory = subCategory;
//         if (brand) query.brand = brand;
//         if (color) query.color = color;
//         if (priceRange) {
//             const [minPrice, maxPrice] = priceRange.split(',').map(Number);
//             query.price = { $gte: minPrice, $lte: maxPrice };
//         }
//         if (rating) query.averageRating = { $gte: Number(rating) };

//         let sortOptions = {};
//         if (sortBy) {
//             sortOptions[sortBy] = 1;
//         }

//         const skip = (page - 1) * limit;
//         const products = await populateProductDetails(Product.find(query)
//             .sort(sortOptions)
//             .skip(skip)
//             .limit(parseInt(limit)));

//         const totalDocs = await Product.countDocuments(query);
//         const response = {
//             docs: products,
//             totalDocs,
//             limit: parseInt(limit),
//             totalPages: Math.ceil(totalDocs / limit),
//             page: parseInt(page),
//             pagingCounter: skip + 1,
//             hasPrevPage: page > 1,
//             hasNextPage: page * limit < totalDocs,
//             prevPage: page > 1 ? page - 1 : null,
//             nextPage: page * limit < totalDocs ? page + 1 : null
//         };

//         res.status(200).json(response);
//     } catch (error) {
//         sendErrorResponse(res, error);
//     }
// };

// // Get newest products
// export const getNewestProducts = async (req, res) => {
//     try {
//         const days = parseInt(req.query.days) || 5;
//         const date = new Date();
//         date.setDate(date.getDate() - days);

//         const products = await populateProductDetails(Product.find({ createdAt: { $gte: date } })
//             .sort({ createdAt: -1 })
//             .limit(10));
//         res.status(200).json(products);
//     } catch (error) {
//         sendErrorResponse(res, error);
//     }
// };

// // Get products by vendor
// export const getProductsByVendor = async (req, res) => {
//     try {
//         const vendorId = req.params.vendorId;
//         const products = await populateProductDetails(Product.find({ userId: vendorId })
//         .sort({ createdAt: -1 }));
//         res.status(200).json(products);
//     } catch (error) {
//         sendErrorResponse(res, error);
//     }
// };

// // Get the newest product for a specific vendor within a specified date range
// export const getNewestProductByVendor = async (req, res) => {
//     try {
//         const { vendorId } = req.params; 
//         const { days = 3 } = req.query; 

//         if (!vendorId) {
//             return res.status(400).json({ message: "Vendor ID is required" });
//         }

//         const date = new Date();
//         date.setDate(date.getDate() - parseInt(days)); // Calculate the cutoff date

//         const product = await populateProductDetails(
//             Product.find({ 
//                 userId: vendorId, 
//                 createdAt: { $gte: date } // Filter for products created within the last 'days'
//             })
//             .sort({ createdAt: -1 }) // Sort by newest first
//             .limit(10) // Limit to 1 product
//         );

//         if (!product || product.length === 0) {
//             return res.status(404).json({ message: "No recent products found for this vendor" });
//         }

//         res.status(200).json(product); // Return the single newest product
//     } catch (error) {
//         sendErrorResponse(res, error);
//     }
// };




// // Update product
// export const updateProduct = async (req, res) => {
//     try {
//         const productId = req.params.id;
//         const {
//             name,
//             description,
//             category,
//             subCategorySlug,
//             subSubCategorySlug,
//             brand,
//             productType,
//             digitalProductType,
//             sku,
//             unit,
//             tags,
//             price,
//             discount,
//             discountType,
//             discountAmount,
//             taxAmount,
//             taxIncluded,
//             minimumOrderQty,
//             shippingCost,
//             stock,
//             isFeatured,
//             colors,
//             attributes,
//             size,
//             videoLink,
//         } = req.body;

//         // Validate and get category, sub-category, and sub-sub-category
//         const categoryObj = await validateSlug(Category, category);
//         const subCategoryObj = await validateSlug(SubCategory, subCategorySlug);
//         const subSubCategoryObj = await validateSlug(SubSubCategory, subSubCategorySlug);

//         // Validate brand
//         const brandObj = await Brand.findById(brand);
//         if (!brandObj) {
//             return res.status(400).json({ message: 'Invalid brand ID' });
//         }

//         // Validate colors
//         const colorObjs = await Color.find({ _id: { $in: colors } });
//         if (colors && colorObjs.length !== colors.length) {
//             return res.status(400).json({ message: 'One or more color IDs are invalid' });
//         }

//         // Validate attributes
//         const attributeObjs = attributes ? await Attribute.find({ _id: { $in: attributes } }) : [];
//         if (attributes && attributeObjs.length !== attributes.length) {
//             return res.status(400).json({ message: 'One or more attribute IDs are invalid' });
//         }

//         // Find and update the product
//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }

//         product.name = name || product.name;
//         product.description = description || product.description;
//         product.category = categoryObj ? categoryObj._id : product.category;
//         product.subCategory = subCategoryObj ? subCategoryObj._id : product.subCategory;
//         product.subSubCategory = subSubCategoryObj ? subSubCategoryObj._id : product.subSubCategory;
//         product.brand = brandObj ? brandObj._id : product.brand;
//         product.productType = productType || product.productType;
//         product.digitalProductType = digitalProductType || product.digitalProductType;
//         product.sku = sku || product.sku;
//         product.unit = unit || product.unit;
//         product.tags = tags || product.tags;
//         product.price = price || product.price;
//         product.discount = discount || product.discount;
//         product.discountType = discountType || product.discountType;
//         product.discountAmount = discountAmount || product.discountAmount;
//         product.taxAmount = taxAmount || product.taxAmount;
//         product.taxIncluded = taxIncluded || product.taxIncluded;
//         product.minimumOrderQty = minimumOrderQty || product.minimumOrderQty;
//         product.quantity = quantity || product.quantity;
//         product.stock = stock || product.stock;
//         product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
//         product.colors = colorObjs.length ? colorObjs.map(color => color._id) : product.colors;
//         product.attributes = attributeObjs.length ? attributeObjs.map(attribute => attribute._id) : product.attributes;
//         product.size = size || product.size;
//         product.videoLink = videoLink || product.videoLink;

//         // Handle file uploads
//         if (req.files) {
//             if (req.files['thumbnail']) {
//                 product.thumbnail = req.files['thumbnail'][0].path;
//             }
//             if (req.files['images']) {
//                 product.images = req.files['images'].map(file => file.path);
//             }
//         }

//         await product.save();
//         res.status(200).json({ message: 'Product updated successfully', product });
//     } catch (error) {
//         sendErrorResponse(res, error);
//     }
// };




// // Update the status of a specific review
// export const updateReviewStatus = async (req, res) => {
//     try {
//         const { reviewId } = req.params;
//         const { status } = req.body; // Expecting status to be 'Active' or 'Inactive'

//         if (!['Active', 'Inactive'].includes(status)) {
//             return res.status(400).json({ message: 'Invalid status' });
//         }

//         const product = await Product.findOne({ 'reviews._id': reviewId });
//         if (!product) {
//             return res.status(404).json({ message: 'Product or review not found' });
//         }

//         const review = product.reviews.id(reviewId);
//         if (!review) {
//             return res.status(404).json({ message: 'Review not found' });
//         }

//         review.status = status;

//         await product.save();
//         res.status(200).json({ message: 'Review status updated successfully', review });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };




=======
// Get all pending products
export const getAllPendingProducts = async (req, res) => {
    try {
        const products = await Product.find({ status: 'pending' })
            .sort({ createdAt: -1 })
            .populate('category', 'name')
            .populate('subCategory', 'name')
            .populate('brand', 'name')
            .populate('color', 'name');

        const formattedProducts = products.map(formatProductResponse);
        res.status(200).json(formattedProducts);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};





// Get all approved products
export const getAllApprovedProducts = async (req, res) => {
    try {
        const products = await Product.find({ status: 'approved' })
            .sort({ createdAt: -1 })
            .populate('category', 'name')
            .populate('subCategory', 'name')
            .populate('brand', 'name')
            .populate('color', 'name');

        const formattedProducts = products.map(formatProductResponse);
        res.status(200).json(formattedProducts);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

///////////////////////
// Get pending products created by a specific vendor
export const getPendingProductsByVendor = async (req, res) => {
    try {
        const vendorId = req.params.vendorId;

        // Validate vendorId
        if (!vendorId) {
            return res.status(400).json({ message: "Vendor ID is required" });
        }
        const vendor = await Vendor.findById(vendorId)
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        console.log(`Fetching products for vendor ID: ${vendorId}`); // Debug log

        // Query to find pending products created by the specified vendor
        const products = await Product.find({
            userId: vendorId,
            userType: 'vendor', // Ensure this is 'vendor' if you expect vendor products
            status: 'pending'
        })
            .sort({ createdAt: -1 })
            .populate('category', 'name')
            .populate('subCategory', 'name')
            .populate('brand', 'name')
            .populate('color', 'name');

        console.log(`Products found: ${products.length}`); // Debug log

        // Check if products are fetched correctly
        if (products.length === 0) {
            return res.status(404).json({ message: "No pending products found for this vendor" });
        }

        // Format the response if the `formatProductResponse` function is defined
        const formattedProducts = products.map(formatProductResponse);
        res.status(200).json(formattedProducts);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

// Get approved products created by a specific vendor
export const getApprovedProductsByVendor = async (req, res) => {
    try {
        const vendorId = req.params.vendorId;
        const products = await Product.find({ userId: vendorId, status: 'approved' })
            .sort({ createdAt: -1 })
            .populate('category', 'name')
            .populate('subCategory', 'name')
            .populate('brand', 'name')
            .populate('color', 'name');

        const formattedProducts = products.map(formatProductResponse);
        res.status(200).json(formattedProducts);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

// Get approved products created by a specific vendor
export const getDeniedProductsByVendor = async (req, res) => {
    try {
        const vendorId = req.params.vendorId;
        const products = await Product.find({ userId: vendorId, status: 'rejected' })
            .sort({ createdAt: -1 })
            .populate('category', 'name')
            .populate('subCategory', 'name')
            .populate('brand', 'name')
            .populate('color', 'name');

        const formattedProducts = products.map(formatProductResponse);
        res.status(200).json(formattedProducts);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};
// Fetch products based on various filters
export const getFilteredProducts = async (req, res) => {
    try {
        const {
            category,
            subCategory,
            brand,
            color,
            priceRange,
            rating,
            sortBy,
            page = 1,
            limit = 10
        } = req.query;

        let query = {};
        if (category) query.category = category;
        if (subCategory) query.subCategory = subCategory;
        if (brand) query.brand = brand;
        if (color) query.color = color;
        if (priceRange) {
            const [minPrice, maxPrice] = priceRange.split(',').map(Number);
            query.price = { $gte: minPrice, $lte: maxPrice };
        }
        if (rating) query.averageRating = { $gte: Number(rating) };

        let sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = 1;
        }

        const skip = (page - 1) * limit;
        const products = await populateProductDetails(Product.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit)));

        const totalDocs = await Product.countDocuments(query);
        const response = {
            docs: products,
            totalDocs,
            limit: parseInt(limit),
            totalPages: Math.ceil(totalDocs / limit),
            page: parseInt(page),
            pagingCounter: skip + 1,
            hasPrevPage: page > 1,
            hasNextPage: page * limit < totalDocs,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page * limit < totalDocs ? page + 1 : null
        };

        res.status(200).json(response);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

// Get newest products
export const getNewestProducts = async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 5;
        const date = new Date();
        date.setDate(date.getDate() - days);

        const products = await populateProductDetails(Product.find({ createdAt: { $gte: date } })
            .sort({ createdAt: -1 })
            .limit(10));
        res.status(200).json(products);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

// Get products by vendor
export const getProductsByVendor = async (req, res) => {
    try {
        const vendorId = req.params.vendorId;
        const products = await populateProductDetails(Product.find({ userId: vendorId })
        .sort({ createdAt: -1 }));
        res.status(200).json(products);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

// Get the newest product for a specific vendor within a specified date range
export const getNewestProductByVendor = async (req, res) => {
    try {
        const { vendorId } = req.params; 
        const { days = 3 } = req.query; 

        if (!vendorId) {
            return res.status(400).json({ message: "Vendor ID is required" });
        }

        const date = new Date();
        date.setDate(date.getDate() - parseInt(days)); // Calculate the cutoff date

        const product = await populateProductDetails(
            Product.find({ 
                userId: vendorId, 
                createdAt: { $gte: date } // Filter for products created within the last 'days'
            })
            .sort({ createdAt: -1 }) // Sort by newest first
            .limit(10) // Limit to 1 product
        );

        if (!product || product.length === 0) {
            return res.status(404).json({ message: "No recent products found for this vendor" });
        }

        res.status(200).json(product); // Return the single newest product
    } catch (error) {
        sendErrorResponse(res, error);
    }
};




// Update product
export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const {
            name,
            description,
            category,
            subCategorySlug,
            subSubCategorySlug,
            brand,
            productType,
            digitalProductType,
            sku,
            unit,
            tags,
            price,
            discount,
            discountType,
            discountAmount,
            taxAmount,
            taxIncluded,
            minimumOrderQty,
            shippingCost,
            stock,
            isFeatured,
            colors,
            attributes,
            size,
            videoLink,
        } = req.body;

        // Validate and get category, sub-category, and sub-sub-category
        const categoryObj = await validateSlug(Category, category);
        const subCategoryObj = await validateSlug(SubCategory, subCategorySlug);
        const subSubCategoryObj = await validateSlug(SubSubCategory, subSubCategorySlug);

        // Validate brand
        const brandObj = await Brand.findById(brand);
        if (!brandObj) {
            return res.status(400).json({ message: 'Invalid brand ID' });
        }

        // Validate colors
        const colorObjs = await Color.find({ _id: { $in: colors } });
        if (colors && colorObjs.length !== colors.length) {
            return res.status(400).json({ message: 'One or more color IDs are invalid' });
        }

        // Validate attributes
        const attributeObjs = attributes ? await Attribute.find({ _id: { $in: attributes } }) : [];
        if (attributes && attributeObjs.length !== attributes.length) {
            return res.status(400).json({ message: 'One or more attribute IDs are invalid' });
        }

        // Find and update the product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.category = categoryObj ? categoryObj._id : product.category;
        product.subCategory = subCategoryObj ? subCategoryObj._id : product.subCategory;
        product.subSubCategory = subSubCategoryObj ? subSubCategoryObj._id : product.subSubCategory;
        product.brand = brandObj ? brandObj._id : product.brand;
        product.productType = productType || product.productType;
        product.digitalProductType = digitalProductType || product.digitalProductType;
        product.sku = sku || product.sku;
        product.unit = unit || product.unit;
        product.tags = tags || product.tags;
        product.price = price || product.price;
        product.discount = discount || product.discount;
        product.discountType = discountType || product.discountType;
        product.discountAmount = discountAmount || product.discountAmount;
        product.taxAmount = taxAmount || product.taxAmount;
        product.taxIncluded = taxIncluded || product.taxIncluded;
        product.minimumOrderQty = minimumOrderQty || product.minimumOrderQty;
        product.quantity = quantity || product.quantity;
        product.stock = stock || product.stock;
        product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
        product.colors = colorObjs.length ? colorObjs.map(color => color._id) : product.colors;
        product.attributes = attributeObjs.length ? attributeObjs.map(attribute => attribute._id) : product.attributes;
        product.size = size || product.size;
        product.videoLink = videoLink || product.videoLink;

        // Handle file uploads
        if (req.files) {
            if (req.files['thumbnail']) {
                product.thumbnail = req.files['thumbnail'][0].path;
            }
            if (req.files['images']) {
                product.images = req.files['images'].map(file => file.path);
            }
        }

        await product.save();
        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        sendErrorResponse(res, error);
    }
};
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
