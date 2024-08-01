// import express from 'express';
// import {
//   createBrand,
//   getBrands,
//   getBrandById,
//   updateBrand,
//   deleteBrand
// } from '../controllers/brandController.js';

// const router = express.Router();

// router.route('/').post(createBrand).get(getBrands);
// router.route('/:id').get(getBrandById).put(updateBrand).delete(deleteBrand);

// export default router;



import express from 'express';
import {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
  updateBrandStatus
} from '../controllers/brandController.js';
import { uploadThumbnail } from '../config/multer-config.js';
const router = express.Router();

router.post('/',uploadThumbnail,createBrand)

router.route('/').get(getBrands);
router.route('/:id').get(getBrandById).put(updateBrand).delete(deleteBrand);
router.put('/:id/status', updateBrandStatus);
// router.post('/', uploadThumbnail, uploadImages, createProduct); 
export default router;
