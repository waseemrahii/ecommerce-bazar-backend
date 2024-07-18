import express from 'express';
import {
    createColor,
    getColors,
    getColorById,
    updateColor,
    deleteColor
} from '../controllers/colorController.js';

const router = express.Router();

// Create a new color
router.post('/', createColor);

// Get all colors
router.get('/', getColors);

// Get a single color by ID
router.get('/:id', getColorById);

// Update a color by ID
router.put('/:id', updateColor);

// Delete a color by ID
router.delete('/:id', deleteColor);

export default router;
