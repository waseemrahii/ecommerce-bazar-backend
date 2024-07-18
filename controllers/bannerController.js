// controllers/bannerController.js
import Banner from '../models/bannerModel.js';

export const createBanner = async (req, res) => {
    try {
        const { bannerType, resourceType, resourceId, url } = req.body;
        const bannerImage = req.file.path; // Assuming you're using multer for file uploads
        console.log("req body --------", req.body)
        const newBanner = new Banner({
            bannerType,
            resourceType,
            resourceId,
            url,
            bannerImage,
        });

        console.log("newbanner========", newBanner)
        await newBanner.save();
        res.status(201).json({ message: 'Banner created successfully', banner: newBanner });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
