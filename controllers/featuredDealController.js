import FeatureDeal from '../models/featuredDealModel.js';
import Product from '../models/ProductModels.js';

// Function to check expiration status
const checkExpiration = (FeatureDeal) => {
    const currentDate = new Date();
    const endDate = new Date(FeatureDeal.endDate);
    return currentDate > endDate; // Returns true if expired
};

// Create Flash Deal
export const createFeatureDeal = async (req, res) => {
    try {
        const { title, startDate, endDate } = req.body;

        const newFeatureDeal = new FeatureDeal({
            title,
            startDate,
            endDate,
            status: 'inactive', // Default status is inactive
        });

        await newFeatureDeal.save();
        res.status(201).json({ message: 'Flash deal created successfully', FeatureDeal: newFeatureDeal });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Flash Deals
export const getFeatureDeals = async (req, res) => {
    try {
        const FeatureDeals = await FeatureDeal.find().populate({
            path: 'productId',
            select: 'name price description thumbnail' // Specify the fields to return
        });

        // Check expiration for each deal
        FeatureDeals.forEach((deal) => {
            if (checkExpiration(deal)) {
                deal.status = 'expired'; // Update status to expired
                deal.save(); // Save updated status to DB
            }
        });

        res.status(200).json(FeatureDeals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Flash Deal
export const updateFeatureDeal = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, startDate, endDate, status } = req.body;
        const updateData = { title, startDate, endDate, status };

        const updatedFeatureDeal = await FeatureDeal.findByIdAndUpdate(id, updateData, { new: true });

        if (checkExpiration(updatedFeatureDeal)) {
            updatedFeatureDeal.status = 'expired'; // Automatically set to expired if past due
            await updatedFeatureDeal.save();
        }

        res.status(200).json({ message: 'Flash deal updated successfully', FeatureDeal: updatedFeatureDeal });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add Product to Flash Deal

// Add Product to Feature Deal
export const addProductToFeatureDeal = async (req, res) => {
    try {
        const { id } = req.params;
        const { productId } = req.body;

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const featureDeal = await FeatureDeal.findById(id);
        if (!featureDeal) {
            return res.status(404).json({ message: 'Feature Deal not found' });
        }

        // Increment the activeProducts count
        featureDeal.activeProducts += 1;
        featureDeal.productId = productId;

        await featureDeal.save();
        res.status(200).json({ message: 'Product added to Feature Deal successfully', featureDeal });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Update the status of a Flash Deal
export const updateFeatureDealStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

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
