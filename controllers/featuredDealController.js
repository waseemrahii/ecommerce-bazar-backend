<<<<<<< HEAD


import FeatureDeal from '../models/featuredDealModel.js';
import Product from '../models/ProductModels.js';
import { sendErrorResponse, sendSuccessResponse } from '../utils/responseHandler.js';
import { getCache, setCache, deleteCache } from '../utils/redisUtils.js'; // Import Redis utilities
import logger from '../utils/logger.js';

// Function to check expiration status
const checkExpiration = (featureDeal) => {
    const currentDate = new Date();
    const endDate = new Date(featureDeal.endDate);
    return currentDate > endDate; // Returns true if expired
};

export const createFeatureDeal = async (req, res) => {
    try {
        const { title, startDate, endDate } = req.body;
=======
import FeatureDeal from '../models/featuredDealModel.js';
import Product from '../models/ProductModels.js';

// Function to check expiration status
const checkExpiration = (FeatureDeal) => {
    const currentDate = new Date();
    const endDate = new Date(FeatureDeal.endDate);
    return currentDate > endDate; // Returns true if expired
};

// 
export const createFeatureDeal = async (req, res) => {
    try {
        const { title, startDate, endDate } = req.body;
        console.log("creation feature deal", req.body)
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
        const newFeatureDeal = new FeatureDeal({
            title,
            startDate,
            endDate,
<<<<<<< HEAD
            status: 'inactive',
        });

        await newFeatureDeal.save();
        await setCache(`featureDeal_${newFeatureDeal._id}`, newFeatureDeal);

        // Invalidate general cache if needed
        await deleteCache('featureDeals'); // Clear the list cache

        res.status(201).json({ message: 'Feature deal created successfully', featureDeal: newFeatureDeal });
    } catch (error) {
        logger.error(`Error creating feature deal: ${error.message}`);
=======
            status: 'inactive', // Default status is inactive
        });

        await newFeatureDeal.save();
        res.status(201).json({ message: 'Flash deal created successfully', FeatureDeal: newFeatureDeal });
    } catch (error) {
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
        res.status(500).json({ message: error.message });
    }
};



<<<<<<< HEAD


export const getFeatureDeals = async (req, res) => {
    try {
        const cacheKey = 'featureDeals';
        const { title, startDate, endDate, status } = req.query;

        const cachedData = await getCache(cacheKey);
        if (cachedData) {
            const filteredData = cachedData.filter(deal => {
                let matches = true;

                if (title) {
                    matches = deal.title.toLowerCase().includes(title.toLowerCase());
                }
                if (status && deal.status !== status) {
                    matches = false;
                }
                if (startDate || endDate) {
                    const dealStartDate = new Date(deal.startDate);
                    const dealEndDate = new Date(deal.endDate);
                    const queryStartDate = startDate ? new Date(startDate) : null;
                    const queryEndDate = endDate ? new Date(endDate) : null;

                    if (queryStartDate && dealStartDate < queryStartDate) {
                        matches = false;
                    }
                    if (queryEndDate && dealEndDate > queryEndDate) {
                        matches = false;
                    }
                }
                return matches;
            });

            return res.status(200).json({
                success: true,
                message: 'Feature deals retrieved successfully (from cache)',
                docs: filteredData,
            });
        }

        const query = {};
        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }
        if (status) {
            query.status = status;
        }
        if (startDate || endDate) {
            query.startDate = {};
            if (startDate) {
                query.startDate.$gte = new Date(startDate);
            }
            if (endDate) {
                query.startDate.$lte = new Date(endDate);
            }
        }

        const featureDeals = await FeatureDeal.find(query).populate({
            path: 'productIds',
            select: 'name price description thumbnail',
        });

        for (let deal of featureDeals) {
            if (checkExpiration(deal)) {
                deal.status = 'expired';
                await deal.save();
            }
        }

        await setCache(cacheKey, featureDeals, 3600);
        res.status(200).json({
            success: true,
            message: 'Feature deals retrieved successfully',
            docs: featureDeals,
        });
    } catch (error) {
        logger.error(`Error retrieving feature deals: ${error.message}`);
=======
export const getFeatureDeals = async (req, res) => {
    try {
        const featureDeals = await FeatureDeal.find().populate({
                        path: 'productIds',
                        select: 'name price description thumbnail' // Specify the fields to return
                    });
        // Check expiration for each deal
        featureDeals.forEach((deal) => {
            if (checkExpiration(deal)) {
                deal.status = 'expired'; // Update status to expired
                deal.save(); // Save updated status to DB
            }
        });

        res.status(200).json(featureDeals);
    } catch (error) {
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
        res.status(500).json({ message: error.message });
    }
};


<<<<<<< HEAD


export const getFeatureDealById = async (req, res) => {
    try {
        const { id } = req.params;
        const cacheKey = `featureDeal_${id}`;
        const cachedData = await getCache(cacheKey);

        if (cachedData) {
            logger.info(`Cache hit for key: ${cacheKey}`);
            return res.status(200).json({
                success: true,
                message: 'Feature deal retrieved successfully (from cache)',
                docs: cachedData,
            });
        }

        const featureDeal = await FeatureDeal.findById(id).populate({
            path: 'productIds',
            select: 'name price description thumbnail',
        });

        if (!featureDeal) {
            logger.warn(`Feature deal with ID ${id} not found in database`);
            return res.status(404).json({ message: 'Feature deal not found' });
        }

        if (checkExpiration(featureDeal)) {
            featureDeal.status = 'expired';
            await featureDeal.save();
        }

        await setCache(cacheKey, featureDeal, 3600); // Cache for 1 hour
        logger.info(`Cache set for key: ${cacheKey}`);
        res.status(200).json({
            success: true,
            message: 'Feature deal retrieved successfully',
            docs: featureDeal,
        });
    } catch (error) {
        logger.error(`Error in getFeatureDealById: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

=======
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
export const updateFeatureDeal = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, startDate, endDate, status } = req.body;
        const updateData = { title, startDate, endDate, status };

        const updatedFeatureDeal = await FeatureDeal.findByIdAndUpdate(id, updateData, { new: true });

        if (checkExpiration(updatedFeatureDeal)) {
<<<<<<< HEAD
            updatedFeatureDeal.status = 'expired';
            await updatedFeatureDeal.save();
        }

        await deleteCache(`featureDeal_${id}`);
        await deleteCache('featureDeals');

        sendSuccessResponse(res, updatedFeatureDeal, 'Feature deal updated successfully');
    } catch (error) {
        logger.error(`Error updating feature deal: ${error.message}`);
        sendErrorResponse(res, error);
=======
            updatedFeatureDeal.status = 'expired'; // Automatically set to expired if past due
            await updatedFeatureDeal.save();
        }

        res.status(200).json({ message: 'Flash deal updated successfully', FeatureDeal: updatedFeatureDeal });
    } catch (error) {
        res.status(500).json({ message: error.message });
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
    }
};


<<<<<<< HEAD
// Add Product to Feature Deal
=======
// export const addProductToFeatureDeal = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { productId } = req.body;

//         // Check if the product exists
//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }

//         const featureDeal = await FeatureDeal.findById(id);
//         if (!featureDeal) {
//             return res.status(404).json({ message: 'Feature Deal not found' });
//         }

//         // Increment the activeProducts count
//         featureDeal.activeProducts += 1;
//         featureDeal.productId = productId;

//         await featureDeal.save();
//         res.status(200).json({ message: 'Product added to Feature Deal successfully', featureDeal });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
export const addProductToFeatureDeal = async (req, res) => {
    try {
        const { id } = req.params;
        const { productId } = req.body;

<<<<<<< HEAD
=======
        // Check if the product exists
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const featureDeal = await FeatureDeal.findById(id);
        if (!featureDeal) {
            return res.status(404).json({ message: 'Feature Deal not found' });
        }

<<<<<<< HEAD
=======
        // Add the product to the feature deal if it isn't already included
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
        if (!featureDeal.productIds.includes(productId)) {
            featureDeal.productIds.push(productId);
            featureDeal.activeProducts = featureDeal.productIds.length;
            await featureDeal.save();
<<<<<<< HEAD

            await deleteCache(`featureDeal_${id}`);
            await deleteCache('featureDeals');
=======
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
        }

        res.status(200).json({ message: 'Product added to Feature Deal successfully', featureDeal });
    } catch (error) {
<<<<<<< HEAD
        logger.error(`Error adding product to feature deal: ${error.message}`);
=======
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
        res.status(500).json({ message: error.message });
    }
};

<<<<<<< HEAD
// Remove Product from Feature Deal
export const removeProductFromFeatureDeal = async (req, res) => {
    try {
        const { id } = req.params;
        const { productId } = req.body;

        const featureDeal = await FeatureDeal.findById(id);
        if (!featureDeal) {
            return res.status(404).json({ message: 'Feature Deal not found' });
        }

        if (!featureDeal.productIds.includes(productId)) {
            return res.status(400).json({ message: 'Product not found in Feature Deal' });
        }

        featureDeal.productIds = featureDeal.productIds.filter(pid => pid.toString() !== productId);
        featureDeal.activeProducts = featureDeal.productIds.length;

        await featureDeal.save();
        await deleteCache(`featureDeal_${id}`);
        await deleteCache('featureDeals');

        res.status(200).json({ message: 'Product removed from Feature Deal successfully', featureDeal });
    } catch (error) {
        logger.error(`Error removing product from feature deal: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

// Update Feature Deal Status
=======
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
export const updateFeatureDealStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

<<<<<<< HEAD
        const validStatuses = ['active', 'inactive', 'expired'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const updatedFeatureDeal = await FeatureDeal.findByIdAndUpdate(id, { status }, { new: true });

        if (!updatedFeatureDeal) {
            return res.status(404).json({ message: 'Feature Deal not found' });
        }

        await deleteCache(`featureDeal_${id}`);
        await deleteCache('featureDeals');

        sendSuccessResponse(res, updatedFeatureDeal, 'Feature Deal status updated successfully');
    } catch (error) {
        logger.error(`Error updating feature deal status: ${error.message}`);
        sendErrorResponse(res, error);
    }
};

// Update Publish Status
export const updatePublishStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { publish } = req.body;

        if (typeof publish !== 'boolean') {
            return res.status(400).json({ message: 'Invalid publish status' });
        }

        const updatedFeatureDeal = await FeatureDeal.findByIdAndUpdate(id, { publish }, { new: true });

        if (!updatedFeatureDeal) {
            return res.status(404).json({ message: 'Feature Deal not found' });
        }

        await deleteCache(`featureDeal_${id}`);
        await deleteCache('featureDeals');

        sendSuccessResponse(res, updatedFeatureDeal, 'Publish status updated successfully');
    } catch (error) {
        logger.error(`Error updating publish status: ${error.message}`);
        sendErrorResponse(res, error);
    }
};

// Delete Product from Feature Deal
=======
        const updatedFeatureDeal = await FeatureDeal.findByIdAndUpdate(
            id,
            { status },
            { new: true } // Return the updated document
        );

        if (!updatedFeatureDeal) {
            return res.status(404).json({ message: 'Flash Deal not found' });
        }

        res.status(200).json({ message: 'Flash Deal status updated successfully', FeatureDeal: updatedFeatureDeal });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Delete a feature deal
export const deleteFeatureDeal = async (req, res) => {
    try {
        const { id } = req.params;

        const featureDeal = await FeatureDeal.findByIdAndDelete(id);

        if (!featureDeal) {
            return res.status(404).json({ message: 'Feature Deal not found' });
        }

        res.status(200).json({ message: 'Feature Deal deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Get a specific feature deal by ID
export const getFeatureDealById = async (req, res) => {
    const { id } = req.params;
    try {
        const featureDeal = await FeatureDeal.findById(id).populate({
                        path: 'productIds',
                        select: 'name price description thumbnail' // Specify the fields to return
                    });

        if (!featureDeal) {
            return res.status(404).json({ message: 'Feature deal not found' });
        }
        res.status(200).json(featureDeal);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};



>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
export const deleteProductFromFeatureDeal = async (req, res) => {
    try {
        const { id, productId } = req.params;

        const featureDeal = await FeatureDeal.findById(id);
        if (!featureDeal) {
            return res.status(404).json({ message: 'Feature Deal not found' });
        }

        // Remove the product from the feature deal
<<<<<<< HEAD
        if (!featureDeal.productIds.includes(productId)) {
            return res.status(400).json({ message: 'Product not found in Feature Deal' });
        }

=======
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
        featureDeal.productIds = featureDeal.productIds.filter(pid => pid.toString() !== productId);
        featureDeal.activeProducts = featureDeal.productIds.length;

        await featureDeal.save();

<<<<<<< HEAD
        // Invalidate the cache for the updated feature deal and all feature deals
        await deleteCache(`featureDeal_${id}`);
        await deleteCache('featureDeals');

        res.status(200).json({ message: 'Product removed from Feature Deal successfully', featureDeal });
    } catch (error) {
        logger.error(`Error removing product from feature deal: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

// Delete Feature Deal
export const deleteFeatureDeal = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete the feature deal from the database
        const featureDeal = await FeatureDeal.findByIdAndDelete(id);

        if (!featureDeal) {
            return res.status(404).json({ message: 'Feature Deal not found' });
        }

        // Invalidate the cache for the deleted feature deal and all feature deals
        await deleteCache(`featureDeal_${id}`);
        await deleteCache('featureDeals');

        res.status(200).json({ message: 'Feature Deal deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting feature deal: ${error.message}`);
=======
        res.status(200).json({ message: 'Product removed from Feature Deal successfully', featureDeal });
    } catch (error) {
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
        res.status(500).json({ message: error.message });
    }
};