import { Router } from 'express';
import multer from 'multer';
import ProductsController from '../controllers/products';
import checkAuth from '../middleware/check-auth';

const router = Router();

// storage options
const upload = multer({
  dest: './uploads/'
});

router.get('/', checkAuth, ProductsController.products_get_all);
router.post('/', upload.single('product_image'), checkAuth, ProductsController.products_create_product);
router.get('/:productId', checkAuth, ProductsController.products_get_product);
router.patch('/:productId', upload.single('product_image'), checkAuth, ProductsController.products_edit_product);
router.delete('/:productId', checkAuth, ProductsController.products_delete_product);

export default router;
