import express from 'express';
import multer from 'multer';
import {
    createFlashDeal,
    getFlashDeals,
    updateFlashDeal,
    addProductToFlashDeal,
    updateFlashDealStatus,
    updatePublishStatus,
<<<<<<< HEAD
    deleteFlashDeal,
    getFlashDealById,
    removeProductFromFlashDeal
=======
    deleteFlashDeal
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
} from '../controllers/flashDealController.js';

const router = express.Router();

<<<<<<< HEAD
// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

// Middleware to log file uploads
router.use((req, res, next) => {
    if (req.file) {
        console.log('Uploaded file:', req.file);
    }
    next();
});
=======
const upload = multer({ dest: 'uploads/' });
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a

// Routes for flash deals
router.post('/', upload.single('image'), createFlashDeal);
router.get('/', getFlashDeals);
<<<<<<< HEAD
router.get('/:id', getFlashDealById);
router.put('/:id', upload.single('image'), updateFlashDeal);
router.put('/:id/add-product', addProductToFlashDeal);
router.delete('/:id/remove-product/:productId', removeProductFromFlashDeal);
=======
router.put('/:id', upload.single('image'), updateFlashDeal);
router.put('/:id/add-product', addProductToFlashDeal);
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
router.patch('/:id/status', updateFlashDealStatus);
router.patch('/:id/update-publish', updatePublishStatus);
router.delete('/:id', deleteFlashDeal);

export default router;
