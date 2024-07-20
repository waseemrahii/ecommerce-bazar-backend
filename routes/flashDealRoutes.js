import express from 'express';
import multer from 'multer';
import {
    createFlashDeal,
    getFlashDeals,
    updateFlashDeal,
    addProductToFlashDeal,
    updateFlashDealStatus,
    updatePublishStatus,
    deleteFlashDeal
} from '../controllers/flashDealController.js';

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// Routes for flash deals
router.post('/', upload.single('image'), createFlashDeal);
router.get('/', getFlashDeals);
router.put('/:id', upload.single('image'), updateFlashDeal);
router.put('/:id/add-product', addProductToFlashDeal);
router.patch('/:id/status', updateFlashDealStatus);
router.patch('/:id/update-publish', updatePublishStatus);
router.delete('/:id', deleteFlashDeal);

export default router;
