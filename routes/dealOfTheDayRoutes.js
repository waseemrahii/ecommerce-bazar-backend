import express from 'express';
import {
    createDealOfTheDay,
    getAllDealsOfTheDay,
    getDealOfTheDayById,
    updateDealOfTheDay,
    deleteDealOfTheDay,
    updateDealOfTheDayStatus
} from '../controllers/dealOfTheDayController.js';

const router = express.Router();

// Create a Deal of the Day
router.post('/', createDealOfTheDay);

// Get all Deals of the Day
router.get('/', getAllDealsOfTheDay);

// Get Deal of the Day by ID
router.get('/:id', getDealOfTheDayById);

// Update Deal of the Day
router.put('/:id', updateDealOfTheDay);

// Delete Deal of the Day
router.delete('/:id', deleteDealOfTheDay);

// Update the status of a Deal of the Day
router.patch('/:id/status', updateDealOfTheDayStatus);

export default router;
