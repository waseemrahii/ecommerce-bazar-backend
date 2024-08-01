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
<<<<<<< HEAD
  deleteBrand,
  updateBrandStatus
=======
  deleteBrand
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
} from '../controllers/brandController.js';
import { uploadThumbnail } from '../config/multer-config.js';
const router = express.Router();

router.post('/',uploadThumbnail,createBrand)

router.route('/').get(getBrands);
router.route('/:id').get(getBrandById).put(updateBrand).delete(deleteBrand);
<<<<<<< HEAD
router.put('/:id/status', updateBrandStatus);
=======

>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
// router.post('/', uploadThumbnail, uploadImages, createProduct); 
export default router;
