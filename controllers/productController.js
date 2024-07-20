
// import Category from '../models/categoryModel.js';
// import Product from '../models/ProductModels.js';
// import SubCategory from '../models/subCategoryModel.js';
// import SubSubCategory from '../models/subSubCategoryModel.js';
// import Brand from '../models/brandModel.js';
// import Color from '../models/colorModel.js';

// // Update product images
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
//             quantity,
//             stock,
//             isFeatured,
//             color,
//             attributeType,
//             size,
//             videoLink
//         } = req.body;

//        // Validate and convert slugs to ObjectIds
//        const categoryObj = await Category.findOne({ slug: category });
//        if (!categoryObj) {
//            return res.status(400).json({ message: 'Invalid category slug' });
//        }
//         // Validate subcategory by slug
//         const subCategoryObj = subCategorySlug ? await SubCategory.findOne({ slug: subCategorySlug }) : null;
//         if (subCategorySlug && !subCategoryObj) {
//             return res.status(400).json({ message: 'Invalid sub-category slug' });
//         }

//         // Validate sub-subcategory by slug
//         const subSubCategoryObj = subSubCategorySlug ? await SubSubCategory.findOne({ slug: subSubCategorySlug }) : null;
//         if (subSubCategorySlug && !subSubCategoryObj) {
//             return res.status(400).json({ message: 'Invalid sub-sub-category slug' });
//         }

//         const brandObj = await Brand.findById(brand);
//         if (!brandObj) {
//             return res.status(400).json({ message: 'Invalid brand ID' });
//         }

//         const colorObj = await Color.findById(color);
//         if (color && !colorObj) {
//             return res.status(400).json({ message: 'Invalid color ID' });
//         }

//         const newProduct = new Product({
//             name,
//             description,
//             category: categoryObj._id,
//             subCategory: subCategoryObj ? subCategoryObj._id : undefined,
//             subSubCategory: subSubCategoryObj ? subSubCategoryObj._id : undefined,
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
//             quantity,
//             stock,
//             isFeatured: isFeatured || false,
//             color,
//             attributeType,
//             size,
//             videoLink,
//             thumbnail: req.files['thumbnail'] ? req.files['thumbnail'][0].path : undefined,
//             images: req.files['images'] ? req.files['images'].map(file => file.path) : [],
//             status: 'pending',
//         });

//         await newProduct.save();
//         res.status(201).json(newProduct);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

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
//         res.status(500).json({ message: error.message });
//     }
// };

// // ... (other controller functions remain unchanged)






// // Get Product by ID
// export const getProductById = async (req, res) => {
//     try {
//         const productId = req.params.id;
//         const product = await Product.findById(productId)
//             .populate('category', 'name')
//             .populate('subCategory', 'name')
//             .populate('brand', 'name')
//             .populate('color', 'name')
//             // .populate('subSubCategory', 'name')
//             // .populate('vendor', 'shopName'); // Populate with vendor's shopName
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }
//         res.status(200).json(product);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
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
//         res.status(500).json({ message: error.message });
//     }
// };

// // // Add a new review to a product
// // export const addReview = async (req, res) => {
// //     try {
// //         const productId = req.params.productId;
// //         const { reviewerName, reviewerEmail, reviewText, rating } = req.body;

// //         const product = await Product.findById(productId);
// //         if (!product) {
// //             return res.status(404).json({ message: 'Product not found' });
// //         }

// //         const newReview = {
// //             reviewerName,
// //             reviewerEmail,
// //             reviewText,
// //             rating
// //         };

// //         product.reviews.push(newReview);
// //         await product.save();

// //         res.status(201).json({ message: 'Review added successfully', review: newReview });
// //     } catch (error) {
// //         res.status(500).json({ message: error.message });
// //     }
// // };

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
//         res.status(500).json({ message: error.message });
//     }
// };

// // Get products by vendor
// export const getProductsByVendor = async (req, res) => {
//     try {
//         const vendorId = req.params.vendorId;
//         const products = await Product.find({ vendor: vendorId })
//             .populate('category', 'name')
//             .populate('subCategory', 'name')
//             .populate('subSubCategory', 'name')
//             .populate('vendor', 'shopName');
//         if (!products.length) {
//             return res.status(404).json({ message: 'No products found for this vendor' });
//         }
//         res.status(200).json(products);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
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
//         res.status(500).json({ message: error.message });
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
//         res.status(500).json({ message: error.message });
//     }
// };

// // Get Featured Products
// export const getFeaturedProducts = async (req, res) => {
//   try {
//     const featuredProducts = await Product.find({ isFeatured: true });
//     res.status(200).json(featuredProducts);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching featured products', error });
//   }
// };

// // Get Latest Products
// export const getLatestProducts = async (req, res) => {
//     try {
//       const latestProducts = await Product.find().sort({ createdAt: -1 }).limit(5); // Fetch latest 5 products
//       res.status(200).json(latestProducts);
//     } catch (error) {
//       res.status(500).json({ message: 'Error fetching latest products', error });
//     }
//   };


//   //with no arrival and latest product 

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

//         res.status(200).json(topRatedProducts);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching top rated products', error });
//     }
// };

// // Advanced filtering, pagination, and sorting
// export const getAllProducts = async (req, res) => {
//     try {
//         // Destructure query parameters
//         const { category, latest, newArrival, sort, order = 'asc', page = 1, limit = 10 } = req.query;

//         // Build query object
//         let query = {};

//         // Filter by category
//         if (category) {
//             query.category = category;
//         }

//         // Filter for latest products (added in the last 7 days)
//         if (latest === 'true') {
//             const last7Days = new Date();
//             last7Days.setDate(last7Days.getDate() - 7);
//             query.createdAt = { $gte: last7Days };
//         }

//         // Filter for new arrivals (added in the last 30 days)
//         if (newArrival === 'true') {
//             const last30Days = new Date();
//             last30Days.setDate(last30Days.getDate() - 30);
//             query.createdAt = { $gte: last30Days };
//         }

//         // Sort options
//         let sortOptions = {};
//         if (sort) {
//             sortOptions[sort] = order === 'asc' ? 1 : -1;
//         } else {
//             sortOptions.createdAt = -1; // default sort by newest first
//         }

//         // Pagination options
//         const skip = (page - 1) * limit;

//         // Execute query with pagination, sorting, and filters
//         const products = await Product.find(query)
//         .populate('category', 'name')
//         .populate('subCategory', 'name')
//         .populate('brand', 'name')
//         .populate('color', 'name')
//             .sort(sortOptions)
//             .skip(skip)
//             .limit(parseInt(limit));

//         // Get total count for pagination
//         const totalDocs = await Product.countDocuments(query);

//         // Prepare response
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
//         res.status(500).json({ message: error.message });
//     }
// };

// export const sellProduct = async (productId, quantitySold) => {
//     try {
//         await Product.findByIdAndUpdate(productId, {
//             $inc: { salesCount: quantitySold },
//             $set: { stock: stock - quantitySold } // Ensure you adjust the stock accordingly
//         });
//     } catch (error) {
//         console.error('Error updating sales count:', error);
//     }
// };



// export const addReview = async (req, res) => {
//     try {
//         const productId = req.params.productId;
//         const { reviewerName, reviewerEmail, reviewText, rating } = req.body;

//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }

//         const newReview = {
//             reviewerName,
//             reviewerEmail,
//             reviewText,
//             rating
//         };

//         product.reviews.push(newReview);

//         // Update average rating
//         const totalReviews = product.reviews.length;
//         const totalRating = product.reviews.reduce((acc, review) => acc + review.rating, 0);
//         product.averageRating = totalRating / totalReviews;

//         await product.save();
//         res.status(201).json({ message: 'Review added successfully', review: newReview });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };



//// latest

import Category from '../models/categoryModel.js';
import Product from '../models/ProductModels.js';
import SubCategory from '../models/subCategoryModel.js';
import SubSubCategory from '../models/subSubCategoryModel.js';
import Brand from '../models/brandModel.js';
import Color from '../models/colorModel.js';
import Customer from '../models/customerModel.js';

 
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
        // .populate('subSubCategory', 'name')
        .populate('brand', 'name')
        .populate('color', 'name');
};



// Create product
export const createProduct = async (req, res) => {
    try {
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
            quantity,
            stock,
            isFeatured,
            color,
            attributeType,
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

        const colorObj = await Color.findById(color);
        if (color && !colorObj) {
            return res.status(400).json({ message: 'Invalid color ID' });
        }
     
        const newProduct = new Product({
            name,
            description,
            category: categoryObj._id,
            subCategory: subCategoryObj ? subCategoryObj._id : undefined,
            subSubCategory: subSubCategoryObj ? subSubCategoryObj._id : undefined,
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
            quantity,
            stock,
            isFeatured: isFeatured || false,
            color,
            attributeType,
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
        res.status(200).json(product);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

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
            .populate('color', 'name')
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

// Get Product by ID
export const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await populateProductDetails(Product.findById(productId));

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

// Delete a Product
export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

// Add a new review to a product
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
        res.status(201).json({ message: 'Review added successfully', review: newReview });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get reviews for a specific product
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

// Get products by vendor
export const getProductsByVendor = async (req, res) => {
    try {
        const vendorId = req.params.vendorId;
        const products = await populateProductDetails(Product.find({ vendor: vendorId }));

        if (!products.length) {
            return res.status(404).json({ message: 'No products found for this vendor' });
        }
        res.status(200).json(products);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

// Update product status
export const updateProductStatus = async (req, res) => {
    try {
        const productId = req.params.id;
        const { status } = req.body;

        const product = await Product.findByIdAndUpdate(productId, { status }, { new: true });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

// Update product featured status
export const updateProductFeaturedStatus = async (req, res) => {
    try {
        const productId = req.params.id;
        const { isFeatured } = req.body;

        const product = await Product.findByIdAndUpdate(productId, { isFeatured }, { new: true });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

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
        res.status(200).json(products);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

// Get top rated products

export const getTopRatedProducts = async (req, res) => {
    try {
        const topRatedProducts = await Product.aggregate([
            {
                $unwind: "$reviews",
            },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    thumbnail: { $first: "$thumbnail" },
                    averageRating: { $avg: "$reviews.rating" },
                    price: { $first: "$price" },
                    stock: { $first: "$stock" },
                    isFeatured: { $first: "$isFeatured" },
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
        sendErrorResponse(res, error);
    }
};