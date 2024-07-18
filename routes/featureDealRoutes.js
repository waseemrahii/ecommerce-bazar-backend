import express from 'express';
import {
    createFeatureDeal,
    getFeatureDeals,
    updateFeatureDeal,
    addProductToFeatureDeal,
    updateFeatureDealStatus
} from '../controllers/featuredDealController.js';

const router = express.Router();

// Routes for flash deals
router.post('/', createFeatureDeal); // Create a new flash deal
router.get('/', getFeatureDeals); // Get all flash deals
router.put('/:id', updateFeatureDeal); // Update an existing flash deal
router.put('/:id/add-product', addProductToFeatureDeal); // Add a product to an existing flash deal
router.patch('/:id/status', updateFeatureDealStatus); // Update the status of an existing flash deal

export default router;
