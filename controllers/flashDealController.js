import FlashDeal from '../models/flashDealModel.js';

// Function to check expiration status
const checkExpiration = (flashDeal) => {
    const currentDate = new Date();
    const endDate = new Date(flashDeal.endDate);
    return currentDate > endDate; // Returns true if expired
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
        });

        // Check expiration for each deal
        flashDeals.forEach(async (deal) => {
            if (checkExpiration(deal)) {
                deal.status = 'expired'; // Update status to expired
                await deal.save(); // Save updated status to DB
            }
        });

        res.status(200).json(flashDeals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Flash Deal
export const updateFlashDeal = async (req, res) => {
    try {
        const { id } = req.params;
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
    }
};

// Add Product to Flash Deal
export const addProductToFlashDeal = async (req, res) => {
    try {
        const { id } = req.params;
        const { productId } = req.body;

        const flashDeal = await FlashDeal.findById(id);

        if (!flashDeal) {
            return res.status(404).json({ message: 'Flash Deal not found' });
        }

        // Increment the activeProducts count
        flashDeal.activeProducts += 1;

        await flashDeal.save();
        res.status(200).json({ message: 'Product added to Flash Deal successfully', flashDeal });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update the status of a Flash Deal
export const updateFlashDealStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

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
