// routes/bannerRoutes.js
import express from 'express';
import { createBanner } from '../controllers/bannerController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Configure multer

router.post('/', upload.single('banner_image'), createBanner);

export default router;
