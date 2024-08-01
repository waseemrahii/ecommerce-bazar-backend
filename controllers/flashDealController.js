

<<<<<<< HEAD
// import FlashDeal from '../models/flashDealModel.js';
// import Product from '../models/ProductModels.js';

// // Function to check expiration status
// const checkExpiration = (flashDeal) => {
//     const currentDate = new Date();
//     const endDate = new Date(flashDeal.endDate);
//     return currentDate > endDate; // Returns true if expired
// };

// // Create Flash Deal
// export const createFlashDeal = async (req, res) => {
//     try {
//         const { title, startDate, endDate } = req.body;
//         const image = req.file ? req.file.path : '';

//         const newFlashDeal = new FlashDeal({
//             title,
//             startDate,
//             endDate,
//             image,
//             status: 'inactive', // Default status is inactive
//         });

//         await newFlashDeal.save();
//         res.status(201).json({ message: 'Flash deal created successfully', flashDeal: newFlashDeal });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };



// // Get Flash Deals with Search and Pagination
// export const getFlashDeals = async (req, res) => {
//     try {
//         // Extract search parameters from query
//         const { title, status, startDate, endDate, page = 1, limit = 10 } = req.query;

//         // Build query object
//         const query = {};
//         if (title) {
//             query.title = { $regex: new RegExp(title, 'i') }; // Case-insensitive search
//         }
//         if (status) {
//             query.status = status;
//         }
//         if (startDate || endDate) {
//             query.startDate = {};
//             if (startDate) {
//                 query.startDate.$gte = new Date(startDate);
//             }
//             if (endDate) {
//                 query.startDate.$lte = new Date(endDate);
//             }
//         }

//         // Calculate pagination
//         const skip = (page - 1) * limit;
//         const flashDeals = await FlashDeal.find(query)
//             .skip(skip)
//             .limit(Number(limit))
//             .populate({
//                 path: 'productId',
//                 select: 'name price description thumbnail', // Specify the fields to return
//             });

//         // Check expiration for each deal
//         for (let deal of flashDeals) {
//             if (checkExpiration(deal)) {
//                 deal.status = 'expired'; // Update status to expired
//                 await deal.save(); // Save updated status to DB
//             }
//         }

//         // Return paginated results
//         res.status(200).json({
//             page: Number(page),
//             limit: Number(limit),
//             total: await FlashDeal.countDocuments(query),
//             flashDeals,
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Get Flash Deal by ID
// export const getFlashDealById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const flashDeal = await FlashDeal.findById(id).populate({
//             path: 'productId',
//             select: 'name price description thumbnail', // Specify the fields to return
//         });

//         if (!flashDeal) {
//             return res.status(404).json({ message: 'Flash Deal not found' });
//         }

//         // Check expiration status and update if necessary
//         if (checkExpiration(flashDeal)) {
//             flashDeal.status = 'expired';
//             await flashDeal.save();
//         }

//         res.status(200).json({ flashDeal });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Update Flash Deal
// export const updateFlashDeal = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { title, startDate, endDate, status } = req.body;
//         const image = req.file ? req.file.path : '';
//         const updateData = { title, startDate, endDate, status, image }; // Include image in update

//         const updatedFlashDeal = await FlashDeal.findByIdAndUpdate(id, updateData, { new: true });

//         if (checkExpiration(updatedFlashDeal)) {
//             updatedFlashDeal.status = 'expired'; // Automatically set to expired if past due
//             await updatedFlashDeal.save();
//         }

//         res.status(200).json({ message: 'Flash deal updated successfully', flashDeal: updatedFlashDeal });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


// // Add Product to Flash Deal
// export const addProductToFlashDeal = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { productId } = req.body;

//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }

//         const flashDeal = await FlashDeal.findById(id);
//         if (!flashDeal) {
//             return res.status(404).json({ message: 'Flash Deal not found' });
//         }

//         // Check if product is already in the flash deal
//         if (flashDeal.productId.includes(productId)) {
//             return res.status(400).json({ message: 'Product already in Flash Deal' });
//         }

//         // Add product to the flash deal
//         flashDeal.productId.push(productId);
//         flashDeal.activeProducts += 1;

//         await flashDeal.save();
//         res.status(200).json({ message: 'Product added to Flash Deal successfully', flashDeal });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


// // Update the status of a Flash Deal
// export const updateFlashDealStatus = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { status } = req.body;

//         const updatedFlashDeal = await FlashDeal.findByIdAndUpdate(
//             id,
//             { status },
//             { new: true } // Return the updated document
//         );

//         if (!updatedFlashDeal) {
//             return res.status(404).json({ message: 'Flash Deal not found' });
//         }

//         res.status(200).json({ message: 'Flash Deal status updated successfully', flashDeal: updatedFlashDeal });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Update Publish Status of Flash Deal
// export const updatePublishStatus = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { publish } = req.body;

//         const updatedFlashDeal = await FlashDeal.findByIdAndUpdate(
//             id,
//             { publish },
//             { new: true } // Return the updated document
//         );

//         if (!updatedFlashDeal) {
//             return res.status(404).json({ message: 'Flash Deal not found' });
//         }

//         res.status(200).json({ message: 'Publish status updated successfully', flashDeal: updatedFlashDeal });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Remove Product from Flash Deal
// export const removeProductFromFlashDeal = async (req, res) => {
//     try {
//         const { id, productId } = req.params;


//         const flashDeal = await FlashDeal.findById(id);
//         if (!flashDeal) {
//             return res.status(404).json({ message: 'Flash Deal not found' });
//         }

//         // Check if product is in the flash deal
//         const productIndex = flashDeal.productId.indexOf(productId);
//         if (productIndex === -1) {
//             return res.status(404).json({ message: 'Product not found in Flash Deal' });
//         }

//         // Remove product from the flash deal
//         flashDeal.productId.splice(productIndex, 1);
//         flashDeal.activeProducts -= 1;

//         await flashDeal.save();
//         res.status(200).json({ message: 'Product removed from Flash Deal successfully', flashDeal });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


// // Delete Flash Deal
// export const deleteFlashDeal = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const deletedFlashDeal = await FlashDeal.findByIdAndDelete(id);

//         if (!deletedFlashDeal) {
//             return res.status(404).json({ message: 'Flash Deal not found' });
//         }

//         res.status(200).json({ message: 'Flash Deal deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };








///////////////////// with redis


// import FlashDeal from '../models/flashDealModel.js';
// import { sendErrorResponse, sendSuccessResponse } from '../utils/responseHandler.js';
// import { getCache, setCache } from '../utils/redisUtils.js';
// import logger from '../utils/logger.js';

// // Helper function to check if a flash deal is expired
// const checkExpiration = (flashDeal) => {
//     const currentDate = new Date();
//     const endDate = new Date(flashDeal.endDate);
//     return currentDate > endDate;
// };

// // Create Flash Deal
// export const createFlashDeal = async (req, res) => {
//     try {
//         const { title, startDate, endDate } = req.body;
//         const image = req.file ? req.file.path : '';

//         const newFlashDeal = new FlashDeal({
//             title,
//             startDate,
//             endDate,
//             image,
//             status: 'inactive', // Default status is inactive
//         });

//         await newFlashDeal.save();
//         // Cache the newly created deal with its specific key
//         await setCache(`flashDeal_${newFlashDeal._id}`, newFlashDeal);

//         res.status(201).json({ message: 'Flash deal created successfully', flashDeal: newFlashDeal });
//     } catch (error) {
//         logger.error(`Error creating flash deal: ${error.message}`);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// // // Get Flash Deals with Caching
// // export const getFlashDeals = async (req, res) => {
// //     try {
// //         const cacheKey = 'flashDeals';
// //         const cachedData = await getCache(cacheKey);

// //         console.log('Cache Retrieval:', cachedData); // Add this line

// //         if (cachedData) {
// //             console.log('Cache Hit:', cachedData); // Add this line
// //             return sendSuccessResponse(res, cachedData, 'Flash deals retrieved successfully (from cache)');
// //         }

// //         // Fetch from DB if not in cache
// //         const flashDeals = await FlashDeal.find().populate({
// //             path: 'productId',
// //             select: 'name price description thumbnail', // Specify the fields to return
// //         });

// //         // Check expiration for each deal
// //         for (let deal of flashDeals) {
// //             if (checkExpiration(deal)) {
// //                 deal.status = 'expired'; // Update status to expired
// //                 await deal.save(); // Save updated status to DB
// //             }
// //         }

// //         // Cache the fetched deals
// //         await setCache(cacheKey, flashDeals, 3600); // Cache for 1 hour
// //         console.log('Cache Set:', flashDeals); // Add this line
// //         res.status(200).json(flashDeals);
// //     } catch (error) {
// //         logger.error(error.message);
// //         res.status(500).json({ message: error.message });
// //     }
// // };

// export const getFlashDeals = async (req, res) => {
//     try {
//         const cacheKey = 'flashDeals';
//         const cachedData = await getCache(cacheKey);
        
//         if (cachedData) {
//             return res.status(200).json({
//                 success: true,
//                 message: 'Flash deals retrieved successfully (from cache)',
//                 docs: cachedData
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: 'No cached data found',
//             docs: null
//         });

//     } catch (error) {
//         logger.error(error.message);
//         res.status(500).json({ message: error.message });
//     }
// };


// // Get Flash Deal by ID
// export const getFlashDealById = async (req, res) => {
//     try {
//         const { id } = req.params;

//         // Check cache first
//         const cacheKey = `flashDeal_${id}`;
//         const cachedData = await getCache(cacheKey);

//         if (cachedData) {
//             return sendSuccessResponse(res, cachedData, 'Flash deal retrieved successfully (from cache)');
//         }

//         // Fetch from database if not in cache
//         const flashDeal = await FlashDeal.findById(id).exec();

//         if (!flashDeal) {
//             return res.status(404).json({ message: 'Flash deal not found' });
//         }

//         // Check expiration and update status
//         if (checkExpiration(flashDeal)) {
//             flashDeal.status = 'expired';
//             await flashDeal.save();
//         }

//         // Set cache
//         await setCache(cacheKey, flashDeal, 3600); // Cache for 1 hour
//         sendSuccessResponse(res, flashDeal, 'Flash deal retrieved successfully');
//     } catch (error) {
//         logger.error(error.message);
//         sendErrorResponse(res, error);
//     }
// };

// // Update Flash Deal
// export const updateFlashDeal = async (req, res) => {
//     try {
//         const { id } = req.params;

//         // Validate request body
//         const { error } = flashDealValidationSchema.validate(req.body);
//         if (error) {
//             return res.status(400).json({ message: error.details[0].message });
//         }

//         // Update flash deal
//         const updatedFlashDeal = await FlashDeal.findByIdAndUpdate(id, req.body, { new: true }).exec();

//         if (!updatedFlashDeal) {
//             return res.status(404).json({ message: 'Flash deal not found' });
//         }

//         // Check expiration and update status
//         if (checkExpiration(updatedFlashDeal)) {
//             updatedFlashDeal.status = 'expired';
//             await updatedFlashDeal.save();
//         }

//         // Invalidate cache for updated deal and all deals list
//         await deleteCache(`flashDeal_${id}`);
//         await deleteCache('flashDeals');

//         sendSuccessResponse(res, updatedFlashDeal, 'Flash deal updated successfully');
//     } catch (error) {
//         logger.error(error.message);
//         sendErrorResponse(res, error);
//     }
// };

// // Delete Flash Deal
// export const deleteFlashDeal = async (req, res) => {
//     try {
//         const { id } = req.params;
//         console.log('Requested Flash Deal ID:', id); // Log the ID to confirm

//         // Delete flash deal
//         const deletedFlashDeal = await FlashDeal.findByIdAndDelete(id);

//         if (!deletedFlashDeal) {
//             return res.status(404).json({ message: 'Flash deal not found' });
//         }

//         // Invalidate cache for deleted deal and all deals list
//         await deleteCache(`flashDeal_${id}`);
//         await deleteCache('flashDeals');

//         sendSuccessResponse(res, deletedFlashDeal, 'Flash deal deleted successfully');
//     } catch (error) {
//         logger.error(error.message);
//         sendErrorResponse(res, error);
//     }
// };

// // Add Product to Flash Deal
// export const addProductToFlashDeal = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { productId } = req.body;

//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }

//         const flashDeal = await FlashDeal.findById(id);
//         if (!flashDeal) {
//             return res.status(404).json({ message: 'Flash Deal not found' });
//         }

//         // Check if product is already in the flash deal
//         if (flashDeal.productId.includes(productId)) {
//             return res.status(400).json({ message: 'Product already in Flash Deal' });
//         }

//         // Add product to the flash deal
//         flashDeal.productId.push(productId);
//         flashDeal.activeProducts += 1;

//         await flashDeal.save();
//         await deleteCache(`flashDeal_${id}`);
//         await deleteCache('flashDeals');

//         sendSuccessResponse(res, flashDeal, 'Product added to Flash Deal successfully');
//     } catch (error) {
//         logger.error(error.message);
//         sendErrorResponse(res, error);
//     }
// };

// // Update Flash Deal Status
// export const updateFlashDealStatus = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { status } = req.body;

//         const validStatuses = ['active', 'inactive', 'expired'];
//         if (!validStatuses.includes(status)) {
//             return res.status(400).json({ message: 'Invalid status' });
//         }

//         const updatedFlashDeal = await FlashDeal.findByIdAndUpdate(id, { status }, { new: true }).exec();
//         if (!updatedFlashDeal) {
//             return res.status(404).json({ message: 'Flash deal not found' });
//         }

//         await deleteCache(`flashDeal_${id}`);
//         await deleteCache('flashDeals');

//         sendSuccessResponse(res, updatedFlashDeal, 'Flash deal status updated successfully');
//     } catch (error) {
//         logger.error(error.message);
//         sendErrorResponse(res, error);
//     }
// };

// // Update Publish Status
// export const updatePublishStatus = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { publish } = req.body;

//         // Validate publish status (true/false)
//         if (typeof publish !== 'boolean') {
//             return res.status(400).json({ message: 'Invalid publish status' });
//         }

//         // Update the publish status of the flash deal
//         const updatedFlashDeal = await FlashDeal.findByIdAndUpdate(
//             id,
//             { publish },
//             { new: true } // Return the updated document
//         );

//         if (!updatedFlashDeal) {
//             return res.status(404).json({ message: 'Flash Deal not found' });
//         }

//         // Invalidate cache if you are using caching
//         await deleteCache(`flashDeal_${id}`);
//         await deleteCache('flashDeals');

//         sendSuccessResponse(res, updatedFlashDeal, 'Publish status updated successfully');
//     } catch (error) {
//         // Log the error for debugging
//         logger.error(error.message);
//         sendErrorResponse(res, error);
//     }
// };

// // Remove Product from Flash Deal
// export const removeProductFromFlashDeal = async (req, res) => {
//     try {
//         const { id } = req.params; // Flash deal ID
//         const { productId } = req.body; // Product ID to remove

//         const flashDeal = await FlashDeal.findById(id);
//         if (!flashDeal) {
//             return res.status(404).json({ message: 'Flash Deal not found' });
//         }

//         // Check if the product is in the flash deal
//         if (!flashDeal.productId.includes(productId)) {
//             return res.status(400).json({ message: 'Product not found in Flash Deal' });
//         }

//         // Remove product from the flash deal
//         flashDeal.productId = flashDeal.productId.filter(id => id.toString() !== productId);
//         flashDeal.activeProducts -= 1;

//         await flashDeal.save();
//         await deleteCache(`flashDeal_${id}`);
//         await deleteCache('flashDeals');

//         sendSuccessResponse(res, flashDeal, 'Product removed from Flash Deal successfully');
//     } catch (error) {
//         logger.error(error.message);
//         sendErrorResponse(res, error);
//     }
// };
   

///////////// with new redis 


import FlashDeal from '../models/flashDealModel.js';
import { sendErrorResponse, sendSuccessResponse } from '../utils/responseHandler.js';
import { getCache, setCache, deleteCache } from '../utils/redisUtils.js'; // Ensure deleteCache is imported
import logger from '../utils/logger.js';
import Product from '../models/ProductModels.js'; // Import Product model

// Helper function to check if a flash deal is expired
const checkExpiration = (flashDeal) => {
    const currentDate = new Date();
    const endDate = new Date(flashDeal.endDate);
    return currentDate > endDate;
=======
import FlashDeal from '../models/flashDealModel.js';
import Product from '../models/ProductModels.js';

// Function to check expiration status
const checkExpiration = (flashDeal) => {
    const currentDate = new Date();
    const endDate = new Date(flashDeal.endDate);
    return currentDate > endDate; // Returns true if expired
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
};

// Create Flash Deal
export const createFlashDeal = async (req, res) => {
    try {
        const { title, startDate, endDate } = req.body;
        const image = req.file ? req.file.path : '';

        const newFlashDeal = new FlashDeal({
            title,
            startDate,
            endDate,
            image,
            status: 'inactive', // Default status is inactive
        });

        await newFlashDeal.save();
<<<<<<< HEAD
        // Cache the newly created deal with its specific key
        await setCache(`flashDeal_${newFlashDeal._id}`, newFlashDeal);

        res.status(201).json({ message: 'Flash deal created successfully', flashDeal: newFlashDeal });
    } catch (error) {
        logger.error(`Error creating flash deal: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get Flash Deals with Caching
export const getFlashDeals = async (req, res) => {
    try {
        const cacheKey = 'flashDeals';
        const cachedData = await getCache(cacheKey);

        if (cachedData) {
            return res.status(200).json({
                success: true,
                message: 'Flash deals retrieved successfully (from cache)',
                docs: cachedData,
            });
        }

        // Fetch from DB if not in cache
        const flashDeals = await FlashDeal.find().populate({
            path: 'productId',
            select: 'name price description thumbnail', // Specify the fields to return
=======
        res.status(201).json({ message: 'Flash deal created successfully', flashDeal: newFlashDeal });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Flash Deals
export const getFlashDeals = async (req, res) => {
    try {
        const flashDeals = await FlashDeal.find().populate({
            path: 'productId',
            select: 'name price description thumbnail' // Specify the fields to return
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
        });

        // Check expiration for each deal
        for (let deal of flashDeals) {
            if (checkExpiration(deal)) {
                deal.status = 'expired'; // Update status to expired
                await deal.save(); // Save updated status to DB
            }
        }

<<<<<<< HEAD
        // Cache the fetched deals
        await setCache(cacheKey, flashDeals, 3600); // Cache for 1 hour
        res.status(200).json({
            success: true,
            message: 'Flash deals retrieved successfully',
            docs: flashDeals,
        });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: error.message });
    }
};

// Get Flash Deal by ID
export const getFlashDealById = async (req, res) => {
    try {
        const { id } = req.params;

        // Check cache first
        const cacheKey = `flashDeal_${id}`;
        const cachedData = await getCache(cacheKey);

        if (cachedData) {
            logger.info(`Cache hit for key: ${cacheKey}`);
            return res.status(200).json({
                success: true,
                message: 'Flash deal retrieved successfully (from cache)',
                docs: cachedData,
            });
        }

        // Fetch from database if not in cache
        const flashDeal = await FlashDeal.findById(id).populate({
            path: 'productId',
            select: 'name price description thumbnail', // Specify the fields to return
        });
        if (!flashDeal) {
            logger.warn(`Flash deal with ID ${id} not found in database`);
            return res.status(404).json({ message: 'Flash deal not found' });
        }

        // Check expiration and update status
        if (checkExpiration(flashDeal)) {
            flashDeal.status = 'expired';
            await flashDeal.save();
        }

        // Set cache
        await setCache(cacheKey, flashDeal, 3600); // Cache for 1 hour
        logger.info(`Cache set for key: ${cacheKey}`);
        res.status(200).json({
            success: true,
            message: 'Flash deal retrieved successfully',
            docs: flashDeal,
        });
    } catch (error) {
        logger.error(`Error in getFlashDealById: ${error.message}`);
=======
        res.status(200).json(flashDeals);
    } catch (error) {
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
        res.status(500).json({ message: error.message });
    }
};

// Update Flash Deal
export const updateFlashDeal = async (req, res) => {
    try {
        const { id } = req.params;
<<<<<<< HEAD

        // Validate request body (Assuming flashDealValidationSchema is imported)
        const { error } = flashDealValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Update flash deal
        const updatedFlashDeal = await FlashDeal.findByIdAndUpdate(id, req.body, { new: true }).exec();

        if (!updatedFlashDeal) {
            return res.status(404).json({ message: 'Flash deal not found' });
        }

        // Check expiration and update status
        if (checkExpiration(updatedFlashDeal)) {
            updatedFlashDeal.status = 'expired';
            await updatedFlashDeal.save();
        }

        // Invalidate cache for updated deal and all deals list
        await deleteCache(`flashDeal_${id}`);
        await deleteCache('flashDeals');

        sendSuccessResponse(res, updatedFlashDeal, 'Flash deal updated successfully');
    } catch (error) {
        logger.error(error.message);
        sendErrorResponse(res, error);
    }
};

// Delete Flash Deal
export const deleteFlashDeal = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete flash deal
        const deletedFlashDeal = await FlashDeal.findByIdAndDelete(id);

        if (!deletedFlashDeal) {
            return res.status(404).json({ message: 'Flash deal not found' });
        }

        // Invalidate cache for deleted deal and all deals list
        await deleteCache(`flashDeal_${id}`);
        await deleteCache('flashDeals');

        sendSuccessResponse(res, deletedFlashDeal, 'Flash deal deleted successfully');
    } catch (error) {
        logger.error(error.message);
        sendErrorResponse(res, error);
=======
        const { title, startDate, endDate, status } = req.body;
        const image = req.file ? req.file.path : '';
        const updateData = { title, startDate, endDate, status, image }; // Include image in update

        const updatedFlashDeal = await FlashDeal.findByIdAndUpdate(id, updateData, { new: true });

        if (checkExpiration(updatedFlashDeal)) {
            updatedFlashDeal.status = 'expired'; // Automatically set to expired if past due
            await updatedFlashDeal.save();
        }

        res.status(200).json({ message: 'Flash deal updated successfully', flashDeal: updatedFlashDeal });
    } catch (error) {
        res.status(500).json({ message: error.message });
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
    }
};

// Add Product to Flash Deal
export const addProductToFlashDeal = async (req, res) => {
    try {
        const { id } = req.params;
        const { productId } = req.body;
<<<<<<< HEAD

=======
        console.log("producct id -----", product)
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
<<<<<<< HEAD

        const flashDeal = await FlashDeal.findById(id);
=======
        const flashDeal = await FlashDeal.findById(id);

>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
        if (!flashDeal) {
            return res.status(404).json({ message: 'Flash Deal not found' });
        }

        // Check if product is already in the flash deal
        if (flashDeal.productId.includes(productId)) {
            return res.status(400).json({ message: 'Product already in Flash Deal' });
        }

        // Add product to the flash deal
        flashDeal.productId.push(productId);
        flashDeal.activeProducts += 1;

        await flashDeal.save();
<<<<<<< HEAD
        await deleteCache(`flashDeal_${id}`);
        await deleteCache('flashDeals');

        sendSuccessResponse(res, flashDeal, 'Product added to Flash Deal successfully');
    } catch (error) {
        logger.error(error.message);
        sendErrorResponse(res, error);
    }
};

// // Remove Product from Flash Deal
// export const removeProductFromFlashDeal = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { productId } = req.body;

//         const flashDeal = await FlashDeal.findById(id);
//         if (!flashDeal) {
//             return res.status(404).json({ message: 'Flash Deal not found' });
//         }

//         // Check if the product is in the flash deal
//         if (!flashDeal.productId.includes(productId)) {
//             return res.status(400).json({ message: 'Product not found in Flash Deal' });
//         }

//         // Remove product from the flash deal
//         flashDeal.productId = flashDeal.productId.filter(pid => pid.toString() !== productId);
//         flashDeal.activeProducts -= 1;

//         await flashDeal.save();
//         await deleteCache(`flashDeal_${id}`);
//         await deleteCache('flashDeals');

//         sendSuccessResponse(res, flashDeal, 'Product removed from Flash Deal successfully');
//     } catch (error) {
//         logger.error(error.message);
//         sendErrorResponse(res, error);
//     }
// };



// Remove Product from Flash Deal
export const removeProductFromFlashDeal = async (req, res) => {
    try {
        const { id,productId } = req.params; // Flash Deal ID

        // Check if ID and productId are provided
        if (!id || !productId) {
            return res.status(400).json({ message: 'Flash Deal ID and Product ID are required' });
        }

        // Find the Flash Deal
        const flashDeal = await FlashDeal.findById(id);
        if (!flashDeal) {
            return res.status(404).json({ message: 'Flash Deal not found' });
        }

        // Check if the product is in the Flash Deal
        if (!flashDeal.productId.includes(productId)) {
            return res.status(400).json({ message: 'Product not found in Flash Deal' });
        }

        // Remove product from the Flash Deal
        flashDeal.productId = flashDeal.productId.filter(pid => pid.toString() !== productId);
        flashDeal.activeProducts -= 1;

        // Save updated Flash Deal
        await flashDeal.save();

        // Invalidate cache
        await deleteCache(`flashDeal_${id}`);
        await deleteCache('flashDeals');

        sendSuccessResponse(res, flashDeal, 'Product removed from Flash Deal successfully');
    } catch (error) {
        logger.error(`Error removing product from Flash Deal: ${error.message}`);
        sendErrorResponse(res, error);
    }
};
// Update Flash Deal Status
=======
        res.status(200).json({ message: 'Product added to Flash Deal successfully', flashDeal });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update the status of a Flash Deal
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
export const updateFlashDealStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

<<<<<<< HEAD
        const validStatuses = ['active', 'inactive', 'expired'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const updatedFlashDeal = await FlashDeal.findByIdAndUpdate(id, { status }, { new: true }).exec();
        if (!updatedFlashDeal) {
            return res.status(404).json({ message: 'Flash deal not found' });
        }

        await deleteCache(`flashDeal_${id}`);
        await deleteCache('flashDeals');

        sendSuccessResponse(res, updatedFlashDeal, 'Flash deal status updated successfully');
    } catch (error) {
        logger.error(error.message);
        sendErrorResponse(res, error);
    }
};

// Update Publish Status
=======
        const updatedFlashDeal = await FlashDeal.findByIdAndUpdate(
            id,
            { status },
            { new: true } // Return the updated document
        );

        if (!updatedFlashDeal) {
            return res.status(404).json({ message: 'Flash Deal not found' });
        }

        res.status(200).json({ message: 'Flash Deal status updated successfully', flashDeal: updatedFlashDeal });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Publish Status of Flash Deal
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
export const updatePublishStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { publish } = req.body;

<<<<<<< HEAD
        // Validate publish status (true/false)
        if (typeof publish !== 'boolean') {
            return res.status(400).json({ message: 'Invalid publish status' });
        }

        // Update the publish status
        const updatedFlashDeal = await FlashDeal.findByIdAndUpdate(id, { publish }, { new: true }).exec();
        if (!updatedFlashDeal) {
            return res.status(404).json({ message: 'Flash deal not found' });
        }

        await deleteCache(`flashDeal_${id}`);
        await deleteCache('flashDeals');

        sendSuccessResponse(res, updatedFlashDeal, 'Publish status updated successfully');
    } catch (error) {
        logger.error(error.message);
        sendErrorResponse(res, error);
    }
}
=======
        const updatedFlashDeal = await FlashDeal.findByIdAndUpdate(
            id,
            { publish },
            { new: true } // Return the updated document
        );

        if (!updatedFlashDeal) {
            return res.status(404).json({ message: 'Flash Deal not found' });
        }

        res.status(200).json({ message: 'Publish status updated successfully', flashDeal: updatedFlashDeal });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Delete Flash Deal
export const deleteFlashDeal = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedFlashDeal = await FlashDeal.findByIdAndDelete(id);

        if (!deletedFlashDeal) {
            return res.status(404).json({ message: 'Flash Deal not found' });
        }

        res.status(200).json({ message: 'Flash Deal deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
