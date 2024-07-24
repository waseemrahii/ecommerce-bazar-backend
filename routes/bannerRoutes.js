// routes/bannerRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { createBanner, getBanners, updateBanner, deleteBanner,updatePublishStatus, getBannerById } 
from '../controllers/bannerController.js';

const router = express.Router();

// Configure storage for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
    fileFilter
});

// Route to create a new banner with file upload
router.post('/', upload.single('bannerImage'), createBanner);

// Route to get all banners
router.get('/', getBanners);

// Route to update a banner (including publish field)
router.put('/:id', upload.single('bannerImage'), updateBanner);

// Route to delete a banner
router.get('/:id', getBannerById);
router.delete('/:id', deleteBanner);


// Route to update the publish status of a banner
router.patch('/:id/publish', updatePublishStatus);
export default router;
