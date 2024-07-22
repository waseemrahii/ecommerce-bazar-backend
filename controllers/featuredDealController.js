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
        res.status(500).json({ message: error.message });
    }
};


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

        // Add the product to the feature deal if it isn't already included
        if (!featureDeal.productIds.includes(productId)) {
            featureDeal.productIds.push(productId);
            featureDeal.activeProducts = featureDeal.productIds.length;
            await featureDeal.save();
        }

        res.status(200).json({ message: 'Product added to Feature Deal successfully', featureDeal });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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



export const deleteProductFromFeatureDeal = async (req, res) => {
    try {
        const { id, productId } = req.params;

        const featureDeal = await FeatureDeal.findById(id);
        if (!featureDeal) {
            return res.status(404).json({ message: 'Feature Deal not found' });
        }

        // Remove the product from the feature deal
        featureDeal.productIds = featureDeal.productIds.filter(pid => pid.toString() !== productId);
        featureDeal.activeProducts = featureDeal.productIds.length;

        await featureDeal.save();

        res.status(200).json({ message: 'Product removed from Feature Deal successfully', featureDeal });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};