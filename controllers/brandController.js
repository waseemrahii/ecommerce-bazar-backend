
import Brand from '../models/brandModel.js';

// Create a new brand
export const createBrand = async (req, res) => {
    try {
        const { name, imageAltText } = req.body;
        const thumbnail = req.file ? req.file.path : undefined;

        const newBrand = new Brand({
            name,
            thumbnail,
            imageAltText,
        });

        const savedBrand = await newBrand.save();
        res.status(201).json(savedBrand);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all brands
export const getBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        res.status(200).json(brands);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a brand by ID
export const getBrandById = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.status(200).json(brand);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a brand by ID
export const updateBrand = async (req, res) => {
    try {
        const { name, imageAltText } = req.body;
        const thumbnail = req.file ? req.file.path : undefined;

        const updatedBrand = await Brand.findByIdAndUpdate(
            req.params.id,
            { name, thumbnail, imageAltText },
            { new: true }
        );

        if (!updatedBrand) {
            return res.status(404).json({ message: 'Brand not found' });
        }

        res.status(200).json(updatedBrand);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a brand by ID
export const deleteBrand = async (req, res) => {
    try {
        const deletedBrand = await Brand.findByIdAndDelete(req.params.id);
        if (!deletedBrand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.status(200).json({ message: 'Brand deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
