import { Router } from 'express';
import multer from 'multer';
import ProductsController from '../controllers/products';
// import checkAuth from '../middleware/check-auth';

const router = Router();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.get('/', ProductsController.products_get_all);
router.post('/', upload.single('productImage'), ProductsController.products_create_product);
router.get('/:productId', ProductsController.products_get_product);
router.patch('/:productId', ProductsController.products_edit_product);
router.delete('/:productId', ProductsController.products_delete_product);

export default router;