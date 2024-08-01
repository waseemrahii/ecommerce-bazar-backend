import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  searchNotifications,
  incrementNotificationCount,
} from '../controllers/notificationController.js';

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Rename file to include timestamp
  }
});

const upload = multer({ storage });

const router = express.Router();

// Get all notifications
router.get('/', getAllNotifications);

// Search notifications
router.get('/search', searchNotifications);

// Get a notification by ID
router.get('/:id', getNotificationById);

// Create a new notification with image upload
router.post('/', upload.single('image'), createNotification);

// Update an existing notification with image upload
router.put('/:id', upload.single('image'), updateNotification);

// Increment notification count
router.put('/:id/increment', incrementNotificationCount);

// Delete a notification
router.delete('/:id', deleteNotification);

export default router;
